import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import api from '../../api/axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      navigate("/verify", {
        state: {
          email: form.email,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex gap-2 items-center mb-2 mt-10 '>
        <p className='prata-regular text-2xl'>Register</p>
        <hr className='w-8 md:w-8 h-[2px] border-none bg-gray-700' />
      </div>
      <TextField
        fullWidth
        label="Username"
        type="text"
        name="username"
        onChange={handleChange}
        value={form.username}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        name="email"
        onChange={handleChange}
        value={form.email}
        variant="outlined"
      />
    
      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        onChange={handleChange}
        value={form.password} 
        variant="outlined"
      />

      <div className='w-full flex flex-col sm:flex-row sm:justify-between gap-2 text-sm mt-[-8px]'>
        <p className='text-gray-500 cursor-pointer hover:text-gray-700'>Already Register?</p>
        <NavLink to="/login">
            <p className='cursor-pointer hover:text-gray-700' >Login</p>
        </NavLink>
      </div>

      <button type='submit' className='w-full bg-black text-white p-2'>Register</button>
      <button onClick={googleLogin} type='button' className='w-full flex items-center justify-center gap-2 bg-white text-black p-2 border '>
        <FcGoogle className='w-5 h-5' />
        Continue with Google
      </button>
    </form> 
  )
}

export default Register