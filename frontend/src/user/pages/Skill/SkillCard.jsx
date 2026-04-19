import React, { useEffect, useState } from "react";

export default function SkillCard({ skill }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = skill.percent;

    const timer = setInterval(() => {
      start += 1;

      if (start >= end) {
        start = end;
        clearInterval(timer);
      }

      setProgress(start);
    }, 20);

    return () => clearInterval(timer);
  }, [skill.percent]);

  return (
    <div className="skill-card">

      {skill.image?.url && (
        <img src={skill.image.url} alt={skill.name} />
      )}

      <div className="skill-footer">
        <div className="title">
          <h3>{skill.name}</h3>
          <p>{skill.items}</p>
        </div>
        <div className="circle" style={{ "--percent": progress }}>
          <span>{progress}%</span>
        </div>
      </div>

    </div>
  );
}
