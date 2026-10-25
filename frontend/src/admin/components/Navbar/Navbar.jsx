import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handler = () => {
    setOpen(false);
  };

  const logOut = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const res = await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      setOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="admin_navbar">
        <div className="admin_navlogo">
          <h2>Portfolio</h2>
        </div>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? '✖' : '☰'}
        </button>

        <div
          className={`admin_list_Container ${open ? 'active' : ''}`}
        >
          <ul className="admin_list">
            <li>
              <NavLink to="/admin" onClick={handler}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/addskill" onClick={handler}>
                Skill
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/addservice" onClick={handler}>
                Service
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/addproject" onClick={handler}>
                Project
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/messages" onClick={handler}>
                Messages
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/contactinfo" onClick={handler}>
                Contact Info
              </NavLink>
            </li>
          </ul>

          <button
            type="button"
            className="admin_button"
            onClick={logOut}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      <Outlet />
    </>
  );
}