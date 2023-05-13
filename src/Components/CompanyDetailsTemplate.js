import React from "react";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import "./CompanyDetailsTemplate.css";

export default function CompanyDetailsTemplate(props) {
  const data = props.data;

  const convertLargeNumber = (value) => {
    let val = 0;
    if (value >= Math.pow(10, 12)) {
      val = (value / Math.pow(10, 12)).toFixed(2) + "t";
    } else if (value >= Math.pow(10, 9)) {
      val = (value / Math.pow(10, 9)).toFixed(2) + "b";
    } else if (value >= Math.pow(10, 6)) {
      val = (value / Math.pow(10, 6)).toFixed(2) + "m";
    }
    return val;
  };

  return (
    <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h5" gutterBottom>
        {data.Name ? `Company Overview (${data.Name})` : "No Available Data"}
      </Typography>
      {data.Name && (
        <div>
          <Divider sx={{ marginBottom: "10px" }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Card>
                <CardHeader title="Description" />
                <CardContent>{data.Description}</CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: 300 }}>
                <CardHeader title="Other Details" />
                <CardContent>
                  Symbol: {data.Symbol}
                  <br />
                  Exchange: {data.Exchange}
                  <br />
                  Country: {data.Country}
                  <br />
                  Sector: {data.Sector}
                  <br />
                  Industry: {data.Industry}
                  <br />
                  Fiscal Year: {data.FiscalYearEnd}
                  <br />
                  Market Cap: $
                  {convertLargeNumber(Number(data.MarketCapitalization))}
                  <br />
                  Div. Yield: {(Number(data.DividendYield) * 100).toFixed(2)}%
                  <br />
                  Div. per Share: ${data.DividendPerShare}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: 300 }}>
                <CardHeader title="Financial Summary" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <Typography>
                        EBITDA: ${convertLargeNumber(Number(data.EBITDA))}
                        <br />
                        EPS TTM: ${data.EPS}
                        <br />
                        Gross Profit TTM: $
                        {convertLargeNumber(Number(data.GrossProfitTTM))}
                        <br />
                        P/E Ratio: {data.PERatio}
                        <br />
                        P/B Ratio: {data.PriceToBookRatio}
                        <br />
                        Operating Margin TTM: {data.OperatingMarginTTM}
                        <br />
                        Analyst Target: ${data.AnalystTargetPrice}
                        <br />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Typography>
                        Revenue TTM: $
                        {convertLargeNumber(Number(data.RevenueTTM))}
                        <br />
                        ROE TTM: ${data.ReturnOnEquityTTM}
                        <br />
                        Profit Margin: ${data.ProfitMargin}
                        <br />
                        Book Value: ${data.BookValue}
                        <br />
                        High: ${data["52WeekHigh"]}
                        <br />
                        Low: ${data["52WeekLow"]}
                        <br />
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Divider sx={{ marginBottom: "10px", marginTop: "10px" }} />
          <div className="add-portfolio-button"></div>
        </div>
      )}
    </Paper>
  );
}
