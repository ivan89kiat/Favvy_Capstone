import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <LogoutOutlinedIcon
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    />
  );
};

export default LogoutButton;
