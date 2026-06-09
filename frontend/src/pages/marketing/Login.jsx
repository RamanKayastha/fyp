import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex gap-2 items-center mb-2 mt-10 '>
        <p className='prata-regular text-2xl'>{currentState}</p>
        <hr className='w-8 md:w-8 h-[2px] border-none bg-gray-700' />
      </div>
      {currentState === 'Login' ? '' : (
        <TextField
          fullWidth
          label="Name"
          type="text"
          variant="outlined"
        />
      )}
      <TextField
        fullWidth
        label="Email"
        type="email"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
      />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='text-gray-500 cursor-pointer hover:text-gray-700'>Forgot Password?</p>
        {
          currentState === "Login"
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-gray-700' >Create account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-gray-700' >Login</p>
        }
      </div>
      <button type='submit' className='w-full bg-black text-white p-2'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
      <button type='button' className='w-full flex items-center justify-center gap-2 bg-white text-black p-2 border '>
        <FcGoogle className='w-5 h-5' />
        Login with Google
      </button>
    </form>
  )
}

export default Login