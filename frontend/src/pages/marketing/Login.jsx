import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import api from '../../api/axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { homePathForRole } from '../../utils/roles';


const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, userDTO } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(homePathForRole(userDTO?.role), { replace: true });
    }
  }, [isAuthenticated, userDTO, navigate]);
  
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
      const response = await api.post("/auth/login", form);
      const userData = response.data.userDTO;
      login(response.data.token, userData);
      navigate(homePathForRole(userData?.role));
    } catch (error) {
      console.log(error);
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex gap-2 items-center mb-2 mt-10 '>
        <p className='prata-regular text-2xl'>Login</p>
        <hr className='w-8 md:w-8 h-[2px] border-none bg-gray-700' />
      </div>
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

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='text-gray-500 cursor-pointer hover:text-gray-700'>Forgot Password?</p>
        <NavLink to="/register">
          <p className='cursor-pointer hover:text-gray-700' >Create account</p>
        </NavLink>
      </div>

      <button type='submit' className='w-full bg-black text-white p-2'>Login</button>
      <button onClick={googleLogin} type='button' className='w-full flex items-center justify-center gap-2 bg-white text-black p-2 border '>
        <FcGoogle className='w-5 h-5' />
        Login with Google
      </button>
    </form> 
  )
}

export default Login