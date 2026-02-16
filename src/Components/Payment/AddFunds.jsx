import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function AddFunds({ onFundsAdded }) {

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(amount) <= 0) {
      setMessage("Amount must be positive");
      return;
    }

    try {
      await authFetch("/payment/add-funds", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) })
      });

      setMessage(`$${amount} added to wallet successfully!`);
      setAmount("");

      if (onFundsAdded) onFundsAdded();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to add funds");
    }
  };

  return (
    <div className="card">
      <h2>Add Funds to Wallet</h2>

      <form onSubmit={handleSubmit} className="flex gap-sm items-center">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ maxWidth: "200px" }}
        />
        <button type="submit" className="btn-primary ml-sm">Add Funds</button>
      </form>

      {message && <p className="message message-success mt-md">{message}</p>}
    </div>
  );
}