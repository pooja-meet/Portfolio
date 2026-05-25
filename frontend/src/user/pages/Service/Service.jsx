import React, { useEffect, useState } from "react";
import "./service.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Service() {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchServices = async () => {
      try {

        const res = await fetch(`${apiUrl}/service`);

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await res.json();

        setServices(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    };

    fetchServices();

  }, []);

  return (
    <div className="services-container">

      <h2>Our Services</h2>

      <div className="services-grid">

        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div className="service-card skeleton-service" key={index}>

                {/* IMAGE */}
                <div className="skeleton skeleton-service-img"></div>

                {/* TITLE */}
                <div className="skeleton skeleton-service-title"></div>

                {/* TEXT */}
                <div className="skeleton skeleton-service-text"></div>

              </div>
            ))
          : services.map((service) => (
              <div key={service._id} className="service-card">

                {/* IMAGE */}
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