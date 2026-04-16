import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css'
const apiUrl = import.meta.env.VITE_API_URL;

export default function Register() {
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
    console.log('apiUrl :', import.meta.env.VITE_API_URL)
    try {
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("User Registered Successfully ✅");
        navigate('/login'); // redirect to login
      } else {
        alert(data.message || "Registration failed ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className='r_form'>
      <form className='register_form' onSubmit={shandler}>
        <div className='register_div'>
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

          <button type="submit">Register</button>
        </div>
      </form>

      <p>
        If you already signed up, <Link to='/login'>login here</Link>
      </p>
    </div>
  );
}