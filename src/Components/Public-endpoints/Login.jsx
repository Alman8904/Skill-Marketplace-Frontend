import { useState } from "react";
import { buildUrl } from "../../config/api";

export default function Login({ onLoginSuccess }) {

  const [form, setForm] = useState({
    username: "",
    password: ""
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
      const res = await fetch(buildUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Login failed");
      }

      const token = await res.text();
      localStorage.setItem("token", token);

      setMessage("Login successful");
      onLoginSuccess();
    } catch (err) {
      setMessage(err.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h2 className="mb-lg">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full"
        />
        <button type="submit" className="btn-primary mt-sm">Login</button>
      </form>
      {message && <p className="message message-error mt-md">{message}</p>}
    </div>
  );
}