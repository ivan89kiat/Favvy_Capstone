import React from "react";
import {
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import "./CompanyDetailsTemplate.css";

export default function CompanyDetailsTemplate(props) {
  return (
    <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Company Overview
      </Typography>
      <Divider sx={{ marginBottom: "10px" }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title="Description" />
            <CardContent></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: 267 }}>
            <CardHeader title="Other Details" />
            <CardContent>
              Exchange:
              <br />
              Country:
              <br />
              Sector:
              <br />
              Industry:
              <br />
              Fiscal Year:
              <br />
              Market Cap:
              <br />
              Div. Yield:
              <br />
              Div. per Share:
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          <Card>
            <CardHeader title="Financial Summary" />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Year</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Net Income</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>2022</TableCell>
                    <TableCell>$1,000,000</TableCell>
                    <TableCell>$500,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2021</TableCell>
                    <TableCell>$900,000</TableCell>
                    <TableCell>$450,000</TableCell>
                  </TableRow>
                  {/* Add more rows as needed */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Divider sx={{ marginBottom: "10px", marginTop: "10px" }} />
      <Button sx={{ justifySelf: "end" }}>Add Portfolio</Button>
    </Paper>
  );
}
