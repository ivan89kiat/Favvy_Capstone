import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import {
  InputLabel,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Modal,
  Stack,
} from "@mui/material";
import { BACKEND_URL } from "./constant";
import { UserAuth } from "./UserContext";

export default function Budget() {
  const { dbUser, accessToken } = UserAuth();
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [budgetId, setBudgetId] = useState("");
  const [balance, setBalance] = useState("");
  const [updateBalance, setUpdateBalance] = useState("");
  const [spending, setSpending] = useState("");
  const [amount, setAmount] = useState(0);
  const [totalSpending, setTotalSpending] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [category, setCategory] = useState([]);
  const [budgetData, setBudgetData] = useState([]);

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

    axios
      .get(`${BACKEND_URL}/history/${dbUser.id}`)
      .then((res) => {
        const { data } = res;
        const spendingByCategory = data.reduce((acc, transaction) => {
          const { category, amount } = transaction;
          if (acc[category]) {
            acc[category] += Number(amount);
          } else {
            acc[category] = Number(amount);
          }
          return acc;
        }, {});
        setTotalSpending(spendingByCategory);
      })
      .catch((error) => console.log(error.message));

    axios
      .get(`${BACKEND_URL}/budget/${dbUser.id}`)
      .then((res) => {
        const { data } = res;
        setBudgetData(data);
      })
      .catch((error) => console.log(error.message));
  }, [dbUser, edit, show]);

  useEffect(() => {
    calcBudgetBalance();
    filterCategory();
  }, [budgetData]);

  const updatedBudgetData =
    budgetData &&
    budgetData.map((budget) => {
      const categoryName =
        category[
          category.findIndex((object) => object.id === budget.budgetCategory_id)
        ].name;
      const categorySpending = totalSpending[categoryName] || 0;
      const categoryBalance = budget.amount - totalSpending[categoryName] || 0;
      return {
        ...budget,
        spending: categorySpending,
        name: categoryName,
        remainingBalance: categoryBalance,
      };
    });

  const calcBudgetBalance = () => {
    let sum = 0;

    for (let i = 0; i < updatedBudgetData.length; i++) {
      sum += Number(updatedBudgetData[i].remainingBalance);
    }
    return setBalance(sum.toFixed(2));
  };

  const filterCategory = () => {
    let newCategory = [...category];

    for (let i = 0; i < updatedBudgetData.length; i++) {
      const categoryId = updatedBudgetData[i].budgetCategory_id;
      newCategory = newCategory.filter((cat) => cat.id !== categoryId);
    }
    setFilteredCategory(newCategory);
  };

  const descendedBudget = updatedBudgetData.sort((a, b) => b.amount - a.amount);

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    await axios.post(
      `${BACKEND_URL}/budget/${dbUser.id}`,
      {
        selectedCategoryId,
        amount,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    resetCreate();
    console.log("create is running completed");
  };

  const handleEditBudget = async (e) => {
    e.preventDefault();
    const newBalance = amount - updateBalance;
    await axios.put(
      `${BACKEND_URL}/budget/${dbUser.id}`,
      {
        budgetId,
        amount,
        newBalance,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    resetEdit();
  };

  const handleDeleteBudget = async (e) => {
    e.preventDefault();
    await axios.delete(
      `${BACKEND_URL}/budget/${dbUser.id}/${budgetId}/${selectedCategory}/${spending}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    resetEdit();
  };

  const resetEdit = () => {
    setShow(false);
    setEdit(false);
    setSelectedCategory("");
    setSelectedCategoryId("");
    setBudgetId("");
    setAmount(0);
    setUpdateBalance("");
    setDeleteStatus(false);
  };

  const resetCreate = () => {
    setShow(false);
    setSelectedCategory("");
    setSelectedCategoryId("");
    setAmount(0);
  };

  const handleAmountChange = (e) => {
    let val = e.target.value;
    if (val.match(/[^0-9]/)) {
      return e.preventDefault();
    }
    setAmount(Number(val));
  };

  return (
    <div>
      <h2>Budget Management</h2>
      <div className="budget-section-1">
        <div className="budget-balance"></div>
        <div className="budget-category">
          <Paper>
            <Card>
              <CardContent>
                <Typography variant="h6" align="left">
                  Budget Balance: $ {balance}
                </Typography>
                <Divider sx={{ marginBottom: "3px" }} />
              </CardContent>
            </Card>
          </Paper>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Stack direction="row" spacing={1} sx={{ m: 1 }}>
              <Button
                size="large"
                onClick={() => setShow(true)}
                variant="contained"
              >
                Add Budget
              </Button>
            </Stack>
          </div>
          <Modal open={show}>
            <Box sx={style}>
              <Typography>Add Budget</Typography>{" "}
              <Form onSubmit={handleCreateBudget}>
                <FormControl fullWidth>
                  <InputLabel className="budget-category-selection-label">
                    Category
                  </InputLabel>
                  <Select
                    className="budget-category-selection"
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                    }}
                  >
                    {filteredCategory.map((item) => (
                      <MenuItem
                        value={item.name}
                        key={item.id}
                        onClick={() => setSelectedCategoryId(item.id)}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <br />
                <FormControl fullWidth>
                  <TextField
                    className="set-amount"
                    label="Set Amount ($)"
                    variant="outlined"
                    value={amount}
                    margin="normal"
                    inputProps={{ inputMode: "numeric" }}
                    onChange={handleAmountChange}
                  />
                </FormControl>
                <Button variant="contained" type="submit">
                  Confirm
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetCreate}
                >
                  Cancel
                </Button>{" "}
              </Form>
            </Box>
          </Modal>
        </div>
        <div style={{ width: "100%", height: "400px", overflow: "auto" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 950 }} aria-label="budget table">
              <TableHead>
                <TableRow>
                  <TableCell>Categories</TableCell>
                  <TableCell align="center">Set Amount</TableCell>
                  <TableCell align="center">Spending</TableCell>
                  <TableCell align="center">Remaining Balance</TableCell>
                  <TableCell align="center">Edit/Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {updatedBudgetData &&
                  descendedBudget.map((budget) => (
                    <TableRow
                      key={budget.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {budget.name}
                      </TableCell>
                      <TableCell align="center">$ {budget.amount}</TableCell>
                      <TableCell align="center">$ {budget.spending}</TableCell>
                      <TableCell align="center">
                        $ {budget.remainingBalance}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          id={budget.id}
                          value={budget.name}
                          onClick={(e) => {
                            setEdit(true);
                            setUpdateBalance(
                              updatedBudgetData[
                                updatedBudgetData.findIndex(
                                  (object) => object.id === Number(e.target.id)
                                )
                              ].remainingBalance
                            );
                            setSelectedCategory(e.target.value);
                            setSpending(
                              updatedBudgetData[
                                updatedBudgetData.findIndex(
                                  (object) => object.id === Number(e.target.id)
                                )
                              ].spending
                            );
                            setSelectedCategoryId(
                              updatedBudgetData[
                                updatedBudgetData.findIndex(
                                  (object) => object.id === Number(e.target.id)
                                )
                              ].budgetCategory_id
                            );
                            setBudgetId(e.target.id);
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
          <Modal open={edit}>
            <Box sx={style}>
              <Form onSubmit={handleEditBudget}>
                <Typography>Edit Budget</Typography>
                <FormControl fullWidth>
                  <TextField
                    className="edit-category"
                    label="Category"
                    variant="outlined"
                    value={selectedCategory}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
                <br />
                <FormControl fullWidth>
                  <TextField
                    className="set-amount"
                    label="Set Amount ($)"
                    variant="outlined"
                    value={amount}
                    margin="normal"
                    inputProps={{ inputMode: "numeric" }}
                    onChange={handleAmountChange}
                  />
                </FormControl>{" "}
                <Button variant="contained" type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetEdit}
                >
                  Cancel
                </Button>
                <Button
                  color="error"
                  onClick={() => {
                    setDeleteStatus(true);
                  }}
                >
                  Delete
                </Button>
              </Form>
            </Box>
          </Modal>
          <Modal open={deleteStatus}>
            <Box sx={style}>
              <Typography>Delete Budget</Typography>
              <Typography>
                Are you sure to delete this budget? Transaction history related
                to this budget will be deleted.
              </Typography>
              <Form onSubmit={handleDeleteBudget}>
                <FormControl>
                  <Button variant="contained" type="submit" color="error">
                    Delete
                  </Button>
                  <Button variant="contained" onClick={resetEdit}>
                    Cancel
                  </Button>
                </FormControl>
              </Form>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}
