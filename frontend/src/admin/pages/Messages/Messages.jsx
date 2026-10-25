import { useEffect, useState } from "react";
import "./Messages.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${apiUrl}/contact-msg`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || data.message || "Failed to fetch messages");
      }

      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError(err.message || "Unable to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Delete message
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      setDeletingId(id);

      const res = await fetch(`${apiUrl}/contact-msg/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || data.message || "Failed to delete message");
      }

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Delete message error:", err);
      alert(err.message || "Unable to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-heading">
        <div>
          <h2>Messages</h2>
          <p>Manage messages received from your portfolio.</p>
        </div>

        <span className="messages-count">
          {messages.length} {messages.length === 1 ? "Message" : "Messages"}
        </span>
      </div>

      {loading && (
        <div className="messages-state">
          <span className="messages-spinner" />
          <p>Loading messages...</p>
        </div>
      )}

      {!loading && error && (
        <div className="messages-state messages-error">
          <p>{error}</p>
          <button type="button" onClick={fetchMessages}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div className="messages-state">
          <span className="messages-empty-icon">✉</span>
          <h3>No messages yet</h3>
          <p>Messages submitted through your contact form will appear here.</p>
        </div>
      )}

      {!loading && !error && messages.length > 0 && (
        <div className="messages-grid">
          {messages.map((msg) => (
            <article key={msg._id} className="message-card">
              <div className="message-card-header">
                <div className="message-avatar">
                  {(msg.name || "?").charAt(0).toUpperCase()}
                </div>

                <div className="message-sender">
                  <h3>{msg.name}</h3>
                  <a href={`mailto:${msg.email}`}>{msg.email}</a>
                </div>
              </div>

              <div className="message-content">
                <span className="message-label">Message</span>
                <p>{msg.message}</p>
              </div>

              <div className="message-card-footer">
                <button
                  type="button"
                  className="message-delete-btn"
                  onClick={() => handleDelete(msg._id)}
                  disabled={deletingId === msg._id}
                >
                  {deletingId === msg._id ? "Deleting..." : "Delete Message"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}