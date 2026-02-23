import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.jpeg';
import { toast } from "react-toastify";
import axios from "axios";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import {ClipLoader} from 'react-spinners';
import { FaRegUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import authLogo from '../../assets/authLogo.jpeg'
import ReCAPTCHA from "react-google-recaptcha";
import GoogleAuth from "../../components/GoogleLogin";
import { SignupSchema } from "../../validationSchemas/user.signup.schema";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const captchaRef = useRef(null);
  const [captchaVerified , setCaptchaVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(SignupSchema)
  });


  const onSubmit = async (data) => {
     const captchaToken = captchaRef.current?.getValue();
    
      if (!captchaToken) {
        toast.error("Please verify captcha");
        return;
      }

    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/signup`,{...data,captchaToken},{
            headers:{
                'Content-Type':'application/json'
            }
        });
      
        if(response.data?.success){
            navigate('/user/auth/verify-email');
            toast.success(response.data?.message);
        }
    }catch(error){
        toast.error(`${error?.response?.data?.message || 'Internal Server Error'} `);
       
    }

  }

  return (
    <div className="bg-[#dddbdb] w-screen h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full bg-white shadow-xl rounded-2xl flex"
      >
    
        <div className="md:w-[60%] hidden md:flex flex-col items-center justify-center ">
          <div className=" h-[50%]">
            <img src={authLogo} alt="Hero Image " className="w-full h-full mix-blend-multiply"/>
          </div>
        </div>
        <div className="md:w-[40%] w-full h-full  flex items-center justify-center ">
          <div className="md:w-[80%] w-full flex flex-col items-center p-6 space-y-3">
            <div className="text-center">
            <h1 className="text-black/70 font-semibold text-xl">
              Create your account
            </h1>
          </div>

          {/* NAME */}
          <div className="w-full">
            <label className="text-black font-semibold text-sm">
              Name
            </label>
            <div className="flex w-full items-center h-8 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500">
                <FaRegUser className="px-1 text-gray-400 text-2xl"/>
                <input
              type="text"
              placeholder="Enter your Name"
              className=" w-full border-none outline-none text-sm"
              {...register("name")}
            />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs ">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="w-full">
            <label className="text-black font-semibold text-sm">
              Email
            </label>
            <div className="flex w-full items-center h-8 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500">
                <MdOutlineEmail className="px-0.5 text-gray-400 text-2xl"/>
                <input
              type="email"
              placeholder="Enter your email"
              className=" w-full border-none outline-none text-sm"
              {...register("email")}
            />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs ">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="w-full">
            <label className="text-black font-semibold text-sm">
                Password
            </label>
            <div className="flex items-center w-full h-8 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500">
                <TbLockPassword className="px-0.5 text-slate-400 text-2xl"/>
                <input
                type={showPassword ? "text":"password"}
                placeholder="Enter your password"
                className="w-full border-none outline-none text-sm"
                {...register("password")}
            />
            {showPassword ? 
            <FaEyeSlash onClick={()=>setShowPassword(false)} className=" w-5 h-5 mx-2" />
            :<FaEye onClick={()=>setShowPassword(true)} className=" w-5 h-5 mx-2" />}
            
            </div>
            
            {errors.password && (
            <p className="text-red-500 text-xs ">
            {errors.password.message}
            </p>
            )}
            
            </div>

            <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                ref={captchaRef}
                onChange={()=>setCaptchaVerified(true)}
                onExpired={()=>setCaptchaVerified(false)}
            />
        
          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting || !captchaVerified}
            className="w-full bg-blue-600 shadow-lg leading-none text-white text-sm  p-2.5 rounded hover:bg-blue-500 transition-colors duration-500 cursor-pointer"
          >
            {isSubmitting ? <>
            <ClipLoader color="#fff" size={18} />
            <span>Signing in...</span>
            </>
            : "Signup"}
          </button>

          <div className="w-[80%] flex items-center gap-2">
            <div className="w-[25%] border-b border-slate-300"></div>
            <div className="w-[50%] text-slate-500 text-[14px] flex items-center justify-center">Or Continue</div>
            <div className="w-[25%] border-b border-slate-300"></div>
          </div>

          <GoogleAuth/>

          

          <p className="text-xs">
            Already have an account?{" "}
            <span
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/user/auth/login")}
            >
              Login
            </span>
          </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
