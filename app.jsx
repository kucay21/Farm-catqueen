import React from "react";
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import ClaimButton from "./ClaimButton.jsx";
import StakeButton from "./StakeButton.jsx"; // kalau belum ada, hapus dulu baris ini

// ✅ Client ID dari Thirdweb
export const client = createThirdwebClient({
  clientId: "77bdb1a4b615d59917efaef65a2b745e",
});

// ✅ Base Mainnet (chain ID 8453)
export const chain = defineChain(8453);

function App() {
  return (
    <ThirdwebProvider client={client} activeChain={chain}>
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

        {/* Tombol stake (kalau file-nya sudah ada) */}
        {/* <StakeButton /> */}
      </div>
    </ThirdwebProvider>
  );
}

export default App;
