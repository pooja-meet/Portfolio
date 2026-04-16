import React, { useEffect, useState } from "react";
import "./contact.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Contact() {
    const [info, setInfo] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);

    // ================= FETCH CONTACT INFO =================
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await fetch(`${apiUrl}/contact-info`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setInfo(data[0]); // 👈 take first object
                } else {
                    setInfo(data);
                }
            } catch (err) {
                console.log("Contact info error:", err);
            }
        };

        fetchInfo();
    }, []);

    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================= SUBMIT MESSAGE =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch(`${apiUrl}/contact-msg`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            alert("Message sent successfully ✅");

            setForm({
                name: "",
                email: "",
                message: ""
            });

        } catch (err) {
            alert(err.message || "Error sending message ❌");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="main_div">
            <div className="main_heading"><h1>Work Together</h1></div>
            <div className="contact-page">
                {/* ================= LEFT SIDE ================= */}
                <div className="left_div">

                    <div className="left_heading">
                        <h2>Contact Information</h2>
                    </div>

                    <div className="left_container">
                        {!info ? (
                            <p className="loading_text">Loading contact info...</p>
                        ) : (
                            <>

                                <div className="info-box">
                                    <p className="description">
                                        {info.description || "Feel free to reach out for any work or collaboration."}
                                    </p>
                                    <div className="info-item">
                                        <div className="icon">
                                            <i className={`fa-solid fa-location-dot`}></i>
                                        </div>
                                        <div className="icon_span">
                                            <span>{info.location}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="icon">
                                            <i className={`fa-solid fa-phone`}></i>
                                        </div>
                                        <div className="icon_span">
                                            <span>{info.phone}</span>
                                        </div>
                                    </div> <div className="info-item">
                                        <div className="icon">
                                            <i className={`fa-solid fa-envelope`}></i>
                                        </div>
                                        <div className="icon_span">
                                            <span>{info.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
                <div className="right_div">
                    <div className="right_heading"><h2>For collebration</h2></div>
                    <div className="msg_container">
                        {/* ================= RIGHT SIDE ================= */}
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                name="message"
                                placeholder="Your Message"
                                value={form.message}
                                onChange={handleChange}
                                required
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send Message"}
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}