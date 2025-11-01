import React from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "./App.jsx";
import { base } from "thirdweb/chains";

// Alamat kontrak kamu
const contract = getContract({
  client,
  chain: base, // chain: defineChain(8453) juga boleh
  address: "0xef7d6880e7837D06bAa6090F8378592F3B4e174a",
});

export default function ClaimButton() {
  const { mutate: sendTransaction, isLoading, isSuccess, error } =
    useSendTransaction();

  const handleClaim = async () => {
    try {
      const tx = await prepareContractCall({
        contract,
        method: "claimRewards", // jangan tulis 'function claimRewards()'
        params: [],
      });
      await sendTransaction(tx);
    } catch (err) {
      console.error("❌ Claim error:", err);
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

      {isSuccess && (
        <p style={{ color: "lightgreen", marginTop: "10px" }}>
          ✅ Rewards claimed successfully!
        </p>
      )}
      {error && (
        <p style={{ color: "tomato", marginTop: "10px" }}>
          ❌ {error?.message || "Transaction failed"}
        </p>
      )}
    </div>
  );
}
