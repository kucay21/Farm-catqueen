import React from "react";
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import ClaimButton from "./ClaimButton.jsx";

// ✅ Client ID kamu (dari thirdweb)
export const client = createThirdwebClient({
  clientId: "77bdb1a4b615d59917efaef65a2b745e",
});

// 🔗 Jaringan Base mainnet (chain ID 8453)
const chain = defineChain(8453);

function App() {
  return (
    <ThirdwebProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "sans-serif",
          background: "#0d1117",
          color: "#fff",
          gap: "20px",
        }}
      >
        <h1 style={{ color: "#58a6ff" }}>Cat Queen Reward DApp 🐱👑</h1>

        {/* Tombol connect wallet */}
        <ConnectButton client={client} chain={chain} />

        {/* Tombol claim */}
        <ClaimButton />
      </div>
    </ThirdwebProvider>
  );
}

export default App;