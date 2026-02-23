import React from 'react'
import { FaRegUser } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { BiLogIn } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { clearUser } from '../features/user/authSlice';
import { Link } from 'react-router-dom';

import logo from '../assets/company_logo.svg';

const Header = ({onMenuClick}) => {
    const user = useSelector(state=>state?.auth?.user);
    const dispatch = useDispatch();
    // Handle Logout
    const handleLogout = async()=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/logout`,{
                withCredentials : true
            })
            if(response?.data?.success){
                dispatch(clearUser());
                toast.success(response?.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in Logout")
        }
    }
  return (
    <header className="h-12 sticky top-0 z-50 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900   shadow">
        <div className='container mx-auto h-full flex items-center  justify-between px-2 '>
            {/* Company Logo */}
            <div className='h-full flex items-center gap-2'>
                <MdMenu onClick={onMenuClick} className='size-5 flex md:hidden cursor-pointer'/>
                <img src={logo} alt="Mentor Mind Logo" className='h-8 md:h-10'/>
            </div>
            <div className='flex items-center gap-2 md:gap-4'>
                <div className='w-8 h-8 ring-2 ring-orange-500 rounded-full border border-slate-300 flex items-center justify-center'>
                    {user && user?.profileImage ? <img src={user?.profileImage?.imageUrl} alt="User Image" className='w-full h-full rounded-full'/>:<FaRegUser/>}
                </div>
                {user ? 
                <button onClick={handleLogout} className="p-2 flex gap-1 leading-none text-[14px] text-slate-200 bg-white/10 hover:bg-white/20 cursor-pointer transition-colors duration-300  rounded-xl">
                    <span className="size-3"><TbLogout2/></span>
                    <span>Logout</span>
                </button>
                :
                <Link to={'/user/auth/login'} className="p-2 flex gap-1 leading-none text-[14px] text-slate-200 bg-white/10 hover:bg-white/20 cursor-pointer transition-colors duration-300  rounded-xl">
                    <span className="size-3"><BiLogIn/></span>
                    <span>Login</span>
                </Link>
                }
            </div>
        </div>

    </header>
  )
}

export default Header