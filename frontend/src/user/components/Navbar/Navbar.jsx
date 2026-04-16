import { Link } from 'react-router-dom'
import './navbar.css'
import { useState } from 'react';
export default function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <nav className='navbar'>
                <div className='navlogo'><h2>Portfolio</h2></div>
                <div className="menu-toggle" onClick={() => setOpen(!open)}>
                    {open ? "✖" : "☰"}
                </div>
                <div className={`list_Container ${open ? "active" : ""}`}>
                    <ul className='list'><li><Link to="/">Home</Link></li>
                        <li><Link to="/skill" >Skill</Link></li>
                        <li><Link to="/service">Service</Link></li>
                        <li><Link to="/project">Project</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
            </nav>
        </>
    )
}