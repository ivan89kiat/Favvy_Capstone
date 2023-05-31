import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Stack,
  Button,
  Modal,
  Typography,
  FormControl,
  TextField,
  ListItemButton,
  List,
  Divider,
} from "@mui/material";
import axios from "axios";
import { UserAuth } from "./UserContext";

import "./Investment.css";
import CompanyDetailsTemplate from "./CompanyDetailsTemplate";
import { BACKEND_URL } from "./constant";

export default function Investment() {
  const { dbUser, accessToken } = UserAuth();
  const [searchPortfolio, setSearchPortfolio] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showReduce, setShowReduce] = useState(false);
  const [showIncrease, setShowIncrease] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [jsonResults, setJsonResults] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyBE, setSelectedCompanyBE] = useState("");
  const [units, setUnits] = useState(0);
  const [price, setPrice] = useState(0);
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/investment/${dbUser.id}`)
      .then((res) => {
        const { data } = res;
        setJsonData(data);
      })
      .catch((error) => console.log(error.message));
  }, [
    selectedCompanyBE,
    showDelete,
    showIncrease,
    searchPortfolio,
    showReduce,
  ]);

  useEffect(() => {
    for (let i = 0; i < jsonData.length; i++) {
      axios.get(`${BACKEND_URL}/api/stockdata/${jsonData[i].stockData.symbol}`);
    }
  }, []);

  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      width: 80,
      align: "center",
      sortable: false,
    },
    {
      field: "open",
      headerName: "Open Price ($)",
      width: 120,
      align: "center",
      sortable: false,
    },
    {
      field: "close",
      headerName: "Close Price ($)",
      width: 120,
      align: "center",
      sortable: false,
    },
    {
      field: "purchasePrice",
      headerName: "Average Price ($)",
      width: 130,
      align: "center",
      sortable: false,
    },
    {
      field: "units",
      headerName: "Holdings (units)",
      width: 120,
      align: "center",
    },
    {
      field: "date",
      headerName: "Last Update",
      width: 110,
      align: "center",
      sortable: false,
    },
    {
      field: "totalCurrentValue",
      headerName: "Total Current Value ($)",
      description: "This column calculates the total current value",
      sortable: true,
      width: 180,
      valueGetter: (params) =>
        `${Number(params.row.close * params.row.units).toFixed(2)}`,
      align: "center",
    },
    {
      field: "performance",
      headerName: "Performance (%)",
      description: "This column calculates the yield performance",
      sortable: true,
      width: 140,
      valueGetter: (params) =>
        `${
          params.row.purchasePrice > 0
            ? Number(
                (params.row.close / params.row.purchasePrice) * 100 - 100
              ).toFixed(1)
            : "NA"
        }`,
      align: "center",
    },
  ];

  const rows =
    jsonData &&
    jsonData.map((portfolio) => ({
      id: portfolio.id,
      symbol: portfolio.stockData.symbol,
      open: portfolio.stockData.open,
      close: portfolio.stockData.close,
      purchasePrice: portfolio.purchasePrice,
      units: portfolio.units,
      date: portfolio.stockData.date,
    }));

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

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=${process.env.STOCK_API_KEY}`
      )
      .then((res) => setJsonResults(res.data.bestMatches))
      .catch((error) => console.log(error.message));
  };

  const resetSearch = () => {
    setSearchPortfolio(false);
    setInput("");
    setJsonResults([]);
  };

  const displaySearchResult = jsonResults
    .slice(0, 8)
    .filter((result) => result["4. region"] === "United States")
    .map((item) => (
      <ListItemButton
        key={item["1. symbol"]}
        id={item["1. symbol"]}
        selected={selectedCompany === item["1. symbol"]}
        onClick={(e) => {
          setSelectedCompany(e.target.id);
        }}
      >
        Sym:{item["1. symbol"]} | Name:{item["2. name"]}
      </ListItemButton>
    ));

  const resetCompanyData = () => {
    setShowCompany(false);
    setCompanyData([]);
    setSelectedCompany("");
  };

  const getCompanyData = () => {
    axios
      .get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${selectedCompany}&apikey=${process.env.STOCK_API_KEY}`
      )
      .then((res) => {
        setCompanyData(res.data);
      })
      .catch((error) => console.log(error.message));
    setShowCompany(true);
  };

  const displayUserPortfolio = jsonData
    ? jsonData.map((item) => (
        <ListItemButton
          key={item.id}
          id={jsonData.findIndex((object) => object.id === item.id)}
          value={item.id}
          onClick={(e) => {
            if (showDelete) {
              alert(
                `Are you sure you want to delete ${item.stockData.symbol} from your portfolio?`
              );
            }
            setShowForm(true);
            setSelectedCompany(e.target.id);
            setSelectedCompanyBE(jsonData[e.target.id].id);
          }}
          selected={
            selectedCompany !== "" &&
            Number(selectedCompany) ===
              jsonData.findIndex((object) => object.id === item.id)
          }
        >
          Sym:{item.stockData.symbol}
        </ListItemButton>
      ))
    : "You have no portfolio";

  const resetPortfolio = () => {
    setSelectedCompany("");
    setUnits(0);
    setPrice(0);
    setSelectedCompanyBE("");
    setShowDelete(false);
    setShowReduce(false);
    setShowIncrease(false);
    setSearchPortfolio(false);
  };

  const handleReducePortfolio = async (e) => {
    e.preventDefault();
    const updatedUnits = jsonData[selectedCompany].units - units;
    const totalSales = units * price;
    const totalInvested = 0;

    await axios.put(
      `${BACKEND_URL}/investment/${dbUser.id}/${selectedCompanyBE}`,
      {
        updatedUnits,
        totalSales,
        totalInvested,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    resetPortfolio();
  };

  const handleIncreasePortfolio = async (e) => {
    e.preventDefault();
    const updatedUnits = jsonData[selectedCompany].units + units;
    const totalSales = 0;
    const totalInvested = units * price;
    await axios.put(
      `${BACKEND_URL}/investment/${dbUser.id}/${selectedCompanyBE}`,
      {
        updatedUnits,
        totalSales,
        totalInvested,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    resetPortfolio();
  };

  const handleDeletePortfolio = async (e) => {
    e.preventDefault();
    if (jsonData[selectedCompany].units !== 0) {
      alert(
        `Please clear off your holdings of ${jsonData[selectedCompany].symbol}`
      );
    } else
      await axios.delete(`${BACKEND_URL}/investment/${selectedCompanyBE}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    resetPortfolio();
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    await axios.post(
      `${BACKEND_URL}/investment/${dbUser.id}`,
      { selectedCompany },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    resetPortfolio();
  };

  return (
    <div>
      <h2>Investment Portfolio</h2>
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button size="small" onClick={() => setShowDelete(true)}>
            Remove portfolio
          </Button>
          <Button size="small" onClick={() => setSearchPortfolio(true)}>
            Add Portfolio
          </Button>
          <Button size="small" onClick={() => setShowReduce(true)}>
            Reduce portfolio
          </Button>
          <Button size="small" onClick={() => setShowIncrease(true)}>
            Increase portfolio
          </Button>
        </Stack>

        {/* Display portfolio feature */}
        {jsonData.length > 0 ? (
          <DataGrid
            sx={{ color: "white", root: "white", text: { color: "white" } }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        ) : (
          <Typography>"Please add a portfolio"</Typography>
        )}
      </Box>

      {/* Search portfolio feature */}
      <Modal
        open={searchPortfolio}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSearch}>
            <FormControl fullWidth>
              <TextField
                className="search-stock"
                label="search stock symbol"
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
            <Button variant="contained" type="submit" fullWidth>
              Search
            </Button>
          </form>
          {jsonResults.length > 0 && (
            <div>
              <List>{displaySearchResult}</List>
              <form onSubmit={handleAddPortfolio}>
                <Button variant="contained" type="submit">
                  Add Portfolio
                </Button>
                <Button variant="contained" onClick={getCompanyData}>
                  View Company
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetSearch}
                >
                  Close
                </Button>
              </form>
            </div>
          )}
        </Box>
      </Modal>

      {/* Display company overview after search feature */}
      <Modal open={showCompany}>
        <div className="company-overview">
          <CompanyDetailsTemplate data={companyData} />
          <div className="company-overview-close-btn">
            <Button size="large" variant="contained" onClick={resetCompanyData}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reduce or Increase portfolio feature */}
      <Modal open={showReduce || showIncrease}>
        <Box sx={style} overflow={true}>
          <h2 className="reduce-delete-portfolio-title">
            {showReduce ? "Reduce Portfolio" : "Increase Portfolio"}
          </h2>
          <Divider sx={{ marginBottom: "10px" }} />
          <div>{displayUserPortfolio}</div>
          {showForm ? (
            <form
              onSubmit={
                showReduce ? handleReducePortfolio : handleIncreasePortfolio
              }
            >
              <Divider sx={{ marginBottom: "10px" }} />
              {selectedCompany && (
                <FormControl fullWidth>
                  <TextField
                    className="edit-units"
                    label={
                      showReduce
                        ? "Reduce Holdings (Units)"
                        : "Increase Holdings (Units)"
                    }
                    variant="outlined"
                    value={units}
                    margin="normal"
                    inputProps={{ inputMode: "numeric" }}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val.match(/[^0-9]/)) {
                        return e.preventDefault();
                      }
                      setUnits(Number(val));
                    }}
                  />
                  <TextField
                    className="purchasePrice"
                    label={
                      showReduce ? "Selling Price ($)" : "Buying Price ($)"
                    }
                    variant="outlined"
                    value={price}
                    type="number"
                    margin="normal"
                    inputProps={{
                      pattern: "^[0-9]*\\.?[0-9]{0,2}$",
                    }}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        setPrice(Number(val));
                      }
                    }}
                  />
                </FormControl>
              )}
              <Divider sx={{ marginBottom: "10px" }} />
              <Button variant="contained" type="submit">
                Confirm
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={resetPortfolio}
              >
                Cancel
              </Button>
            </form>
          ) : null}
        </Box>
      </Modal>

      <Modal open={showDelete}>
        <Box sx={style} overflow={true}>
          <h2 className="reduce-delete-portfolio-title">Delete Portfolio</h2>
          <Divider sx={{ marginBottom: "10px" }} />
          <div>{displayUserPortfolio}</div>
          {showForm ? (
            <form onSubmit={handleDeletePortfolio}>
              <Divider sx={{ marginBottom: "10px" }} />
              <Button variant="contained" type="submit">
                Confirm
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={resetPortfolio}
              >
                Cancel
              </Button>
            </form>
          ) : null}
        </Box>
      </Modal>
    </div>
  );
}
