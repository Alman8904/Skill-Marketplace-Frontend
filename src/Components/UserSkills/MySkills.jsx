import { useEffect, useState } from "react";
import { authFetch } from "../jwt storage/authFetch";

export default function MySkills() {
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMySkills();
  }, []);

  const loadMySkills = async () => {
    try {
      const data = await authFetch("/user-skills/all-userSkills");
      setSkills(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load assigned skills");
    }
  };

  if (!skills.length) {
    return <p>{message || "No skills assigned yet"}</p>;
  }

  return (
    <div>
      <h3>My Skills</h3>

      {skills.map((s) => (
        <div key={s.userSkillId}>
          <b>{s.skillName}</b><br />
          Rate: {s.rate}<br />
          Experience: {s.experience}<br />
          Mode: {s.serviceMode}
          <hr />
        </div>
      ))}
    </div>
  );
}
