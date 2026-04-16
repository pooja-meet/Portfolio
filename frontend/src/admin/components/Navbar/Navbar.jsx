import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';

export default function Navbar() {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Close menu on link click
  const handler = () => {
    setOpen(false);
  };

  // ✅ Logout function (accessible everywhere)
  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <nav className='admin_navbar'>
        <div className='admin_navlogo'>
          <h2>Portfolio</h2>
        </div>

        <div className="menu-toggle" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </div>

        <div className={`admin_list_Container ${open ? "active" : ""}`}>
          <ul className='admin_list'>
            <li>
              <NavLink to="/admin" onClick={handler}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/admin/addskill" onClick={handler}>Skill</NavLink>
            </li>
            <li>
              <NavLink to="/admin/addservice" onClick={handler}>Service</NavLink>
            </li>
            <li>
              <NavLink to="/admin/addproject" onClick={handler}>Project</NavLink>
            </li>
            <li>
              <NavLink to="/admin/messages" onClick={handler}>Messages</NavLink>
            </li>
            <li>
              <NavLink to="/admin/contactinfo" onClick={handler}>Contact Info </NavLink>
            </li>
          </ul>

          {token && (
            <button className='admin_button' onClick={logOut}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
}