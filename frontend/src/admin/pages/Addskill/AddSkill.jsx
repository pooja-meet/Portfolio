import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import './AddSkill.css'
export default function AddSkill() {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(null);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [show, setShow] = useState(false)

  const [skill, setSkill] = useState({
    name: "",
    items: "",
    percent: "",
    image: null
  });

  const handleChange = (e) => {
    setSkill({ ...skill, [e.target.name]: e.target.value })
  };

  // ================= FILE CHANGE =================
  const handleFile = (e) => {
    const file = e.target.files[0];
    setSkill({ ...skill, image: file });

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };
  const fetchSkills = async () => {
    try {
      const res = await fetch(`${apiUrl}/skill/all`);
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // ================= CLEAN PREVIEW MEMORY =================
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", skill.name);
      formData.append("items", skill.items);
      formData.append("percent", skill.percent);

      if (skill.image instanceof File) {
        formData.append("image", skill.image);
      }

      const url = editId
        ? `${apiUrl}/skill/${editId}`
        : `${apiUrl}/skill`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(editId ? "Skill Updated ✅" : "Skill Saved ✅");

      setSkill({ name: "", items: "", percent: "", image: null });
      setPreview(null);
      setEditId(null);
      fetchSkills();

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (selectedSkill) => {
    setSkill({
      name: selectedSkill.name || "",
      items: selectedSkill.items || "",
      percent: selectedSkill.percent || "",
      image: null
    });
    setPreview(selectedSkill.image?.url || null)
    setEditId(selectedSkill._id); // 🔥 important
    setShow(true)

  };
  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;

    try {
      const res = await fetch(`${apiUrl}/skill/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Deleted ✅");
        fetchSkills();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error ❌");
    }
  };
  return (
    <>
      <div className="admin_form">
        <h2 className="hero_heading" onClick={() => setShow(!show)}>
          {editId ? "Edit Skill Section ✏️" : "Add Skill Section"}
          <span>
            {show ? "➖" : "➕"}
          </span>
        </h2>
        {show && (

          <form onSubmit={handleSubmit} className="hero-form">
            <div className="form-group">
              <label htmlFor="Skill Name">Skill Name</label>
              <input
                type="text"
                name="name"
                placeholder="Skill Name"
                value={skill.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Percentage</label>
              <input
                type="text"
                name="percent"
                placeholder="Percent (0-100)"
                value={skill.percent}
                onChange={handleChange}
                min="0"
                max="100"
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="">Description</label>
              <textarea
                type="text"
                name="items"
                placeholder="Items (comma separated)"
                value={skill.items}
                onChange={handleChange}
              />

            </div>
            <div className="form-group image-group">
              <label htmlFor="Skill Images">Skill Image</label>
              <input type="file" name="" id="" onChange={handleFile} accept="image/**" />
              {preview && (
                <img src={preview} alt="preview" width="150" />
              )}
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {editId ? "Update" : "Save"}
            </button>
          </form>
        )}

        <div className="askill-list">
          {!show && skills &&
            <div className="askill-grid">
              {skills.map((skill) => (
                <div key={skill._id} className="askill-card">
                  <div className="askill-left">

                    {skill.image && (
                      <img src={skill.image?.url} alt={skill.name} />
                    )}

                    <h3>{skill.name}</h3>

                    <p>{skill.items}</p>

                  </div>
                  <div className="footer">
                    <div
                      className="circle-progress"
                      style={{
                        "--progress": `${skill.percent * 3.6}deg`
                      }}
                    >
                      <div className="circle-progress-inner">
                        {skill.percent}%
                      </div>
                    </div>
                  </div>
                  <div className="skill_actions">
                    <div className="button">
                      <button className="edit_btn" onClick={() => handleEdit(skill)}>Edit</button>
                    </div>
                    <div className="button">
                      <button className="delete_btn" onClick={() => handleDelete(skill._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </>
  );
}
