import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Protected({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        setAuthenticated(res.ok);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Checking login...</p>;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}