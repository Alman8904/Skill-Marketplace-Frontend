import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function PlaceOrder({ onOrderPlaced }) {

  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    providerId: "",
    skillId: "",
    description: "",
    estimatedHours: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await authFetch("/admin/skills");
      setSkills(data.content || data);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load skills");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authFetch("/orders/place", {
        method: "POST",
        body: JSON.stringify({
          providerId: Number(form.providerId),
          skillId: Number(form.skillId),
          description: form.description,
          estimatedHours: Number(form.estimatedHours)
        })
      });

      setMessage("Order placed successfully!");
      if (onOrderPlaced) onOrderPlaced();

      setForm({
        providerId: "",
        skillId: "",
        description: "",
        estimatedHours: ""
      });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to place order");
    }
  };

  return (
    <div>
      <h3>Place Order</h3>

      <form onSubmit={handleSubmit}>
        <input
          name="providerId"
          type="number"
          placeholder="Provider ID"
          value={form.providerId}
          onChange={handleChange}
          required
        />
        <br />

        <select
          name="skillId"
          value={form.skillId}
          onChange={handleChange}
          required
        >
          <option value="">Select Skill</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.skillName}
            </option>
          ))}
        </select>
        <br />

        <textarea
          name="description"
          placeholder="Order description/requirements"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
        />
        <br />

        <input
          name="estimatedHours"
          type="number"
          placeholder="Estimated hours"
          value={form.estimatedHours}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Place Order</button>
      </form>

      <p>{message}</p>
    </div>
  );
}