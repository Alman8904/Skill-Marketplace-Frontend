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
    <div>
      <h3>Delete Account</h3>
      <button onClick={handleDelete}>Delete My Account</button>
      <p>{message}</p>
    </div>
  );
}