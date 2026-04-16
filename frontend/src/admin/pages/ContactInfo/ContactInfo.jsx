import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ContactInfo() {
    const [loading, setLoading] = useState(false);
    const [contactList, setContactList] = useState([]);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        location: "",
        phone: "",
        email: "",
        description: ""
    });

    // ================= FETCH =================
    const fetchContacts = async () => {
        try {
            const res = await fetch(`${apiUrl}/contact-info/all`);
            const data = await res.json();

            // if backend returns single object → convert to array
            if (Array.isArray(data)) {
                setContactList(data);
            } else if (data) {
                setContactList([data]);
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const url = editId
                ? `${apiUrl}/contact-info/${editId}`
                : `${apiUrl}/contact-info`;

            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert(editId ? "Updated ✅" : "Created ✅");

            setForm({
                location: "",
                phone: "",
                email: "",
                description
            });

            setEditId(null);
            fetchContacts();

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ================= EDIT =================
    const handleEdit = (item) => {
        console.log("EDIT CLICKED:", item);
        setForm({
            location: item.location,
            phone: item.phone,
            email: item.email,
            description: item.description

        });

        setEditId(item._id);
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!confirm("Delete this contact?")) return;

        try {
            const res = await fetch(`${apiUrl}/contact-info/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (res.ok) {
                alert("Deleted ✅");
                fetchContacts();
            }
        } catch (err) {
            alert("Error ❌");
        }
    };

    return (
        <div className="admin_form">
            <h2>Contact Info</h2>

            {/* ================= FORM ================= */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="description"
                    placeholder="description"
                    value={form.description}
                    onChange={handleChange}
                    required />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {editId ? "Update" : "Save"}
                </button>
            </form>

            {/* ================= LIST ================= */}
            <div className="contact-list" >
                {/* <h2>All Contact Info</h2> */}

                <div className="skill-grid" >
                    {contactList.map((item) => (
                        <div key={item._id} className="contact-card" style={{ background: 'brown', padding: '10px' }}>

                            <h3><i className="fa-solid fa-location-dot"></i> {item.location}</h3>
                            <p><i className="fa-solid fa-phone"></i> {item.phone}</p>
                            <p> <i className="fa-solid fa-envelope"></i> {item.email}</p>
                            <p>{item.description}</p>

                            <div className="contact-footer" style={{ display: 'flex' }}>
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