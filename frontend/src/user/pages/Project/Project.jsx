import React, { useEffect, useState } from "react";
import "./project.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiUrl) {
      console.error("API URL not defined");
      return;
    }
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${apiUrl}/project`);
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false)
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (projects.length === 0) return <p>No projects found</p>;

  return (
    <div className="project">
      <h1>Project</h1>
      <div className="project-container">
        {projects.map((project) => (
          <div className="project-card" key={project._id}>
            <div className="image-wrapper">

              {/* ✅ FIXED IMAGE */}
              {project.image?.url && (
                <img
                  src={project.image.url}
                  className="project-img"
                  alt={project.title}
                  loading="lazy"
                />
              )}

              <div className="overlay">

                {project.description && (
                  <p className="overlay-desc">{project.description}</p>
                )}

                {project.title && (
                  <h2 className="overlay-title">{project.title}</h2>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Details
                  </a>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div >
  );
}
