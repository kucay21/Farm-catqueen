
import React, { useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { client } from "./App.jsx";

const chain = defineChain(8453);
const stakingAddress = "0xef7d6880e7837D06bAa6090F8378592F3B4e174a";
const tokenAddress = "0x586f3cb4a16c8dbf6a62b599a73eca9cd0b945fe";

const stakingContract = getContract({ client, chain, address: stakingAddress });
const tokenContract = getContract({ client, chain, address: tokenAddress });

export default function StakeButton() {
  const [amount, setAmount] = useState("");
  const { mutateAsync: sendTx, isLoading, error } = useSendTransaction();

  const handleStake = async () => {
    try {
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Masukkan jumlah valid!");
        return;
      }

      // ✅ Convert amount → 18 decimals
      const parsedAmount = BigInt(amount) * (10n ** 18n);

      // ✅ 1. Approve
      const approveTx = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address spender, uint256 amount)",
        params: [stakingAddress, parsedAmount],
      });

      await sendTx({ transaction: approveTx });

      // ✅ 2. Stake
      const stakeTx = prepareContractCall({
        contract: stakingContract,
        method: "function stake(uint256 _amount)",
        params: [parsedAmount],
      });

      await sendTx({ transaction: stakeTx });

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
      />
      
      <button onClick={handleStake} disabled={isLoading}>
        {isLoading ? "Processing..." : "Stake Token"}
      </button>

      {error && <p style={{ color: "tomato" }}>❌ {error.message}</p>}
    </div>
  );
}
