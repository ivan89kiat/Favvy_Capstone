import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { BACKEND_URL } from "./constant";
import { UserAuth } from "./UserContext";

export default function Dashboard() {
  const { isAuthenticated } = useAuth0();
  const { dbUser, accessToken } = UserAuth();
  const navigate = useNavigate();

  const [availableBalance, setAvailableBalance] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [budgetBalance, setBudgetBalance] = useState(0);
  const [financialStatus, setFinancialStatus] = useState("");
  const [pLExpenses, setPLExpenses] = useState("");
  const [totalSum, setTotalSum] = useState("");
  const [ratio, setRatio] = useState(0);
  const [budgetData, setBudgetData] = useState({});
  const [userData, setUserData] = useState([]);
  const [goal, setGoal] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/balance/${dbUser.id}`)
      .then((res) => {
        setAvailableBalance(res.data[0].amount);
      })
      .catch((error) => console.log(error.message));

    axios.get(`${BACKEND_URL}/loan/${dbUser.id}`).then((res) => {
      const { data } = res;
      setLiabilities(data);
    });

    axios
      .get(`${BACKEND_URL}/budget/${dbUser.id}`)
      .then((res) => {
        const { data } = res;
        setBudgetData(data);
      })
      .catch((error) => console.log(error.message));

    retrieveProfile();
    retrieveGoal();
  }, [dbUser]);

  useEffect(() => {
    calcCurrentLiabilities();
    calcBudgetTotalAmount();
    calcBudgetBalance();
  }, [liabilities, budgetData]);

  useEffect(() => {
    calcFinancialHealth();
  }, [totalBudget, availableBalance]);

  useEffect(() => {
    calcProjectedLivingExpenses();
  }, [goal, userData]);

  const calcBudgetTotalAmount = () => {
    let total = 0;
    for (let i = 0; i < budgetData.length; i++) {
      total += Number(budgetData[i].amount);
    }
    setTotalBudget(total);
  };

  const calcBudgetBalance = () => {
    let total = 0;
    for (let i = 0; i < budgetData.length; i++) {
      total += Number(budgetData[i].balance);
    }
    setBudgetBalance(total);
  };

  const calcCurrentLiabilities = () => {
    let sum = 0;
    for (let i = 0; i < liabilities.length; i++) {
      sum += Number(liabilities[i].amount);
    }
    setTotalLiabilities(sum);
  };

  const calcFinancialHealth = () => {
    let balance = Number(availableBalance);
    let budget = Number(totalBudget);
    let ratio = (balance / budget).toFixed(1);
    if (ratio > 6) {
      setFinancialStatus("green");
      setRatio(ratio);
    }
    if (ratio <= 5.9 && ratio >= 2.5) {
      setFinancialStatus("yellow");
      setRatio(ratio);
    }
    if (ratio < 2.5) {
      setFinancialStatus("red");
      setRatio(ratio);
    }
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

  return (
    <div>
      <h2>Financial Summary</h2>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Available Balance
              </Typography>
              {/* Display user's available balance */}
              <Typography variant="h4">
                ${dbUser && Number(availableBalance).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current Liabilities
              </Typography>
              {/* Display user's current liabilities */}
              <Typography variant="h4">
                ${dbUser && Number(totalLiabilities).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Budget
              </Typography>
              {/* Display user's budget */}
              <Typography variant="h4">
                ${dbUser && Number(totalBudget).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Budget Balance
              </Typography>
              {/* Display user's budget */}
              <Typography variant="h4">
                {" "}
                ${dbUser && Number(budgetBalance).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: "112.98px" }}>
              <Typography variant="h6" gutterBottom>
                Financial Status{" "}
                <Tooltip
                  title={
                    <div>
                      Green: Available Balance &gt; 6 months of Monthly Budget
                      <br />
                      <br />
                      Yellow: Available Balance &ge; 2.5 months of Monthly
                      Budget
                      <br />
                      <br />
                      Red: Available Balance &lt; 2.5 months of Monthly Budget
                    </div>
                  }
                >
                  <HelpOutlineIcon />
                </Tooltip>
              </Typography>{" "}
              {/* Display user's financial goal */}
              <Tooltip
                title={`Your Current Available Balance is sufficient for ${ratio}months of your monthly budget`}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: financialStatus,
                    "&:hover": {
                      backgroundColor: financialStatus,
                    },
                  }}
                />
              </Tooltip>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Financial Goal
              </Typography>
              {/* Display user's financial status */}
              <Typography variant="body1">
                Retirement Age: {goal.retirement_age}
              </Typography>
              <Typography variant="body1">
                Estimated Monthly Expenses Based On Current Value : $
                {goal.target_expenses}
              </Typography>
              <Typography variant="body1">
                Estimated Infation Until Retirement Age : {goal.est_inflation}%
              </Typography>
              <Typography variant="body1">
                Projected Monthly Expenses After Retirement Age : ${pLExpenses}
              </Typography>
              <Typography variant="body1">
                Total Expenses From Retirement Age Until 85yo : ${totalSum}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
