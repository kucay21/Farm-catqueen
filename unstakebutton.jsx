import React, { useState } from "react";
import { prepareContractCall, getContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client, chain } from "./thirdwebClient";

const contract = getContract({
  client,
  chain,
  address: "0xef7d6880e7837D06bAa6090F8378592F3B4e174a",
});

export default function UnstakeButton() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const { mutateAsync: sendTransaction, isLoading } = useSendTransaction();

  const handleUnstake = async () => {
    try {
      setStatus("");
      const tx = prepareContractCall({
        contract,
        method: "unstake",
        params: [amount],
      });
      const receipt = await sendTransaction(tx);
      if (receipt?.transactionHash) {
        setStatus("✅ Berhasil unstake!");
      } else {
        setStatus("❌ Gagal unstake.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Gagal unstake.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h2>Unstake Tokens</h2>
      <input
        type="text"
        placeholder="Jumlah token"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          width: "200px",
          marginBottom: "10px",
          textAlign: "center",
        }}
      />
      <br />
      <button
        onClick={handleUnstake}
        disabled={isLoading}
        style={{
          padding: "12px 25px",
          borderRadius: "12px",
          border: "none",
          background: isLoading ? "#444" : "#f7b500",
          color: "white",
          fontWeight: "bold",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Unstaking..." : "Unstake"}
      </button>
      {status && (
        <p
          style={{
            color: status.includes("✅") ? "lightgreen" : "tomato",
            marginTop: "10px",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}