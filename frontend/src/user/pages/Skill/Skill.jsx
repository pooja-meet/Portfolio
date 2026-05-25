import React, { useEffect, useState } from "react";
import "./skill.css";
import SkillCard from "./SkillCard";

const apiUrl = import.meta.env.VITE_API_URL;

export default function SkillList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/skill`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch skills");
        }
        return res.json();
      })
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="skill-list">
        <h2>All Skills</h2>
        <div className="skill-grid">
          {[1, 2, 3, 4].map((index) => (
            <div className="skill-card skeleton-card" key={index}>
              {/* Image Skeleton */}
              <div className="skeleton skeleton_skill_img"></div>
              
              <div className="skill-footer">
                <div className="title" style={{ width: "100%" }}>
                  {/* Name and Items Skeleton */}
                  <div className="skeleton skeleton_skill_title"></div>
                  <div className="skeleton skeleton_skill_text"></div>
                </div>
                {/* Circle Percentage Skeleton */}
                <div className="skeleton skeleton_skill_circle"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. ERROR UI
  if (error) {
    return <div className="skill-error">Something went wrong: {error}</div>;
  }

  // 3. ACTUAL DATA UI
  return (
    <div className="skill-list">
      <h2>All Skills</h2>

      {skills.length > 0 ? (
        <div className="skill-grid">
          {skills.map((skill) => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      ) : (
        <p>No skills found.</p>
      )}
    </div>
  );
}