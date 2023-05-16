import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { UserAuth } from "./UserContext";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./Profile.css";
import Calendar from "react-calendar";
import { BACKEND_URL } from "./constant";

export default function Profile() {
  const { dbUser, accessToken } = UserAuth();
  const { isAuthenticated } = useAuth0();
  const [show, setShow] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [doBirth, setDoBirth] = useState("");
  const [editGoal, setEditGoal] = useState(false);
  const [retiredAge, setRetiredAge] = useState("");
  const [targetExpenses, setTargetExpenses] = useState("");
  const [estInflation, setEstInflation] = useState("");
  const [pLExpenses, setPLExpenses] = useState("");
  const [totalSum, setTotalSum] = useState("");
  const [userData, setUserData] = useState([]);
  const [goal, setGoal] = useState([]);

  useEffect(() => {
    retrieveProfile();
  }, []);

  useEffect(() => {
    retrieveGoal();
    calcProjectedLivingExpenses();
  }, [userData.dobirth, editGoal]);

  const displayProfile = userData && (
    <div className="dashboard-section2">
      <div>First Name: {userData.first_name}</div>
      <div>Last Name: {userData.last_name}</div>
      <div>mobile: {userData.mobile}</div>
      <div>D.O.Birth: {userData.dobirth}</div>
      <div>Email: {userData.email}</div>
    </div>
  );

  const resetInputField = () => {
    setShow(false);
    setFirstName("");
    setLastName("");
    setMobile("");
    setDoBirth("");
  };

  const retrieveProfile = () => {
    axios
      .post(
        `${BACKEND_URL}/profile`,
        {
          userEmail: dbUser.email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        const { data } = res;
        setUserData(data[0]);
        if (data[0].last_name === null) {
          alert("Please Edit Your Profile");
          setShow(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const retrieveGoal = () => {
    axios
      .get(`${BACKEND_URL}/profile/${dbUser.id}`)
      .then((res) => {
        const { data } = res;
        console.log(data[0]);
        setGoal(data[0]);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    await axios.put(
      `${BACKEND_URL}/profile`,
      {
        first_name: firstName,
        last_name: lastName,
        mobile: mobile,
        dobirth: doBirth,
        userEmail: dbUser.email,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    resetInputField();
  };

  const calcProjectedLivingExpenses = () => {
    const retirementAge = parseInt(goal.retirement_age);

    const numOfYearsTillRetired =
      new Date(userData.dobirth).getFullYear() +
      retirementAge -
      new Date().getFullYear();

    const estimatedInflation = parseInt(goal.est_inflation) / 100 + 1;

    const totalInflation = Math.pow(estimatedInflation, numOfYearsTillRetired);

    const projectedLivingExpenses = Math.round(
      parseInt(goal.target_expenses) * totalInflation
    );

    const numOfYearsTill85 = 85 - retirementAge;

    const totalSumNeeded = projectedLivingExpenses * numOfYearsTill85 * 12;

    setPLExpenses(projectedLivingExpenses);
    setTotalSum(totalSumNeeded);
  };

  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    await axios.put(
      `${BACKEND_URL}/profile/${dbUser.id}`,
      {
        retiredAge,
        targetExpenses,
        estInflation,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    setEditGoal(false);
    setRetiredAge("");
    setTargetExpenses("");
    setEstInflation("");
  };

  return (
    <div className="profile-page">
      <div className="profile">
        {isAuthenticated && displayProfile}
        <button
          onClick={() => {
            setShow(true);
            setFirstName(userData.first_name);
            setLastName(userData.last_name);
            setMobile(userData.mobile);
            setDoBirth(userData.dobirth);
          }}
        >
          Edit Profile
        </button>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          backdrop="static"
          centered
        >
          <button
            type="button"
            className="btn-close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShow(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <Modal.Header>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitProfile}>
              <Form.Group className="form-group">
                <Form.Label className="compact-label">First Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  className="field"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="compact-label">Last Name: </Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  className="field"
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="compact-label">Mobile: </Form.Label>
                <Form.Control
                  type="text"
                  value={mobile}
                  className="field"
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="form-group-email">
                <Form.Label className="compact-label">Email:</Form.Label>
                <Form.Control
                  value={userData && userData.email}
                  readOnly
                  className="field"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="compact-label">
                  Date Of Birth:{" "}
                </Form.Label>
                <Form.Control
                  value={new Date(doBirth).toDateString()}
                  onFocus={() => setShowCalendar(true)}
                  readOnly
                  className="field"
                />
                <Calendar
                  className={showCalendar ? "" : "hide"}
                  value={doBirth}
                  onChange={(value) => {
                    setDoBirth(new Date(value).toDateString());
                    setShowCalendar(false);
                  }}
                />
              </Form.Group>
              <Button className="primary-button" type="submit">
                Save Changes
              </Button>
              <Button
                className="secondary-button"
                onClick={() => setShow(false)}
              >
                Cancel
              </Button>{" "}
            </Form>
          </Modal.Body>
        </Modal>
      </div>

      <div className="financial-goal">Financial Goal:</div>
      {goal ? (
        <div>
          <div>Retirement Age: {goal.retirement_age}</div>
          <div>Target Living Expenses: $ {goal.target_expenses}</div>
          <div>Estimated Inflation: {goal.est_inflation} %</div>
          <div>Projected Living Expenses: $ {pLExpenses}</div>
          <div>Total Sum Required: $ {totalSum}</div>
        </div>
      ) : (
        "Setup Your Financial Goal"
      )}
      <button
        onClick={() => {
          setEditGoal(true);
          setRetiredAge(goal.retirement_age);
          setTargetExpenses(goal.target_expenses);
          setEstInflation(goal.est_inflation);
        }}
      >
        Edit Financial Goal
      </button>
      <Modal
        show={editGoal}
        onHide={() => setEditGoal(false)}
        backdrop="static"
        centered
      >
        <button
          type="button"
          className="btn-close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setEditGoal(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <Modal.Header>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitGoal}>
            <Form.Group className="form-group">
              <Form.Label className="compact-label">
                Retirement Age ($):
              </Form.Label>
              <Form.Control
                type="text"
                value={retiredAge}
                className="field-2"
                onChange={(e) => {
                  setRetiredAge(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="compact-label">
                Target Expenses ($):{" "}
              </Form.Label>
              <Form.Control
                type="text"
                value={targetExpenses}
                className="field-2"
                onChange={(e) => {
                  setTargetExpenses(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="compact-label">
                Estimated Inflation (%):
              </Form.Label>
              <Form.Control
                type="text"
                value={estInflation}
                className="field-2"
                onChange={(e) => {
                  setEstInflation(e.target.value);
                }}
              />
            </Form.Group>{" "}
            <Button className="primary-button" type="submit">
              Save Goals
            </Button>
            <Button
              className="secondary-button"
              onClick={() => setEditGoal(false)}
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
