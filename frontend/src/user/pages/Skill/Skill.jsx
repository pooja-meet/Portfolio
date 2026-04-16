import React, { useEffect, useState } from "react";
import "./skill.css";
import SkillCard from "./SkillCard";

const apiUrl = import.meta.env.VITE_API_URL;

export default function SkillList() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/skill`)
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="skill-list">
      <h2>All Skills</h2>

      {skills.length === 0 ? (
        <p>No skills found</p>
      ) : (
        <div className="skill-grid">
          {skills.map((skill) => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}