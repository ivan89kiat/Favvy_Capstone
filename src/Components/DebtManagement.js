import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Card,
  Divider,
  TextField,
  Button,
  CardContent,
  Box,
  Tooltip,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
  Modal,
  ListItemButton,
  FormControl,
} from "@mui/material";
import axios from "axios";

export default function DebtManagement() {
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [EMI, setEMI] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [title, setTitle] = useState("");
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [data, setData] = useState([
    { id: 1, title: "Housing", amount: 150000, interest: 2.5, tenure: 120 },
    {
      id: 2,
      title: "Personal Loan",
      amount: 12000,
      interest: 7.56,
      tenure: 50,
    },
  ]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    calcCurrentLiabilities();
  }, []);

  const calculateEMI = () => {
    if (loanAmount === 0 || loanTerm === 0 || interestRate === 0) {
      alert("Invalid input. Please enter number larger than 0");
    } else {
      let interest = interestRate / 12 / 100;
      let emi = Math.round(
        (loanAmount * interest * Math.pow(1 + interest, loanTerm)) /
          (Math.pow(1 + interest, loanTerm) - 1)
      );

      let totalPayable = Math.round(emi * loanTerm);
      let totalInterestPayable = Math.round(totalPayable - loanAmount);
      setEMI(emi);
      setTotalAmount(totalPayable);
      setTotalInterest(totalInterestPayable);
      setShowResult(true);
    }
  };

  const resetLoanForm = () => {
    setShowLoanForm(false);
    setTitle("");
  };

  // const handleSubmitLoanForm = async (e) => {
  //   e.preventDefault();
  //   await axios.post(`${process.env.BACKEND_URL}/loan`, {
  //     title,
  //     loanAmount,
  //     loanTerm,
  //     totalAmount,
  //   });
  // };

  const calcCurrentLiabilities = () => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].amount;
    }
    setTotalLiabilities(sum);
  };

  const displayUserLoan = data
    ? data.map((item) => (
        <ListItemButton
          key={item.id}
          id={data.findIndex((object) => object.id === item.id)}
          onClick={(e) => {
            alert(
              `Are you sure you want to delete ${item.title} from your portfolio?`
            );
            setSelectedLoan(e.target.id);
          }}
          selected={
            selectedLoan !== "" &&
            Number(selectedLoan) ===
              data.findIndex((object) => object.id === item.id)
          }
        >
          Loan Title: {item.title} | Amount Payable: ${item.amount}
        </ListItemButton>
      ))
    : null;

  const resetRemoveLoan = () => {
    setShowDelete(false);
    setSelectedLoan("");
  };

  return (
    <div>
      <h2>Debt Management</h2>
      <Paper
        sx={{
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="left">
                    Current Liabilities: ${totalLiabilities.toLocaleString()}
                  </Typography>
                  <Divider sx={{ marginBottom: "3px" }} />
                </CardContent>
              </Card>
            </Paper>
          </Grid>
          <Divider sx={{ marginBottom: "10px" }} />
          <Grid item xs={6}>
            <Paper>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button size="small" onClick={() => setShowDelete(true)}>
                  Remove Loan
                </Button>
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Title</TableCell>
                      <TableCell align="center">Amount Payable</TableCell>
                      <TableCell align="center">Interest (%)</TableCell>
                      <TableCell align="center">Tenure (months)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="center">{row.title}</TableCell>
                        <TableCell align="center">
                          {row.amount.toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          {row.interest.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">{row.tenure}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper>
              <Box>
                <Typography>Loan Calculator</Typography>
                <TextField
                  label="Loan Amount ($)"
                  variant="outlined"
                  value={loanAmount}
                  margin="normal"
                  fullWidth
                  inputProps={{ inputMode: "numeric" }}
                  disabled={showResult}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.match(/[^0-9]/)) {
                      return e.preventDefault();
                    }
                    setLoanAmount(Number(val));
                  }}
                />
                <TextField
                  label="Loan Term (months)"
                  variant="outlined"
                  value={loanTerm}
                  margin="normal"
                  fullWidth
                  inputProps={{ inputMode: "numeric" }}
                  disabled={showResult}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.match(/[^0-9]/)) {
                      return e.preventDefault();
                    }
                    setLoanTerm(Number(val));
                  }}
                />
                <Tooltip
                  title="Please use Effective Interest Rate for better accuracy"
                  placement="top"
                >
                  <TextField
                    label="Interest Rate (%)"
                    variant="outlined"
                    value={interestRate}
                    type="number"
                    margin="normal"
                    fullWidth
                    inputProps={{
                      pattern: "^[0-9]*\\.?[0-9]{0,2}$",
                    }}
                    disabled={showResult}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        setInterestRate(Number(val));
                      }
                    }}
                  />
                </Tooltip>
                <Button variant="contained" onClick={calculateEMI}>
                  Calculate
                </Button>
              </Box>
              {showResult && (
                <div>
                  <Card>
                    <CardContent>Estimated Monthly Payment: ${EMI}</CardContent>
                  </Card>
                  <Divider sx={{ marginBottom: "10px" }} />
                  <Card>
                    <CardContent>
                      Total Amount Payable: ${totalAmount}
                    </CardContent>
                  </Card>
                  <Divider sx={{ marginBottom: "10px" }} />
                  <Card>
                    <CardContent>
                      Total Interest Payable: ${totalInterest}
                    </CardContent>
                  </Card>
                  <Button
                    variant="contained"
                    onClick={() => setShowLoanForm(true)}
                  >
                    Add Loan
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setShowResult(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Modal open={showLoanForm}>
        <Box sx={style}>
          <form>
            {/* handleSubmitLoanForm */}
            <FormControl fullWidth>
              <Typography>Add Loan Title:</Typography>
              <Divider sx={{ marginBottom: "8px" }} />
              <TextField
                label="Loan Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Button variant="contained" type="submit">
                Confirm
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={resetLoanForm}
              >
                Cancel
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
      {/* Display when remove loan is clicked */}
      <Modal open={showDelete}>
        <Box sx={style} overflow={true}>
          <h2 className="delete-loan-title">Remove Loan</h2>
          <Divider sx={{ marginBottom: "10px" }} />
          <form>
            {/* {handleRemoveLoan} */}
            {data ? displayUserLoan : "You have no loan"}
            <Divider sx={{ marginBottom: "10px" }} />
            <Typography color="red">
              {selectedLoan
                ? `Press Confirm to DELETE ${data[selectedLoan].title} from your
              portfolio`
                : null}
            </Typography>
            <div className="remove-loan-btn">
              <Button variant="contained" type="submit">
                Confirm
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={resetRemoveLoan}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
