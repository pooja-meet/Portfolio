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
    const [infoLoading, setInfoLoading] = useState(true); // ✅ Contact info ki loading status track karne ke liye

    // ================= FETCH CONTACT INFO =================
    useEffect(() => {
        if (!apiUrl) {
            setInfoLoading(false);
            return;
        }

        const fetchInfo = async () => {
            try {
                setInfoLoading(true);
                const res = await fetch(`${apiUrl}/contact-info`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setInfo(data[0]);
                } else {
                    setInfo(data);
                }
            } catch (err) {
                console.log("Contact info error:", err);
            } finally {
                setInfoLoading(false); // ✅ Fetch complete chahe success ho ya error
            }
        };

        fetchInfo();
    }, []);

    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSuccess(false);
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
                {/* LEFT SIDE */}
                <div className="left_div">
                    <div className="left_heading">
                        <h2>Contact Information</h2>
                    </div>

                    <div className="left_container">
                        {/* ✅ Condition 1: Agar data load ho raha hai toh Skeleton dikhao */}
                        {infoLoading ? (
                            <div className="info-box skeleton-contact-box">
                                {/* Description Skeleton lines */}
                                <div className="skeleton skeleton_contact_text"></div>
                                <div className="skeleton skeleton_contact_text short"></div>

                                {/* Icon items Skeletons */}
                                <div className="skeleton_contact_item">
                                    <div className="skeleton skeleton_contact_icon"></div>
                                    <div className="skeleton skeleton_contact_span"></div>
                                </div>

                                <div className="skeleton_contact_item">
                                    <div className="skeleton skeleton_contact_icon"></div>
                                    <div className="skeleton skeleton_contact_span med"></div>
                                </div>

                                <div className="skeleton_contact_item">
                                    <div className="skeleton skeleton_contact_icon"></div>
                                    <div className="skeleton skeleton_contact_span long"></div>
                                </div>
                            </div>
                        ) : (
                            /* Condition 2: Data load hone ke baad real info */
                            info && (
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
                            )
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE (Form remains active so user can type instantly) */}
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