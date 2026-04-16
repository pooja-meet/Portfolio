import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${apiUrl}/contact-msg`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setMessages(data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      const res = await fetch(`${apiUrl}/contact-msg/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Deleted ✅");
      fetchMessages();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin_form">
      <h2>📩 Messages</h2>

      {loading && <p>Loading...</p>}

      {!loading && messages.length === 0 && (
        <p>No messages found 😐</p>
      )}

      <div className="skill-grid">

        {messages.map((msg) => (
          <div key={msg._id} className="skill-card">

            <h3>{msg.name}</h3>
            <p>📧 {msg.email}</p>

            <div style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "8px",
              marginTop: "10px"
            }}>
              <p>{msg.message}</p>
            </div>

            <div className="skill-footer">
              <button
                type="button"
                onClick={() => handleDelete(msg._id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}