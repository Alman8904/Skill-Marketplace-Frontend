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
    <div>
      <h3>Check Trust Score</h3>

      <form onSubmit={loadTrust}>
        <div>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="radio"
              value="provider"
              checked={userType === "provider"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Provider
          </label>

          <label>
            <input
              type="radio"
              value="consumer"
              checked={userType === "consumer"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Consumer
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Check Trust Score"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {trust && (
        <div>
          <div>
            <p>Badge: {trust.trustBadge}</p>
          </div>

          <div>
            <h4>Trust Score for: {username}</h4>
            <p>Completed Jobs: {trust.completedJobs}</p>
            <p>Cancelled Jobs: {trust.cancelledJobs}</p>
            <p>Refunds: {trust.refundCount}</p>
            <p>
              Completion Rate: {trust.completionRate?.toFixed(1)}%
            </p>
          </div>

          <div>
            <p>
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
