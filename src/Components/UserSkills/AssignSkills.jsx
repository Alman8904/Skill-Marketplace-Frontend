import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function AssignSkill({ onUpdated }) {
  // all available skills from admin catalog
  const [skills, setSkills] = useState([]);

  // form state matching your AssignSkillDTO
  const [form, setForm] = useState({
    skillId: "",
    description: "",
    rate: "",
    experience: "",
    serviceMode: "REMOTE"
  });

  const [message, setMessage] = useState("");

  // load all skills when component mounts
  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await authFetch("/admin/skills"); 

      // backend returns Page<SkillResponseDTO>
      // so content is inside .content
      setSkills(data.content ?? data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load skills");
    }
  };

  // handle form input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // submit assign request
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

      setMessage("Skill assigned");

      // tell parent to refresh profile
      onUpdated();

      // optional reset
      setForm({
        skillId: "",
        description: "",
        rate: "",
        experience: "",
        serviceMode: "REMOTE"
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to assign skill");
    }
  };

  return (
    <div>
      <h3>Assign Skill</h3>

      <form onSubmit={handleSubmit}>
        {/* skill dropdown */}
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

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />

        <input
          name="rate"
          type="number"
          placeholder="Rate"
          value={form.rate}
          onChange={handleChange}
        />
        <br />

        <input
          name="experience"
          type="number"
          placeholder="Experience (years)"
          value={form.experience}
          onChange={handleChange}
        />
        <br />

        {/* service mode dropdown */}
        <select
          name="serviceMode"
          value={form.serviceMode}
          onChange={handleChange}
        >
          <option value="REMOTE">REMOTE</option>
          <option value="LOCAL">LOCAL</option>
        </select>
        <br /><br />

        <button type="submit">Assign Skill</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
