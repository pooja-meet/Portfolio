import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import './project.css'
export default function AddProject() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [show, setShow] = useState(false)

  const [project, setProject] = useState({
    title: "",
    image: null,
    link: "",
    description: "",
    order: 0
  });

  // ================= INPUT =================
  const handleChange = (e) => {
    setProject((prev) => ({
      ...prev, [e.target.name]: e.target.value
    }));
  };

  // ================= FILE =================
  const handleFile = (e) => {
    const file = e.target.files[0];

    setProject((prev) => ({
      ...prev,
      image: file
    }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/project`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ================= CLEAN MEMORY =================
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ================= SUBMIT (CREATE + UPDATE) =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", project.title);
      formData.append("link", project.link);
      formData.append("description", project.description)
      formData.append("order", project.order)

      if (project.image instanceof File) {
        formData.append("image", project.image);
      }

      const url = editingId
        ? `${apiUrl}/project/${editingId}`
        : `${apiUrl}/project`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(editingId ? "Updated ✅" : "Created ✅");

      // RESET FORM
      setProject({
        title: "",
        image: null,
        link: "",
        description: "",
        order: ""
      });

      setPreview(null);
      setEditingId(null);

      fetchProjects();

    } catch (err) {
      console.error(err);
      alert(err.message || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setProject({
      title: item.title || "",
      image: null,
      link: item.link || "",
      description: item.description || "",
      order: item.order || ''
    });

    setPreview(item.image?.url || null);
    setEditingId(item._id);
    setShow(true)

  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      const res = await fetch(`${apiUrl}/project/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Deleted ✅");
        fetchProjects();
      } else {
        alert(data.message || "Failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (

    <>
      <div className="admin_form">
        <h2 className="hero_heading" onClick={() => setShow(!show)}>
          {editingId ? "Edit Project Section ✏️" : "Add Project Section"}
          <span>
            {show ? "➖" : "➕"}
          </span>
        </h2>
        {/* FORM */}
        {show && (

          <form onSubmit={handleSubmit} className="hero-form">
            <div className="form-group">
              <label htmlFor="Project Title">Project Title</label>
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={project.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="Project Description ">Project Description </label>
              <textarea
                type="text"
                name="description"
                placeholder="Project description"
                value={project.description}
                onChange={handleChange}
                required
              />
            </div>
            <input type="number" value={project.order} placeholder="order" name="order" onChange={handleChange} required id="" />
            <div className="form-group">
              <label htmlFor="Project Image">Project Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
              />

              {/* PREVIEW */}
              {preview && (
                <div className="project-image-preview">
                  <img src={preview} width="120" alt="preview" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="Project Link">Project Link</label>
              <input
                type="text"
                name="link"
                placeholder="Project Link"
                value={project.link}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="project-submit" disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </form>

        )}
        {/* LIST */}
        {!show && projects && (

          <div className="aproject-list">
            {projects.length > 0 &&
              <div className="aproject-grid">
                {projects.map((item) => (
                  <div key={item._id} className="aproject-card">

                    {/* IMAGE FIXED */}
                    {item.image?.url && (
                      <img src={item.image.url} alt={item.title} width="100%" />
                    )}

                    <h3>{item.title}</h3>
                    <h3>{item.description}</h3>
                    <a href={item.link} target="_blank" rel="noreferrer">
                      Visit
                    </a>

                    <div className="project_actions">
                      <div className="button">
                        <button className="edit_btn" onClick={() => handleEdit(item)}>Edit</button>
                      </div>
                      <div className="button">
                        <button className="delete_btn" onClick={() => handleDelete(item._id)}>Delete</button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            }
          </div>
        )}

      </div>
    </>
  );
}
