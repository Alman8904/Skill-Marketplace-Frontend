import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function MyTrust() {
  const [trust, setTrust] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrust();
  }, []);

  const loadTrust = async () => {
    try {
      const data = await authFetch("/trust/me");
      setTrust(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load trust score");
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading trust score...</p>;
  }

  if (message) {
    return <p>{message}</p>;
  }

  if (!trust) {
    return <p>No trust data available</p>;
  }

  return (
    <div>
      <h3>My Trust Score</h3>

      <div>
        <p>Badge: {trust.trustBadge}</p>
      </div>

      {trust.jobsAsProvider > 0 && (
        <div>
          <h4>As Provider</h4>
          <p>Total Jobs: {trust.jobsAsProvider}</p>
          <p>Completed: {trust.completedAsProvider}</p>
          <p>
            Completion Rate:{" "}
            {trust.providerCompletionRate?.toFixed(1)}%
          </p>
        </div>
      )}

      {trust.jobsAsConsumer > 0 && (
        <div>
          <h4>As Consumer</h4>
          <p>Total Orders Placed: {trust.jobsAsConsumer}</p>
          <p>Refunds Requested: {trust.refundsAsConsumer}</p>
          <p>
            Refund Rate:{" "}
            {trust.consumerRefundRate?.toFixed(1)}%
          </p>
        </div>
      )}

      {trust.jobsAsProvider === 0 &&
        trust.jobsAsConsumer === 0 && (
          <div>
            <p>
              New user. Start completing orders to build your trust score.
            </p>
          </div>
        )}

      <div>
        <p>
          Trust Badge Guide:
        </p>
        <ul>
          <li><strong>TRUSTED:</strong> 80%+ completion, no refunds</li>
          <li><strong>NEUTRAL:</strong> 50%+ completion rate</li>
          <li><strong>RISKY:</strong> Below 50% completion</li>
          <li><strong>NEW:</strong> No completed orders yet</li>
        </ul>
      </div>
    </div>
  );
}
