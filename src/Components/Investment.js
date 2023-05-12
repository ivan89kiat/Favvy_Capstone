import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Stack,
  Button,
  Modal,
  Typography,
  FormControl,
  TextField,
  Paper,
  ListItemButton,
  List,
  ButtonBase,
} from "@mui/material";
import axios from "axios";

import "./Investment.css";
import CompanyDetailsTemplate from "./CompanyDetailsTemplate";

export default function Investment() {
  const [searchPortfolio, setSearchPortfolio] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [input, setInput] = useState("");
  const [jsonResults, setJsonResults] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const data = [
    {
      id: 1,
      date: "09 May 2023",
      symbol: "IBM",
      open: 121.9,
      close: 121.17,
      purchasePrice: 102.85,
      units: 5000,
    },
    {
      id: 2,
      date: "09 May 2023",
      symbol: "IBM",
      open: 121.9,
      close: 121.17,
      purchasePrice: 102.85,
      units: 5000,
    },
    {
      id: 3,
      date: "09 May 2023",
      symbol: "IBM",
      open: 121.9,
      close: 121.17,
      purchasePrice: 102.85,
      units: 5000,
    },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 60, align: "center" },
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

  console.log("jsonResults", jsonResults);

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

  return (
    <div>
      This is investment
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button size="small" onClick={() => setShowCompany(true)}>
            Remove portfolio
          </Button>
          <Button size="small" onClick={() => setSearchPortfolio(true)}>
            Search Portfolio
          </Button>
        </Stack>
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
      </Box>
      <Modal
        open={searchPortfolio}
        onClose={resetSearch}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSearch}>
            <FormControl>
              <TextField
                className="search-stock"
                label="search stock symbol"
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
            <Button variant="contained" type="submit">
              Search
            </Button>
          </form>
          <List>{jsonResults ? displaySearchResult : null}</List>
          <form>
            <Button variant="contained" type="submit">
              Add Portfolio
            </Button>
            <Button variant="contained" onClick={getCompanyData}>
              View Company
            </Button>
            <Button variant="contained" color="secondary" onClick={resetSearch}>
              Close
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal open={showCompany} onClose={resetCompanyData}>
        <div>
          <CompanyDetailsTemplate data={companyData} />
          <Button variant="contained" onClick={resetCompanyData}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
