import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function UpdateUserSkill({ skill, onUpdated, onCancel }) {

  const [form, setForm] = useState({
    description: skill.description || "",
    rate: skill.rate || "",
    experience: skill.experience || "",
    serviceMode: skill.serviceMode || "REMOTE"
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
      await authFetch(`/user-skills/update/${skill.userSkillId}`, {
        method: "PUT",
        body: JSON.stringify({
          description: form.description,
          rate: Number(form.rate),
          experience: Number(form.experience),
          serviceMode: form.serviceMode
        })
      });

      setMessage("Skill updated successfully");
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to update skill");
    }
  };

  return (
    <div className="card">
      <h3>Update Skill: {skill.skillName}</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-md">
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="col-span-2"
          />

          <input
            name="rate"
            type="number"
            placeholder="Rate ($/hr)"
            value={form.rate}
            onChange={handleChange}
            required
          />

          <input
            name="experience"
            type="number"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleChange}
            required
          />

          <select
            name="serviceMode"
            value={form.serviceMode}
            onChange={handleChange}
            className="col-span-2"
          >
            <option value="REMOTE">REMOTE</option>
            <option value="LOCAL">LOCAL</option>
          </select>
        </div>

        <div className="mt-md">
          <button type="submit" className="btn-primary">Update</button>
          <button type="button" className="btn-secondary ml-sm" onClick={onCancel}>Cancel</button>
        </div>
      </form>

      {message && <p className="message message-success mt-md">{message}</p>}
    </div>
  );
}