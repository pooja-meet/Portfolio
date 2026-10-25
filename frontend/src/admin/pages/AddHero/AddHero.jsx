
import React, { useEffect, useState } from "react";
import './addhero.css'
const apiUrl = import.meta.env.VITE_API_URL;

export default function AddHero() {
  const [loading, setLoading] = useState(false);
  const [hero, setHero] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    experience: "",
    netlify: "",
    description: "",
    github: "",
    image: null
  });

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= FILE =================
  const handleFile = (e) => {
    const file = e.target.files[0];

    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= FETCH HERO =================
  const fetchHero = async () => {
    try {
      const res = await fetch(`${apiUrl}/hero/all`);
      const data = await res.json();

      if (data) {
        setHero(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHero();
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
      formData.append("name", form.name);
      formData.append("subtitle", form.subtitle);
      formData.append("experience", form.experience);
      formData.append("description", form.description);
      formData.append("netlify", form.netlify);
      formData.append("github", form.github);

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }
      const url = editMode
        ? `${apiUrl}/hero/${hero._id}`
        : `${apiUrl}/hero`;

      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });


      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(editMode ? "Updated ✅" : "Created ✅");

      // ✅ RESET PROPERLY
      setForm({
        name: "",
        subtitle: "",
        experience: "",
        description: "",
        netlify: "",
        github: "",
        image: null
      });

      setPreview(null);

      fetchHero();

    } catch (err) {
      alert(err.message || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = () => {
    setForm({
      name: hero.name || "",
      subtitle: hero.subtitle || "",
      experience: hero.experience || "",
      netlify: hero.social?.netlify || "",
      description: hero.description || "",
      github: hero.social?.github || "",
      image: null
    });

    setPreview(hero.image?.url || null);
    setEditMode(true);
    setShow(true)
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Delete Hero?")) return;

    try {
      const res = await fetch(`${apiUrl}/hero/${hero._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        alert("Deleted ✅");
        setHero(null);
        setForm({
          name: "",
          subtitle: "",
          experience: "",
          netlify: "",
          description: "",
          github: "",
          image: null
        });
      }
    } catch (err) {
      alert("Error ❌");
    }
  };

  return (
    <>

      <div className="admin_hero">

        <h2
          className="hero_heading"
          onClick={() => setShow(!show)}
        >
          {editMode ? "Edit Hero Section ✏️" : "Add Hero Section"}

          <span>
            {show ? "➖" : "➕"}
          </span>
        </h2>

        {/* FORM */}
        {show && (
          <form onSubmit={handleSubmit} className="hero-form">

            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subtitle</label>
              <input
                name="subtitle"
                placeholder="Enter subtitle"
                value={form.subtitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Experience</label>
              <input
                type="text"
                name="experience"
                placeholder="e.g. 2 Years"
                value={form.experience}
                onChange={handleChange}
              />
            </div>

            <div className="form-group image-group">
              <label>Hero Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
              />

              {preview && (
                <div className="image-preview">
                  <img
                    src={preview}
                    alt="preview"
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Linkdin</label>
              <input
                name="netlify"
                placeholder="Linkdin URL"
                value={form.netlify}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>GitHub</label>
              <input
                name="github"
                placeholder="GitHub URL"
                value={form.github}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editMode
                  ? "Update"
                  : "Create"
              }
            </button>

          </form>
        )}

        {/* DISPLAY */}
        {/* DISPLAY */}

        {!show && hero && (
          <div className="hero_preview">

            {/* IMAGE */}
            <div className="hero_preview_image">
              {hero.image?.url && (
                <img
                  src={hero.image.url}
                  alt="hero"
                />
              )}
            </div>


            {/* CONTENT */}
            <div className="hero_preview_content">

              <h3>{hero.name}</h3>

              <p className="hero_subtitle">
                {hero.subtitle}
              </p>

              <p className="hero_description">
                {hero.description}
              </p>

              {hero.experience && (
                <p className="hero_experience">
                  <strong>Experience:</strong>{" "}
                  {hero.experience}
                </p>
              )}


              {/* LINKS */}
              <div className="hero_links">

                {hero.social?.github && (
                  <a
                    href={hero.social.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}

                {hero.social?.netlify && (
                  <a
                    href={hero.social.netlify}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Netlify ↗
                  </a>
                )}

              </div>


              {/* BUTTONS */}
              <div className="hero_actions">

                <button
                  className="edit_btn"
                  onClick={handleEdit}
                >
                  Edit
                </button>

                <button
                  className="delete_btn"
                  onClick={handleDelete}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )}
      </div>
    </>
  );
}