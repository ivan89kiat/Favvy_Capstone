import React from "react";

export default function BankAuth() {
  return (
    <div>
      {/* <button onClick={handleAuthClick}>Authorize with Bank</button> */}
      <div>
        <a href="https://api.ocbc.com/ocbcauthentication/api/oauth2/authorize?client_id=6l55vZudIzUORCzfe1Q4AVNrumMa&redirect_uri=http://localhost:3000&scope=transactional">
          Authorize with Bank
        </a>
      </div>
    </div>
  );
}
