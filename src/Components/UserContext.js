import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { BACKEND_URL } from "./constant";

export const UserContext = createContext("test");

export function UserProvider({ children }) {
  const [dbUser, setDbUser] = useState(null);
  const [accessToken, setAccessToken] = useState();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const checkUser = async () => {
    if (isAuthenticated) {
      let token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUDIENCE,
        scope: "openid profile email phone",
      });
      setAccessToken(token);
      axios
        .post(
          `${BACKEND_URL}/profile`,
          {
            userEmail: user.email,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          const { data } = res;
          setDbUser(data[0]);
        })
        .catch((error) => console.log(error.message));
    }
  };

  useEffect(() => {
    checkUser();
  }, [isAuthenticated, accessToken]);

  return (
    <UserContext.Provider value={{ dbUser, accessToken }}>
      {children}
    </UserContext.Provider>
  );
}

export const UserAuth = () => {
  // to make sure that UserContext can be used in components
  return useContext(UserContext);
};
