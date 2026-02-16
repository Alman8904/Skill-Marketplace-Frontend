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
    <div className="card">
      <h3>My Trust Score</h3>

      <div className="mb-md">
        <p className="text-xl">Badge: <span className={`status-badge status-${trust.trustBadge === 'TRUSTED' ? 'completed' : trust.trustBadge === 'RISKY' ? 'cancelled' : 'in-progress'}`}>{trust.trustBadge}</span></p>
      </div>

      <div className="flex gap-md flex-wrap">
        {trust.jobsAsProvider > 0 && (
          <div className="card bg-hover flex-1">
            <h4>As Provider</h4>
            <p>Total Jobs: {trust.jobsAsProvider}</p>
            <p>Completed: {trust.completedAsProvider}</p>
            <p>
              Completion Rate:{" "}
              <b>{trust.providerCompletionRate?.toFixed(1)}%</b>
            </p>
          </div>
        )}

        {trust.jobsAsConsumer > 0 && (
          <div className="card bg-hover flex-1">
            <h4>As Consumer</h4>
            <p>Total Orders Placed: {trust.jobsAsConsumer}</p>
            <p>Refunds Requested: {trust.refundsAsConsumer}</p>
            <p>
              Refund Rate:{" "}
              <b>{trust.consumerRefundRate?.toFixed(1)}%</b>
            </p>
          </div>
        )}
      </div>

      {trust.jobsAsProvider === 0 &&
        trust.jobsAsConsumer === 0 && (
          <div className="message message-info">
            <p>
              New user. Start completing orders to build your trust score.
            </p>
          </div>
        )}

      <div className="mt-lg">
        <p className="text-muted">
          Trust Badge Guide:
        </p>
        <ul className="text-sm text-secondary ml-md">
          <li><span className="text-success">TRUSTED</span>: 80%+ completion, no refunds</li>
          <li><span className="text-warning">NEUTRAL</span>: 50%+ completion rate</li>
          <li><span className="text-error">RISKY</span>: Below 50% completion</li>
          <li><span className="text-muted">NEW</span>: No completed orders yet</li>
        </ul>
      </div>
    </div>
  );
}
