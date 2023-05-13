import React, { useState } from "react";
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
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const calculateEMI = () => {
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
  };

  const resetLoanForm = () => {
    setShowLoanForm(false);
    setTitle("");
  };

  const handleSubmitLoanForm = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.BACKEND_URL}/loan`, {
      title,
      loanAmount,
      loanTerm,
      totalAmount,
    });
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
              <Typography>Hello</Typography>
            </Paper>
          </Grid>
          <Divider sx={{ marginBottom: "10px" }} />
          <Grid item xs={6}>
            <Paper>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button size="small">Remove Loan</Button>
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
                        <TableCell align="center">{row.amount}</TableCell>
                        <TableCell align="center">{row.interest}</TableCell>
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
    </div>
  );
}
