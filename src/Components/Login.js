import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import "./Login.css";
import logo from "../logo.png";

export default function Login() {
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      alert("Welcome to Favvy");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <img className="login-logo" src={logo} alt="" />
      <div> Welcome to Favvy</div>
      <div>{!isAuthenticated ? <LoginButton /> : <LogoutButton />}</div>
    </div>
  );
}
