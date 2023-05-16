import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  Divider,
  Table,
  CardContent,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  Button,
  Modal,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "./constant";
import { UserAuth } from "./UserContext";

export default function History() {
  const { dbUser, accessToken } = UserAuth();
  const [transactionAmount, setTransactionAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [incomeCategory, setIncomeCategory] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(10000);
  const [category, setCategory] = useState([]);
  const [historyData, setHistoryData] = useState([]);

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
    axios
      .get(`${BACKEND_URL}/budget`)
      .then((res) => {
        const { data } = res;
        setCategory(data);
      })
      .catch((error) => console.log(error.message));
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/history/${dbUser.id}`)
      .then((res) => {
        setHistoryData(res.data);
      })
      .catch((error) => console.log(error.message));
  }, [dbUser]);
  console.log(dbUser);

  // axios
  //   .get(`${process.env.BACKEND_URL}/balance/${userId}`)
  //   .then((res) => setAvailableBalance(res.data))
  //   .catch((error) => console.log(error.message));

  const newAvailableBalance = () => {
    let newAvailableBalance = 0;
    if (selectedType === "income") {
      newAvailableBalance = transactionAmount + availableBalance;
      setAvailableBalance(newAvailableBalance);
    } else if (
      selectedType === "expenses" &&
      availableBalance > transactionAmount
    ) {
      newAvailableBalance = availableBalance - transactionAmount;
      setAvailableBalance(newAvailableBalance);
    } else {
      alert("Transaction is invalid due to insufficient balance.");
    }
  };

  // const handleTransactionEntry = async (e) => {
  //   e.preventDefault();
  //
  //     await axios.post(
  //       `${process.env.BACKEND_URL}/history/${userId}`,
  //       {
  //         transactionAmount,
  //         selectedCategoryId,
  //         selectedType,
  //         date: new Date().toLocaleDateString(),
  //       },
  //       { headers: { Authorization: `Bearer ${accessToken}` } }
  //     );
  //
  //   await axios.put(
  //     `${process.env.BACKEND_URL}/balance/${userId}`,
  //     { availableBalance },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  // };

  // const handleEditTransaction = async (e) => {
  //   e.preventDefault();

  //   await axios.put(`${BACKEND_URL}/history`, {
  //     amount: transactionAmount,
  //     type: selectedType,
  //     category_id: selectedCategoryId,
  //     date: new Date().toLocaleDateString(),
  //   });
  // };

  const resetTransaction = () => {
    setShowEdit(false);
    setTransactionAmount("");
    setSelectedCategory("");
    setSelectedCategoryId("");
    setSelectedTransactionId("");
    setSelectedType("");
  };
  console.log("selectedCategory", selectedCategory);
  console.log("transactionAmount", transactionAmount);
  console.log("selectedCategoryId", selectedCategoryId);
  console.log("selectedType", selectedType);
  console.log("selectedTransactionId", selectedTransactionId);

  return (
    <div>
      <h2>Transaction History</h2>
      <Paper
        sx={{
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} overflow={true}>
            <Paper>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="left">
                    Available Balance: ${availableBalance.toLocaleString()}
                  </Typography>
                  <Divider sx={{ marginBottom: "3px" }} />
                </CardContent>
              </Card>
            </Paper>
          </Grid>
          <Divider sx={{ marginBottom: "10px" }} />
          <Grid item xs={7}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Category</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="center">Amount ($)</TableCell>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Edit/Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyData &&
                      historyData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="center">{row.category}</TableCell>
                          <TableCell align="center">{row.type}</TableCell>
                          <TableCell align="center">${row.amount}</TableCell>
                          <TableCell align="center">{row.date}</TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              id={historyData.findIndex(
                                (object) => object.id === row.id
                              )}
                              value={row.id}
                              onClick={(e) => {
                                setShowEdit(true);
                                if (
                                  historyData[e.target.id].category === null
                                ) {
                                  setSelectedCategory("");
                                } else {
                                  setSelectedCategory(
                                    historyData[e.target.id].category
                                  );
                                }
                                setSelectedCategoryId(
                                  category.findIndex(
                                    (object) =>
                                      object.name ===
                                      historyData[e.target.id].category
                                  ) + 1
                                );
                                setSelectedTransactionId(e.target.value);
                                setSelectedType(historyData[e.target.id].type);
                                setTransactionAmount(
                                  historyData[e.target.id].amount
                                );
                              }}
                            >
                              EDIT
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={5}>
            <Paper>
              <Box>
                <Typography>Transaction Entry</Typography>
                <form>
                  {/* showEdit ? handleEditTransaction : handleTransactionEntry */}
                  <Tooltip
                    title="category is only for expenses"
                    placement="top"
                  >
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        label="Category"
                        value={selectedCategory}
                        disabled={incomeCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                        }}
                      >
                        {category.map((item) => (
                          <MenuItem
                            value={item.name}
                            key={item.id}
                            id={item.id}
                            onClick={(e) => setSelectedCategoryId(e.target.id)}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Tooltip>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="transaction-type"
                      name="transaction-type"
                      value={selectedType}
                      onChange={(e) => {
                        if (e.target.value === "income") {
                          setSelectedCategory("");
                          setIncomeCategory(true);
                        }
                        setSelectedType(e.target.value);
                      }}
                      row
                    >
                      <FormControlLabel
                        value="income"
                        control={<Radio />}
                        label="Income"
                      />
                      <FormControlLabel
                        value="expenses"
                        control={<Radio />}
                        label="Expenses"
                      />
                    </RadioGroup>
                  </FormControl>
                  <TextField
                    label="Transaction Amount ($)"
                    variant="outlined"
                    value={transactionAmount}
                    type="number"
                    margin="normal"
                    fullWidth
                    inputProps={{
                      pattern: "^[0-9]*\\.?[0-9]{0,2}$",
                      inputMode: "numeric",
                    }}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        setTransactionAmount(Number(val));
                      }
                    }}
                  />
                  {showEdit ? (
                    <div>
                      <Button variant="contained" type="submit">
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={resetTransaction}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setShowDelete(true)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button variant="contained" type="submit">
                      Submit
                    </Button>
                  )}
                </form>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Modal open={showDelete}>
        <Box sx={style}>
          <form>
            {/* handleSubmitDelete */}
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography color="red">
                Are you sure to delete the transaction?
              </Typography>
              <Button variant="contained" type="submit">
                Confirm
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowDelete(false)}
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
