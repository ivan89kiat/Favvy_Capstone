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

import "./Investment.css";
import CompanyDetailsTemplate from "./CompanyDetailsTemplate";

export default function Investment() {
  const [searchPortfolio, setSearchPortfolio] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showReduce, setShowReduce] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [jsonResults, setJsonResults] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyBE, setSelectedCompanyBE] = useState("");
  const [units, setUnits] = useState(0);
  const [price, setPrice] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(jsonData);
    // axios.get(`${process.env.BACKEND_URL}/investment`, {
    //   headers: { Authorization: `Bearer ${accessToken}` },
    // });
  }, []);

  const jsonData = [
    {
      id: 1,
      date: "09 May 2023",
      symbol: "IBM",
      name: "International Business Machines",
      open: 121.9,
      close: 121.17,
      purchasePrice: 102.85,
      units: 5000,
    },
    {
      id: 2,
      date: "09 May 2023",
      symbol: "IBM",
      name: "International Business Machines",
      open: 121.9,
      close: 121.17,
      purchasePrice: 102.85,
      units: 5000,
    },
    {
      id: 10,
      date: "09 May 2023",
      symbol: "APLE",
      name: "International Business Machines",
      open: 121.9,
      close: 121.17,
      purchasePrice: 102.85,
      units: 5000,
    },
  ];

  const columns = [
    { field: "symbol", headerName: "Symbol", width: 80, align: "center" },
    {
      field: "open",
      headerName: "Open Price ($)",
      width: 120,
      align: "center",
    },
    {
      field: "close",
      headerName: "Close Price ($)",
      width: 120,
      align: "center",
    },
    {
      field: "purchasePrice",
      headerName: "Average Price ($)",
      width: 130,
      align: "center",
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
    },
    {
      field: "totalCurrentValue",
      headerName: "Total Current Value ($)",
      description: "This column calculates the total current value",
      sortable: false,
      width: 180,
      valueGetter: (params) => `${params.row.close * params.row.units}`,
      align: "center",
    },
  ];

  const rows = data;

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
    setJsonResults([]);
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

  const displayUserPortfolio = data
    ? data.map((item) => (
        <ListItemButton
          key={item.id}
          id={data.findIndex((object) => object.id === item.id)}
          value={item.id}
          onClick={(e) => {
            if (showDelete) {
              alert(
                `Are you sure you want to delete ${item.name} from your portfolio?`
              );
            }
            setShowForm(true);
            setSelectedCompany(e.target.id);
            setSelectedCompanyBE(e.target.value);
          }}
          selected={
            selectedCompany !== "" &&
            Number(selectedCompany) ===
              data.findIndex((object) => object.id === item.id)
          }
        >
          Sym:{item.symbol} | Name: {item.name}
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
  };

  // const handleReducePortfolio = async (e) => {
  //   e.preventDefault();
  //   const updatedUnits = data[selectedCompany].units - units;
  //   const totalSales = units * price;
  //   await axios.put(
  //     `${process.env.BACKEND_URL}/investment/${selectedCompanyBE}`,
  //     {
  //       units: updatedUnits,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );

  //   await axios.put(
  //     `${process.env.BACKEND_URL}/balance`,
  //     {
  //       totalSales,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  //   resetPortfolio();
  // };

  // const handleDeletePortfolio = async (e) => {
  //   e.preventDefault();
  //   if (data[selectedCompany].units !== 0) {
  //     alert(`Please clear off your holdings of ${data[selectedCompany].name}`);
  //   } else
  //     await axios.put(
  //       `${process.env.BACKEND_URL}/investment/${selectedCompanyBE}`,
  //       {
  //         units: updatedUnits,
  //       },
  //       { headers: { Authorization: `Bearer ${accessToken}` } }
  //     );

  //   await axios.put(
  //     `${process.env.BACKEND_URL}/balance`,
  //     {
  //       totalSales,
  //     },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  //   resetPortfolio();
  // };

  // const handleAddPortfolio = async (e) => {
  //   e.preventDefault();
  //   axios.post(
  //     `${process.env.BACKEND_URL}/investment`,
  //     { selectedCompany },
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  //   resetPortfolio();
  // };

  const handleCloseCompanyView = () => {
    setShowCompany(false);
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
        </Stack>

        {/* Display portfolio feature */}
        {data.length > 0 ? (
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
        onClose={resetSearch}
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
              <form>
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
      <Modal open={showCompany} onClose={handleCloseCompanyView}>
        <div className="company-overview">
          <CompanyDetailsTemplate data={companyData} />
          <div className="company-overview-close-btn">
            <Button
              size="large"
              variant="contained"
              onClick={handleCloseCompanyView}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reduce or Delete portfolio feature */}
      <Modal open={showReduce || showDelete} onClose={resetPortfolio}>
        <Box sx={style} overflow={true}>
          <h2 className="reduce-delete-portfolio-title">
            {showReduce ? "Reduce Portfolio" : "Delete Portfolio"}
          </h2>
          <Divider sx={{ marginBottom: "10px" }} />
          <div>{displayUserPortfolio}</div>
          {showForm ? (
            <form>
              {/* {handleReducePortfolio} */}
              <Divider sx={{ marginBottom: "10px" }} />
              <Typography color={showDelete ? "red" : "blue"}>
                {data &&
                  showReduce &&
                  selectedCompany &&
                  `Name: ${data[selectedCompany].name}`}
                {data &&
                  showDelete &&
                  selectedCompany &&
                  `Press Confirm to DELETE ${data[selectedCompany].name} from your portfolio`}
              </Typography>
              {selectedCompany && showReduce && (
                <FormControl fullWidth>
                  <TextField
                    className="reduce-units"
                    label="Reduce Holdings (Units)"
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
                    className="selling-price"
                    label="Selling Price ($)"
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
    </div>
  );
}
