import React, { useEffect, useState } from "react";
import './addhero.css'
const apiUrl = import.meta.env.VITE_API_URL;

export default function AddHero() {
  const [loading, setLoading] = useState(false);
  const [hero, setHero] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);

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

      // ❌ REMOVE THIS LINE (VERY IMPORTANT)
      setEditMode(false);

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
    <div className="admin_form">
      <h2>{editMode ? "Edit Hero ✏️" : "Add Hero"}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="subtitle"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={form.experience}
          onChange={handleChange}
        />

        <input type="file" accept="image/*" onChange={handleFile} />

        {preview && <img src={preview} width="150" alt="preview" />}

        <input
          name="netlify"
          placeholder="Netlify"
          value={form.netlify}
          onChange={handleChange}
        />

        <input
          name="github"
          placeholder="GitHub"
          value={form.github}
          onChange={handleChange}
        />

        <button disabled={loading}>
          {loading ? "Saving..." : editMode ? "Update" : "Create"}
        </button>
      </form>

      {/* DISPLAY */}
      {/* DISPLAY */}
      {hero && (
        <div className="hero_preview">
          <h3>{hero.name}</h3>
          <p>{hero.subtitle}</p>
          <p>{hero.description}</p>
          <p>{hero.experience} years</p>

          {/* IMAGE */}
          {hero.image?.url && (
            <img src={hero.image.url} width="150" alt="hero" />
          )}

          {/* 🔗 LINKS SECTION */}
          <div className="hero_links">
            {hero.social?.github && (
              <p>
                GitHub:{" "}
                <a href={hero.social.github} target="_blank" rel="noreferrer">
                  click here
                </a>
              </p>
            )}

            {hero.social?.netlify && (
              <p>
                Netlify:{" "}
                <a href={hero.social.netlify} target="_blank" rel="noreferrer">
                  click here
                </a>
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}