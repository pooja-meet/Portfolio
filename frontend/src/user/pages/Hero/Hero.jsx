import React, { useEffect, useState } from "react";
import "./Hero.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Hero() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch(`${apiUrl}/hero`);
      const data = await res.json();
      setHero(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="hero">
      <div className="hero_container">

        {/* LEFT */}
        <div className="hero_left">

          <h1>{hero?.name}</h1>

          {/* subtitle */}
          <h2>{hero?.subtitle}</h2>
          <p>{hero?.description}</p>
          <p>{hero?.experience}+ Years Experience</p>

          {/* SOCIAL LINKS */}
          <div className="socials">

            {hero?.social?.github && (
              <a href={hero.social.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}

            {hero?.social?.netlify && (
              <a href={hero.social.netlify} target="_blank" rel="noreferrer">
                Netlify
              </a>
            )}

          </div>

        </div>

        {/* RIGHT */}
        <div className="hero_right">

          {/* IMAGE FIXED */}
          {hero?.image?.url ? (
            <img
              src={hero.image.url}
              alt={hero.name}
            />
          ) : (
            <img src="/default.png" alt="default" />
          )}

        </div>

      </div>
    </section>
  );
}
