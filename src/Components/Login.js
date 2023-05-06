import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import "./Login.css";
import logo from "../logo.png";

export default function Login() {
  const { isAuthenticated } = useAuth0();
  const auth0 = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  console.log(isAuthenticated);
  return (
    <div>
      <img className="login-logo" src={logo} />
      <div> Welcome to Favvy</div>
      <div>{!isAuthenticated ? <LoginButton /> : <LogoutButton />}</div>
    </div>
  );
}
