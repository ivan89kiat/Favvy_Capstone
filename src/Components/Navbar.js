import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Navbar.css";
import logo from "../logo.png";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import StackedLineChartOutlinedIcon from "@mui/icons-material/StackedLineChartOutlined";

export default function NavBar() {
  const { isAuthenticated } = useAuth0();

  return (
    <Navbar bg="dark">
      <Container className="navbar-container">
        <Navbar.Brand as={Link} to="/dashboard">
          <img className="logo" src={logo} />
          <br />
        </Navbar.Brand>
        <Nav as={Link} to="/dashboard">
          <DashboardOutlinedIcon />
          <br />
          DASHBOARD
        </Nav>
        <Nav as={Link} to="/profile">
          <AccountBoxOutlinedIcon />
          <br />
          PROFILE
        </Nav>
        <Nav as={Link} to="/history">
          <ReceiptOutlinedIcon />
          <br />
          TRANSACTIONS
        </Nav>
        <Nav as={Link} to="/budget">
          <WalletOutlinedIcon />
          <br />
          BUDGETS
        </Nav>
        <Nav as={Link} to="/investment">
          <StackedLineChartOutlinedIcon />
          <br />
          INVESTMENTS
        </Nav>

        <Nav as={Link} to="/loan">
          <CreditScoreOutlinedIcon />
          <br />
          LOANS
        </Nav>
        {isAuthenticated ? (
          <Nav as={Link} className="nav-logout">
            <LogoutButton />
            <br />
            LOG OUT
          </Nav>
        ) : null}
      </Container>
    </Navbar>
  );
}
