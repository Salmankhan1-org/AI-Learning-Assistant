import React from 'react'
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = async()=>{
        if(email.length<5) return;
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/forgot-password`,{email});
            if(response?.data.success){
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Internal Server Error");
        }
    }
  return (
    <div className='w-screen h-screen flex items-center bg-white justify-center'>
        <div className='w-full max-w-md border border-gray-300 shadow-xl rounded-xl bg-white flex flex-col gap-4 items-center p-4 '>
            <div className='w-14 h-14 p-2 rounded-full border border-green-400 flex items-center justify-center'>
                <RiLockPasswordLine className='text-green-400 text-2xl'/>
            </div>
            <div className='flex flex-col '>
                <h1 className='text-3xl font-semibold'>Forgot Your Password?</h1>
                <p className='text-sm text-gray-400'>Send us email so that we can send password reset link</p>
            </div>

            <div className='w-full gap-1 mt-4'>
                <label htmlFor='email' className='text-sm font-semibold'>Email</label>
                <div className='w-full h-10 border border-gray-300 rounded-xl flex items-center'>
                    <MdOutlineEmail className='px-1 text-gray-400 text-3xl'/>
                    <input 
                    type="email" 
                    id='email'
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder='e.g ericjohnson@gmail.com'
                    className='ml-1 w-full h-full border-none outline-none'
                    />
                </div>
            </div>
            <button type='submit' onClick={handleSubmit} className='w-full p-3 leading-none  rounded-xl bg-green-600 hover:bg-green-500 transition-colors duration-500 text-white cursor-pointer'>Send Email</button>

            <button onClick={()=>navigate('/user/auth/login')} className='flex items-center gap-1 hover:underline cursor-pointer'>
                <IoMdArrowRoundBack className='text-xl'/>
                Back To Login
            </button>
        </div>
    </div>
  )
}

export default ForgotPassword