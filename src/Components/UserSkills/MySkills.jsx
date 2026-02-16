import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";
import UpdateUserSkill from "./UpdateUserSkill";

export default function MySkills() {

  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    loadMySkills();
  }, []);

  const loadMySkills = async () => {
    try {
      const data = await authFetch("/user-skills/all-userSkills");
      setSkills(data);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load skills");
    }
  };

  const handleDeactivate = async (userSkillId) => {
    if (!confirm("Deactivate this skill?")) return;

    try {
      await authFetch(`/user-skills/deactivate/${userSkillId}`, {
        method: "DELETE"
      });
      setMessage("Skill deactivated");
      loadMySkills();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to deactivate skill");
    }
  };

  if (editingSkill) {
    return (
      <UpdateUserSkill
        skill={editingSkill}
        onUpdated={() => {
          setEditingSkill(null);
          loadMySkills();
        }}
        onCancel={() => setEditingSkill(null)}
      />
    );
  }

  if (!skills.length) {
    return <p>{message || "No skills assigned yet"}</p>;
  }

  return (
    <div className="card">
      <h3>My Skills</h3>

      {skills.map((s) => (
        <div key={s.userSkillId} className="card bg-hover mb-md">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-primary">{s.skillName}</h4>
              <p className="text-muted text-sm">{s.description}</p>
              <div className="flex gap-md mt-sm text-sm">
                <p>Rate: <b>${s.rate}/hr</b></p>
                <p>Experience: <b>{s.experience} years</b></p>
                <p>Mode: <span className="status-badge status-accepted">{s.serviceMode}</span></p>
              </div>
            </div>
            <div className="flex gap-sm">
              <button className="btn-secondary btn-sm" onClick={() => setEditingSkill(s)}>Edit</button>
              <button className="btn-danger btn-sm" onClick={() => handleDeactivate(s.userSkillId)}>Deactivate</button>
            </div>
          </div>
        </div>
      ))}

      {message && <p className="message message-success">{message}</p>}
    </div>
  );
}