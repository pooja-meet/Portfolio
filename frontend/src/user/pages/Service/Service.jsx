import React, { useEffect, useState } from "react";
import "./service.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Service() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${apiUrl}/service`);
        if (!res.ok) throw new Error("Failed to fetch services");

        const data = await res.json();
        setServices(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="services-container">
      <h2>Our Services</h2>

      {services.length === 0 && <p>No services available.</p>}

      <div className="services-grid">

        {services.map((service) => (
          <div key={service._id} className="service-card">

            {/* IMAGE FIXED (HERO STYLE) */}
            {service.image?.url && (
              <img
                src={service.image.url}
                alt={service.title}
              />
            )}

            <h3>{service.title}</h3>
            <p>{service.description}</p>

          </div>
        ))}

      </div>
    </div>
  );
}
