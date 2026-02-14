import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function UpdateProfile({ onUpdated }) {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    userType: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Only send fields that are filled
      const payload = {};
      if (form.firstName) payload.firstName = form.firstName;
      if (form.lastName) payload.lastName = form.lastName;
      if (form.password) payload.password = form.password;
      if (form.userType) payload.userType = form.userType;

      await authFetch("/public/user/update", {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      setMessage("Profile updated successfully");
      if (onUpdated) onUpdated();

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        password: "",
        userType: ""
      });
    } catch (err) {
      setMessage(err.message || "Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Update Profile</h3>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />
        <br />

        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />
        <br />

        <input
          name="password"
          type="password"
          placeholder="New Password (min 8 characters)"
          value={form.password}
          onChange={handleChange}
        />
        <br />

        <select
          name="userType"
          value={form.userType}
          onChange={handleChange}
        >
          <option value="">Keep Current User Type</option>
          <option value="PROVIDER">PROVIDER</option>
          <option value="CONSUMER">CONSUMER</option>
        </select>
        <br /><br />

        <button type="submit">Update</button>
      </form>

      <p>{message}</p>
      <p><small>Leave fields empty to keep current values</small></p>
    </div>
  );
}