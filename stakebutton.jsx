import React, { useState } from "react";
import { getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "./App.jsx";

const chain = defineChain(8453);
const stakingAddress = "0xef7d6880e7837D06bAa6090F8378592F3B4e174a";
const tokenAddress = "0x586f3cb4a16c8dbf6a62b599a73eca9cd0b945fe";

const stakingContract = getContract({ client, chain, address: stakingAddress });
const tokenContract = getContract({ client, chain, address: tokenAddress });

export default function StakeButton() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleStake = async () => {
    try {
      setStatus("pending");

      // ✅ Convert amount → wei
      const parsedAmount = BigInt(amount) * 10n ** 18n;

      // ✅ 1. Approve
      const approveTx = await prepareContractCall({
        contract: tokenContract,
        method: "approve",
        params: [stakingAddress, parsedAmount],
        value: 0n, // ✅ approve TIDAK perlu ETH
      });

      await sendAndConfirmTransaction({
        transaction: approveTx,
        client,
      });

      // ✅ 2. Stake
      const stakeTx = await prepareContractCall({
        contract: stakingContract,
        method: "stake",
        params: [parsedAmount],
        value: 0n, // ✅ WAJIB ADA karena stake() payable
      });

      await sendAndConfirmTransaction({
        transaction: stakeTx,
        client,
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        type="number"
        placeholder="Jumlah token"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleStake}>Stake</button>

      {status === "pending" && <p style={{ color: "yellow" }}>⏳ Menunggu konfirmasi...</p>}
      {status === "success" && <p style={{ color: "lightgreen" }}>✅ Staking berhasil!</p>}
      {status === "error" && <p style={{ color: "tomato" }}>❌ Gagal staking.</p>}
    </div>
  );
}
