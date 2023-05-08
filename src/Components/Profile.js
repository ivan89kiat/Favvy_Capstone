import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
  const [userData, setUser] = useState({
    first_name: "ivan",
    last_name: "khor",
    mobile: "98765432",
    email: "ivankhor@test.com",
    dobirth: "Mon Aug 07 1989",
  });

  const displayProfile = (
    <div className="dashboard-section2">
      <div>First Name: {userData.first_name}</div>
      <div>Last Name: {userData.last_name}</div>
      <div>mobile: {userData.mobile}</div>
      <div>D.O.Birth: {userData.dobirth}</div>
    </div>
  );

  useEffect(() => {
    if (isAuthenticated) {
      // axios
      //   .get(`${process.env.BACKEND_URL}/profile`)
      //   .then((res) => {
      //     const { data } = res;
      //     setUserData(data);
      //   })
      //   .catch((error) => alert(error.message));
    } else {
      navigate("/");
    }
  }, []);

  // const handleSubmit = async (e) => {
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
  // };

  console.log(doBirth);
  return (
    <div>
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
          class="btn-close"
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
            <Form.Group className="form-group">
              <Form.Label className="compact-label">Date Of Birth: </Form.Label>
              <Form.Control
                value={new Date(doBirth).toDateString()}
                onFocus={() => setShowCalendar(true)}
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
  );
}
