import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function PublicTrust() {
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("provider");
  const [trust, setTrust] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTrust = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage("Please enter a username");
      return;
    }

    setLoading(true);
    setMessage("");
    setTrust(null);

    try {
      const endpoint =
        userType === "provider"
          ? `/trust/provider/${username}`
          : `/trust/consumer/${username}`;

      const data = await authFetch(endpoint);
      setTrust(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load trust score");
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Check Trust Score</h3>

      <form onSubmit={loadTrust} className="mb-lg">
        <div className="flex gap-sm items-center mb-sm">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex gap-md mb-md">
          <label className="flex items-center gap-xs cursor-pointer">
            <input
              type="radio"
              value="provider"
              checked={userType === "provider"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Provider
          </label>

          <label className="flex items-center gap-xs cursor-pointer">
            <input
              type="radio"
              value="consumer"
              checked={userType === "consumer"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Consumer
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Loading..." : "Check Trust Score"}
        </button>
      </form>

      {message && <p className="message message-error">{message}</p>}

      {trust && (
        <div className="card bg-hover">
          <div className="mb-md">
            <p className="text-xl">Badge: <span className={`status-badge status-${trust.trustBadge === 'TRUSTED' ? 'completed' : trust.trustBadge === 'RISKY' ? 'cancelled' : 'in-progress'}`}>{trust.trustBadge}</span></p>
          </div>

          <div>
            <h4>Trust Score for: <span className="text-primary">{username}</span></h4>
            <div className="grid grid-cols-2 gap-sm mt-sm">
              <p>Completed Jobs: <b>{trust.completedJobs}</b></p>
              <p>Cancelled Jobs: <b>{trust.cancelledJobs}</b></p>
              <p>Refunds: <b>{trust.refundCount}</b></p>
              <p>
                Completion Rate: <b>{trust.completionRate?.toFixed(1)}%</b>
              </p>
            </div>
          </div>

          <div className="mt-md">
            <p className="text-muted">
              {trust.trustBadge === "TRUSTED" &&
                "Highly Trusted User"}
              {trust.trustBadge === "NEUTRAL" &&
                "Average Trust Level"}
              {trust.trustBadge === "RISKY" &&
                "Low Trust Score"}
              {trust.trustBadge === "NEW" &&
                "New User"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
