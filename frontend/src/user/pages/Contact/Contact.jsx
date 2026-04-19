import React, { useEffect, useState } from "react";
import "./contact.css";

const apiUrl = import.meta.env.VITE_API_URL || "";

export default function Contact() {
    const [info, setInfo] = useState(null);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);

    // ================= FETCH CONTACT INFO =================
    useEffect(() => {
        if (!apiUrl) return;

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
        setSuccess(false)
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

            if (!res.ok) {
                throw new Error(data?.message || "Something went wrong");
            }
            setSuccess(true);

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
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    return (
        <div className="main_div">
            <h1 className="main_heading">Work Together</h1>

            <div className="contact-page">
                {/* LEFT */}
                <div className="left_div">
                    <div className="left_heading">
                        <h2>Contact Information</h2>
                    </div>

                    <div className="left_container">
                        {!info ? (
                            <div className="loading_text">Loading...</div>
                        ) : (
                            <div className="info-box">
                                <p className="description">
                                    {info.description || "Feel free to reach out for any work or collaboration."}
                                </p>

                                <div className="info-item">
                                    <div className="icon"><i className="fa-solid fa-location-dot"></i></div>
                                    <div className="icon_span">{info.location}</div>
                                </div>

                                <div className="info-item">
                                    <div className="icon"><i className="fa-solid fa-phone"></i></div>
                                    <div className="icon_span">{info.phone}</div>
                                </div>

                                <div className="info-item">
                                    <div className="icon"><i className="fa-solid fa-envelope"></i></div>
                                    <div className="icon_span">{info.email}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="right_div">
                    <div className="right_heading">
                        <h2>For collaboration</h2>
                    </div>

                    <div className="right_container">
                        <div className="form_box">

                            <form className="contact-form" onSubmit={handleSubmit}>


                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    aria-label="Full Name"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    aria-label="Email Address"
                                />

                                <textarea
                                    name="message"
                                    placeholder="Your Message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    aria-label="Message"
                                />

                                <button type="submit" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                                {success && <p className="success_msg">Message sent successfully ✅</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
