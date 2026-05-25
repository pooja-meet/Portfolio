import React, { useEffect, useState } from "react";
import "./Hero.css";
const apiUrl = import.meta.env.VITE_API_URL;

export default function Hero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHero = async () => {
    try {
      const res = await fetch(`${apiUrl}/hero`);
      const data = await res.json();
      setHero(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // SKELETON
  if (loading) {
    return (
      <section className="hero">
        <div className="hero_container">

          {/* LEFT */}
          <div className="hero_left">
            <div className="skeleton skeleton_title"></div>
            <div className="skeleton skeleton_subtitle"></div>
            <div className="skeleton skeleton_text short"></div>

            <div className="socials">
              <div className="skeleton skeleton_btn"></div>
              <div className="skeleton skeleton_btn"></div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero_right">
            <div className="skeleton skeleton_image"></div>
          </div>

        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="hero_container">

        {/* LEFT */}
        <div className="hero_left">

          <h1>{hero?.name}</h1>

          <h2>{hero?.subtitle}</h2>

          <p>{hero?.experience}</p>

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

          {hero?.image?.url &&
            <img
              src={hero.image.url}
              alt={hero.name}
              loading="lazy"
            />
          }

        </div>

      </div>
    </section>
  );
}