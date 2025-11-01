import React from "react";
import { prepareContractCall, getContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "./App.jsx";
import { defineChain } from "thirdweb/chains";

// 🔗 Alamat kontrak kamu
const contract = getContract({
  client,
  chain: defineChain(8453), // Base mainnet
  address: "0xef7d6880e7837D06bAa6090F8378592F3B4e174a",
});

export default function ClaimButton() {
  const { mutate: sendTransaction, isLoading, isSuccess, error } =
    useSendTransaction();

  const handleClaim = async () => {
    try {
      const tx = prepareContractCall({
        contract,
        method: "function claimRewards()",
        params: [],
      });
      await sendTransaction(tx);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={handleClaim}
        disabled={isLoading}
        style={{
          padding: "12px 25px",
          borderRadius: "12px",
          border: "none",
          background: isLoading ? "#444" : "#58a6ff",
          color: "white",
          fontWeight: "bold",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "0.3s",
        }}
      >
        {isLoading ? "Claiming..." : "Claim Rewards"}
      </button>

      {isSuccess && <p style={{ color: "lightgreen" }}>✅ Rewards claimed!</p>}
      {error && <p style={{ color: "tomato" }}>❌ {error.message}</p>}
    </div>
  );
}