import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BankAuth() {
  const handleAuthClick = () => {
    axios
      .get(
        "https://api.ocbc.com/ocbcauthentication/api/oauth2/authorize?client_id=6l55vZudIzUORCzfe1Q4AVNrumMa&redirect_uri=http://localhost:8080&scope=transactional"
      )
      .then((res) => {
        console.log(res.data);
        let popupWindow = window.open(
          "",
          "popupWindow",
          "width=600,height=600,scrollbars=yes"
        );

        popupWindow.document.write(res.data);
      });
  };

  return (
    <div>
      {/* <button onClick={handleAuthClick}>Authorize with Bank</button> */}
      <div>
        <a href="https://api.ocbc.com/ocbcauthentication/api/oauth2/authorize?client_id=6l55vZudIzUORCzfe1Q4AVNrumMa&redirect_uri=http://localhost:8080&scope=transactional">
          Authorize with Bank
        </a>
      </div>
    </div>
  );
}
