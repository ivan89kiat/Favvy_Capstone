import React, { useEffect, useState } from "react";
import { UserAuth } from "./UserContext";
import axios from "axios";
import { BACKEND_URL } from "./constant";
import { Paper, Box, Grid, TextField, Divider, Button } from "@mui/material";

export default function Profile() {
  const { dbUser, accessToken } = UserAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [doBirth, setDoBirth] = useState("");
  const [retiredAge, setRetiredAge] = useState("");
  const [targetExpenses, setTargetExpenses] = useState("");
  const [estInflation, setEstInflation] = useState("");
  const [userData, setUserData] = useState([]);
  const [goal, setGoal] = useState([]);

  useEffect(() => {
    retrieveProfile();
  }, []);

  useEffect(() => {
    retrieveGoal();
  }, [userData.dobirth]);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setMobile(userData.mobile);
      setDoBirth(userData.dobirth);
    }
    if (goal) {
      setRetiredAge(goal.retirement_age);
      setTargetExpenses(goal.target_expenses);
      setEstInflation(goal.est_inflation);
    }
  }, [userData, goal]);

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
  };

  return (
    <div className="profile-page">
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 2, height: "75vh" }}>
              <h2>Personal Information</h2>
              <Divider sx={{ marginBottom: "15px" }} />
              <form onSubmit={handleSubmitProfile}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Mobile"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={doBirth}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    setDoBirth(e.target.value);
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  readOnly
                  InputLabelProps={{ shrink: true }}
                  value={userData.email}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" type="submit">
                    Save Changes
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: "75vh" }}>
              <h2>Financial Goals</h2>
              <Divider sx={{ marginBottom: "15px" }} />
              <form onSubmit={handleSubmitGoal}>
                <TextField
                  label="Retirement Age"
                  type="number"
                  value={retiredAge}
                  onChange={(e) => {
                    setRetiredAge(e.target.value);
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                <TextField
                  label="Target Living Expenses"
                  type="number"
                  value={targetExpenses}
                  onChange={(e) => {
                    setTargetExpenses(e.target.value);
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                <TextField
                  label="Estimated Inflation"
                  type="number"
                  value={estInflation}
                  onChange={(e) => {
                    setEstInflation(e.target.value);
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" type="submit">
                    Save Changes
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
