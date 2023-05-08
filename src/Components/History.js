import React, { useState, useEffect } from "react";
import axios from "axios";
import BankAuth from "./BankAuth";

export default function History() {
  const [userAccessToken, setUserAccessToken] = useState();
  const clientId = "6l55vZudIzUORCzfe1Q4AVNrumMa";
  const callBackUrl = "http://localhost:3000";
  const accessToken = "bdb1058a-c248-37eb-a571-bae442a48051";

  useEffect(() => {}, []);

  const getTransaction = async () => {
    console.log("this is running");
    await axios.post(
      `https://api.ocbc.com:8243/transactional/corp/account/1.0/history`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };

  return (
    <div>
      This is history
      <BankAuth />
    </div>
  );
}
