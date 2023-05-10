import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./Profile.css";
import Calendar from "react-calendar";

export default function Profile() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
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
  const [userData, setUser] = useState({
    first_name: "ivan",
    last_name: "khor",
    mobile: "98765432",
    email: "ivankhor@test.com",
    dobirth: "Mon Aug 07 1989",
  });
  const [goal, setGoal] = useState({
    retirement_age: "65",
    target_expenses: "1000",
    est_inflation: "3",
  });

  const displayProfile = (
    <div className="dashboard-section2">
      <div>First Name: {userData.first_name}</div>
      <div>Last Name: {userData.last_name}</div>
      <div>mobile: {userData.mobile}</div>
      <div>D.O.Birth: {userData.dobirth}</div>
      <div>Email: {userData.email}</div>
    </div>
  );

  useEffect(() => {
    if (isAuthenticated) {
      calcProjectedLivingExpenses();
      // axios
      //   .get(`${process.env.BACKEND_URL}/profile`)
      //   .then((res) => {
      //     const { data } = res;
      //     setUserData(data);
      //   })
      //   .catch((error) => alert(error.message));
      // axios
      //   .get(`${process.env.BACKEND_URL}/goal/:userId`)
      //   .then((res) => {
      //     const { data } = res;
      //     setGoal(data);
      //   })
      //   .catch((error) => {
      //     alert(error.message);
      //   });
    } else {
      navigate("/");
    }
  }, []);

  const resetInputField = () => {
    setFirstName("");
    setLastName("");
    setMobile("");
    setDoBirth("");
  };

  // const handleSubmitProfile = async (e) => {
  //   e.preventDefault();
  //   await axios.put(
  //     `${process.env.BACKEND_URL}/profile`,
  //     {
  //       first_name: firstName,
  //       last_name: lastName,
  //       mobile: mobile,
  //       dobirth: doBirth,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  // resetInputField();
  // };

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

  // const handleSubmitGoal = async (e) => {
  //   e.preventDefault();
  //   await axios.put(
  //     `${process.env.BACKEND_URL}/goal/:userId`,
  //     {
  //       retirement_age: retiredAge,
  //       target_expenses: targetExpenses,
  //       est_inflation: estInflation,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  //   setRetiredAge("");
  //   setTargetExpenses("");
  //   setEstInflation("");
  // };

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
            <Form>
              {/* handleSubmitProfile */}
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
                  value={userData.email}
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
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="primary-button" type="submit">
              Save Changes
            </Button>
            <Button className="secondary-button" onClick={() => setShow(false)}>
              Cancel
            </Button>
          </Modal.Footer>
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
          <Form>
            {/* handleSubmitGoal */}
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
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="primary-button" type="submit">
            Save Goals
          </Button>
          <Button
            className="secondary-button"
            onClick={() => setEditGoal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
