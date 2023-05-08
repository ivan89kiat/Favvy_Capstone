import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
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
      This is dashboard
      <Outlet />
    </div>
  );
}
