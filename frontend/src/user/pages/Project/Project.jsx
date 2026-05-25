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

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await res.json();
        setProjects(data);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="project">

      <h1>Project</h1>

      <div className="project-container">

        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div className="project-card skeleton-project" key={index}>

                {/* IMAGE */}
                <div className="skeleton skeleton-project-img"></div>

                {/* CONTENT */}
                <div className="project-content">

                  <div className="skeleton skeleton-project-title"></div>

                  <div className="skeleton skeleton-project-btn"></div>

                </div>

              </div>
            ))
          : projects.map((project) => (
              <div className="project-card" key={project._id}>

                <div className="image-wrapper">

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
                      <p className="overlay-desc">
                        {project.description}
                      </p>
                    )}

                    {project.title && (
                      <h2 className="overlay-title">
                        {project.title}
                      </h2>
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

    </div>
  );
}