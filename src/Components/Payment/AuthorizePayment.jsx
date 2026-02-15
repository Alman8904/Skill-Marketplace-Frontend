import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function AuthorizePayment({ orderId, amount, onAuthorized }) {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthorize = async () => {
    if (!confirm(`Authorize payment of $${amount}? This will lock funds in your wallet.`)) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await authFetch("/payment/authorize", {
        method: "POST",
        body: JSON.stringify({
          orderId: orderId,
          amount: amount
        })
      });

      setMessage(`Payment authorized! Remaining balance: $${data.walletBalance}`);
      setLoading(false);
      
      setTimeout(() => {
        if (onAuthorized) onAuthorized();
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to authorize payment");
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Authorization Required</h4>
      <p>Amount: <b>${amount}</b></p>
      <p>This will lock funds in escrow until work is delivered.</p>
      <p><small>Provider cannot accept order until you authorize payment.</small></p>
      
      <button 
        onClick={handleAuthorize} 
        disabled={loading}
      >
        {loading ? "Authorizing..." : "Authorize Payment"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}