import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function AssignSkill({ onUpdated }) {

  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    skillId: "",
    description: "",
    rate: "",
    experience: "",
    serviceMode: "REMOTE"
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
      const payload = {
        skills: [
          {
            skillId: Number(form.skillId),
            description: form.description,
            rate: Number(form.rate),
            experience: Number(form.experience),
            serviceMode: form.serviceMode
          }
        ]
      };

      await authFetch("/user-skills/assign", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setMessage("Skill assigned successfully!");
      if (onUpdated) onUpdated();

      setForm({
        skillId: "",
        description: "",
        rate: "",
        experience: "",
        serviceMode: "REMOTE"
      });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to assign skill");
    }
  };

  return (
    <div className="card">
      <h3>Assign Skill</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-md">
          <select
            name="skillId"
            value={form.skillId}
            onChange={handleChange}
            required
            className="w-full"
          >
            <option value="">Select Skill</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.skillName}
              </option>
            ))}
          </select>

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full"
          />

          <input
            name="rate"
            type="number"
            placeholder="Rate ($/hr)"
            value={form.rate}
            onChange={handleChange}
            className="w-full"
          />

          <input
            name="experience"
            type="number"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleChange}
            className="w-full"
          />

          <select
            name="serviceMode"
            value={form.serviceMode}
            onChange={handleChange}
            className="w-full"
          >
            <option value="REMOTE">REMOTE</option>
            <option value="LOCAL">LOCAL</option>
          </select>
        </div>

        <button type="submit" className="btn-primary mt-md">Assign Skill</button>
      </form>

      {message && <p className="message message-success mt-md">{message}</p>}
    </div>
  );
}