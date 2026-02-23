import React from 'react'
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TbLockPassword } from 'react-icons/tb';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordSchema = z.object({
    newPassword : z.string().min(6,"password must have 6 characters"),
    confirmPassword : z.string().min(6,"password must have 6 characters")
});

const ResetPassword = () => {
    const {token} = useParams();
    const navigate = useNavigate();
    const [showNewPassword, setShowNewPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState("");

    const 
    {   register, 
        handleSubmit, 
        formState:{errors,isSubmitting}}
     = useForm({
        resolver : zodResolver(PasswordSchema)
    })

    const onSubmit = async(data)=>{
        if(data?.newPassword !== data?.confirmPassword){
            return toast.error("New and Confirm Passwords are not equal");
        }
       try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/reset-password/${token}`,data,{
            headers:{
                'Content-Type':'application/json'
            }
        }); 
        if(response?.data.success){
            toast.success(response?.data.message);
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
            <div className='flex flex-col items-center'>
                <h1 className='text-3xl font-semibold'>Reset Your Password?</h1>
                <p className='text-sm text-gray-400'>Choose a new password below</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-4'>
                <div className="w-full">
                <label className="text-black font-semibold text-sm">
                    New Password
                </label>
                <div className="flex items-center w-full h-10 border border-gray-300 rounded-xl">
                    <TbLockPassword className="px-0.5 text-slate-400 text-2xl"/>
                    <input
                    type={showNewPassword ? "text":"password"}
                    placeholder="Enter your password"
                    className="w-full border-none outline-none text-sm"
                    {...register("newPassword")}
                />
                {showNewPassword ? 
                <FaEyeSlash onClick={()=>setShowNewPassword(false)} className=" w-5 h-5 mx-2" />
                :<FaEye onClick={()=>setShowNewPassword(true)} className=" w-5 h-5 mx-2" />}
                
                </div>
                
                    {errors.newPassword && (
                    <p className="text-red-500 text-xs ">
                    {errors.newPassword.message}
                    </p>
                )}
                    
            </div>
            <div className="w-full">
                <label className="text-black font-semibold text-sm">
                    Confirm Password
                </label>
                <div className="flex items-center w-full h-10 border border-gray-300 rounded-xl">
                    <TbLockPassword className="px-0.5 text-slate-400 text-2xl"/>
                    <input
                    type={showConfirmPassword ? "text":"password"}
                    placeholder="confirm your password"
                    className="w-full border-none outline-none text-sm"
                    {...register("confirmPassword")}
                />
                {showConfirmPassword ? 
                <FaEyeSlash onClick={()=>setShowConfirmPassword(false)} className=" w-5 h-5 mx-2" />
                :<FaEye onClick={()=>setShowConfirmPassword(true)} className=" w-5 h-5 mx-2" />}
                
                </div>
                
                    {errors.confirmPassword && (
                    <p className="text-red-500 text-xs ">
                    {errors.confirmPassword.message}
                    </p>
                )}
                    
            </div>
            <button type='submit' disabled={isSubmitting}  className='w-full p-3 leading-none rounded-xl bg-green-600 hover:bg-green-500 transition-colors duration-500 text-white cursor-pointer'>Reset Password</button>
            </form>

            <button onClick={()=>navigate('/user/auth/login')} className='flex items-center gap-1 hover:underline cursor-pointer'>
                <IoMdArrowRoundBack className='text-xl'/>
                Back To Login
            </button>
        </div>
    </div>
  )
}

export default ResetPassword