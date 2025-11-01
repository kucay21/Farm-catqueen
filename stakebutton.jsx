import React, { useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { client } from "./App.jsx";

// ✅ Alamat kontrak staking & token kamu
const chain = defineChain(8453);
const stakingAddress = "0xef7d6880e7837D06bAa6090F8378592F3B4e174a";
const tokenAddress = "0x586f3cb4a16c8dbf6a62b599a73eca9cd0b945fe";

// 🔗 Buat instance kontrak
const stakingContract = getContract({ client, chain, address: stakingAddress });
const tokenContract = getContract({ client, chain, address: tokenAddress });

export default function StakeButton() {
  const [amount, setAmount] = useState("");
  const { mutate: sendTransaction, isLoading, isSuccess, error } = useSendTransaction();

  const handleStake = async () => {
    try {
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Masukkan jumlah yang valid!");
        return;
      }

      const parsedAmount = BigInt(Number(amount) * 10n ** 18n); // token 18 desimal

      // ✅ Langkah 1: Approve staking contract
      const approveTx = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address spender, uint256 amount)",
        params: [stakingAddress, parsedAmount],
      });
      await sendTransaction(approveTx);

      // ✅ Langkah 2: Stake token
      const stakeTx = prepareContractCall({
        contract: stakingContract,
        method: "function stake(uint256 _amount)",
        params: [parsedAmount],
      });
      await sendTransaction(stakeTx);

      alert("✅ Staking berhasil!");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal staking: " + err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <input
        type="number"
        placeholder="Jumlah token"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #333",
          background: "#161b22",
          color: "#fff",
          width: "180px",
          textAlign: "center",
          marginBottom: "10px",
        }}
      />
      <br />
      <button
        onClick={handleStake}
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
        {isLoading ? "Staking..." : "Stake Token"}
      </button>

      {isSuccess && <p style={{ color: "lightgreen" }}>✅ Transaksi berhasil!</p>}
      {error && <p style={{ color: "tomato" }}>❌ {error.message}</p>}
    </div>
  );
}
