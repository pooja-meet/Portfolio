import React, { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AddService() {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [service, setService] = useState({
    title: "",
    description: "",
    image: null,
  });

  // ================= INPUT =================
  const handleChange = (e) => {
    setService((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ================= FILE =================
  const handleFile = (e) => {
    const file = e.target.files[0];

    setService((prev) => ({
      ...prev,
      image: file
    }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= FETCH =================
  const fetchService = async () => {
    try {
      const res = await fetch(`${apiUrl}/service/all`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchService();
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
      formData.append("title", service.title);
      formData.append("description", service.description);

      if (service.image instanceof File) {
        formData.append("image", service.image);
      }

      const url = editingId
        ? `${apiUrl}/service/${editingId}`
        : `${apiUrl}/service`;

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

      // RESET
      setService({
        title: "",
        description: "",
        image: null
      });

      setPreview(null);
      setEditingId(null);

      fetchService();

    } catch (err) {
      alert(err.message || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setService({
      title: item.title || "",
      description: item.description || "",
      image: null
    });

    setPreview(item.image?.url || null);
    setEditingId(item._id);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      const res = await fetch(`${apiUrl}/service/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Deleted ✅");
        fetchService();
      } else {
        alert(data.message || "Failed ❌");
      }
    } catch (err) {
      alert("Error ❌");
    }
  };

  return (
    <div className="admin_form">

      <h2>{editingId ? "Edit Service ✏️" : "Add Service ➕"}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Service Title"
          value={service.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Service Description"
          value={service.description}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
        />

        {/* PREVIEW */}
        {preview && (
          <img src={preview} width="120" alt="preview" />
        )}

        <button disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* LIST */}
      <div className="service-list">
        <h2>All Services</h2>

        <div className="service-grid">

          {services.map((item) => (
            <div key={item._id} className="service-card">

              {item.image?.url && (
                <img src={item.image.url} alt={item.title} width="100%" />
              )}

              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <div className="btns">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}