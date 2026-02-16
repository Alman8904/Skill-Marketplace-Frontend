import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function DeleteUser({ onDeleted }) {

  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    try {
      await authFetch("/public/user/delete", {
        method: "DELETE"
      });

      setMessage("Account deleted");
      localStorage.removeItem("token");
      if (onDeleted) onDeleted();
    } catch (err) {
      setMessage(err.message || "Failed to delete account");
      console.error(err);
    }
  };

  return (
  <div className="card">
    <h3 className="text-error">Delete Account</h3>
    <p className="text-warning">This action cannot be undone!</p>
    <button onClick={handleDelete} className="btn-danger">Delete My Account</button>
    {message && <p className="message message-error mt-md">{message}</p>}
  </div>
  );
}