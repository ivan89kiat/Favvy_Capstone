import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

// export const UserContext = React.createContext("no user");
export default function Dashboard() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [userData, setUser] = useState({
    first_name: "ivan",
    last_name: "khor",
    mobile: "98765432",
    email: "ivankhor@test.com",
    dobirth: "08 Aug 1989",
  });

  const displayProfile = (
    <div className="dashboard-section2">
      <div>First Name: {userData.first_name}</div>
      <div>Last Name: {userData.last_name}</div>
      <div>mobile: {userData.mobile}</div>
      <div>D.O.Birth: {userData.dobirth}</div>
    </div>
  );

  useEffect(() => {
    if (isAuthenticated) {
      // axios
      //   .get(`${process.env.BACKEND_URL}/profile`)
      //   .then((res) => {
      //     const { data } = res;
      //     setUserData(data);
      //   })
      //   .catch((error) => alert(error.message));
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div>
      {" "}
      This is dashboard
      {isAuthenticated && displayProfile}
      <Outlet />
    </div>
  );
}
