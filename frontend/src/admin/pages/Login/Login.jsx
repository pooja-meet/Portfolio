import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'
const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    password: ''
  });

  const handler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const shandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiUrl}/auth/signin`, {
        method: 'POST', // ✅ FIXED
        headers: {
          "Content-Type": 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(user)
      });
      const data = await res.json();

      if (res.ok) {
        alert("Login Successful ✅");
        navigate('/admin');
      } else {
        alert(data.msg || "Login failed ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className='form'>
      <form className='login_form' onSubmit={shandler}>
        <div className='login_div'>
          <label>Name</label>
          <input
            type="text"
            name="username"
            value={user.username}
            required
            onChange={handler}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            required
            onChange={handler}
          />

          <button type="submit">Login</button>
        </div>
      </form>

      <p>
        <Link to='/'>Project here</Link>
      </p>
    </div>
  );
}
