import React, { useState } from 'react'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../api/axios';
import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  
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
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!username) {
      toast.error('Username is required');
      return;
    }
    if (!email) {
      toast.error('Email is required');
      return;
    }
    if (!password) {
      toast.error('Password is required');
      return;
    }

    setSaving(true);

    try {
      await api.post("/auth/register", { username, email, password });
      navigate("/verify", {
        state: {
          email,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setSaving(false);
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
        disabled={saving}
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        name="email"
        onChange={handleChange}
        value={form.email}
        variant="outlined"
        disabled={saving}
      />
    
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        onChange={handleChange}
        value={form.password} 
        variant="outlined"
        disabled={saving}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  disabled={saving}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <div className='w-full flex flex-col sm:flex-row sm:justify-between gap-2 text-sm mt-[-8px]'>
        <p className='text-gray-500'>Already Register?</p>
        <NavLink to="/login">
            <p className='cursor-pointer hover:text-gray-700' >Login</p>
        </NavLink>
      </div>

      <button
        type='submit'
        disabled={saving}
        className='w-full bg-black text-white p-2 cursor-pointer disabled:cursor-wait disabled:opacity-70'
      >
        {saving ? 'Creating account...' : 'Register'}
      </button>
      <button
        onClick={googleLogin}
        type='button'
        disabled={saving}
        className='w-full flex items-center justify-center gap-2 bg-white text-black p-2 border cursor-pointer disabled:opacity-70'
      >
        <FcGoogle className='w-5 h-5' />
        Continue with Google
      </button>
    </form> 
  )
}

export default Register
