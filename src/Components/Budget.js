import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Modal, Form } from "react-bootstrap";
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
} from "@mui/material";

export default function Budget() {
  const { isAuthenticated } = useAuth0();
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [budgetId, setBudgetId] = useState("");
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [newCategory, setNewCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState([
    "Housing",
    "Food",
    "Utilities",
    "Transportation",
    "Clothing",
    "Healthcare",
    "Insurance",
    "Household",
    "Personal",
    "Debt",
    "Retirement",
    "Education",
    "Entertainment",
    "Gifts",
    "Miscellanous",
  ]);

  const budgetData = [
    { id: 0, name: "Food", amount: 1000, spending: 500, available: 500 },
    {
      id: 1,
      name: "Transportation",
      amount: 300,
      spending: 100,
      available: 200,
    },
    {
      id: 2,
      name: "Entertainment",
      amount: 300,
      spending: 150,
      available: 150,
    },
    { id: 3, name: "Household", amount: 300, spending: 150, available: 150 },
    { id: 4, name: "Housing", amount: 600, spending: 600, available: 0 },
  ];

  useEffect(() => {
    // axios.get(`${process.env.BACKEND_URL}/budgets/${userId}`, {
    //   headers: { Authorization: `Bearer ${accessToken}` },
    // });
    calcBudgetBalance();
    filteredCategory();
  }, []);

  const calcBudgetBalance = () => {
    let sum = 0;

    for (let i = 0; i < budgetData.length; i++) {
      sum += budgetData[i].available;
    }
    return setBalance(sum);
  };

  const filteredCategory = () => {
    let j = 0;
    while (j < budgetData.length) {
      for (let k = 0; k < category.length; k++) {
        if (category[k] === budgetData[j].name) {
          category.splice([k], 1);
        }
      }
      j++;
    }
  };

  const descendedBudget = budgetData.sort((a, b) => b.amount - a.amount);

  const budgetStatus = budgetData.amount / budgetData.spending;

  // const handleSubmitBudget = async () => {
  // e.preventDefault();
  //   await axios.post(
  //     `${process.env.BACKEND_URL}/budget/:userId`,
  //     {
  //       name: selectedCategory,
  //       amount: amount,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  // };

  // const handleEditBudget = async (e) =>{
  // e.preventDefault();
  //   await axios.put(
  //     `${process.env.BACKEND_URL}/budget/:userId`,
  //     {id: budgetId,
  //       name: selectedCategory,
  //       amount: amount,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  // };

  // const handleDeleteBudget = async () =>{
  // e.preventDefault();
  //   await axios.delete(
  //     `${process.env.BACKEND_URL}/budget/:userId`,
  //     {id: budgetId,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  // };
  console.log(budgetId);
  return (
    <div>
      <div className="budget-section-1">
        <div className="budget-balance">Budget Balance: $ {balance}</div>
        <div className="budget-category">
          Add Budget:
          <button
            onClick={() => {
              setShow(true);
            }}
          >
            Add
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
              onClick={() => {
                setShow(false);
                setSelectedCategory("");
                setAmount(0);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <Modal.Header>
              <Modal.Title>Add Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* {handleSubmitBudget} */}
                <Box sx={{ minWidth: 120 }}>
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
                      {category.map((item) => (
                        <MenuItem value={item} key={item}>
                          {item}
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
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.match(/[^0-9]/)) {
                          return e.preventDefault();
                        }
                        setAmount(Number(val));
                      }}
                    />
                  </FormControl>
                  <Button variant="contained" type="submit">
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setShow(false);
                      setSelectedCategory("");
                      setAmount(0);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
        <div>
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
                {descendedBudget.map((budget) => (
                  <TableRow
                    key={budget.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {budget.name}
                    </TableCell>
                    <TableCell align="center">$ {budget.amount}</TableCell>
                    <TableCell align="center">$ {budget.spending}</TableCell>
                    <TableCell align="center">$ {budget.available}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        id={budget.id}
                        value={budget.name}
                        onClick={(e) => {
                          setEdit(true);
                          setSelectedCategory(e.target.value);
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
          <Modal
            show={edit}
            onHide={() => setEdit(false)}
            backdrop="static"
            centered
          >
            <button
              type="button"
              className="btn-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setEdit(false);
                setSelectedCategory("");
                setBudgetId("");
                setAmount(0);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <Modal.Header>
              <Modal.Title>Edit Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* {handleSubmitEditBudget} */}
                <Box sx={{ minWidth: 120 }}>
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
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.match(/[^0-9]/)) {
                          return e.preventDefault();
                        }
                        setAmount(Number(val));
                      }}
                    />
                  </FormControl>{" "}
                  <Button variant="contained" type="submit">
                    Save Changes
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setEdit(false);
                      setSelectedCategory("");
                      setBudgetId("");
                      setAmount(0);
                    }}
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
                </Box>
              </Form>{" "}
            </Modal.Body>
          </Modal>
          <Modal
            show={deleteStatus}
            onHide={() => setDeleteStatus(false)}
            backdrop="static"
            centered
          >
            <Modal.Header>
              <Modal.Title>Delete Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this budget?
              <Form>
                {/* {handleSubmitDeleteBudget} */}
                <FormControl>
                  <Button variant="contained" type="submit" color="error">
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDeleteStatus(false);
                      setSelectedCategory("");
                      setBudgetId("");
                    }}
                  >
                    Cancel
                  </Button>
                </FormControl>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}
