import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import {ClipLoader} from 'react-spinners';
import GoogleLogin from "../../components/GoogleLogin";
import authLogo from '../../assets/authLogo.jpeg'
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import companyLogo from '../../assets/company_logo.svg'
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../features/user/authThunk";
import { LoginSchema } from "../../validationSchemas/user.login.schema";
import { setUser } from "../../features/user/authSlice";



const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const captchaRef = useRef(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const dispatch = useDispatch();


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(LoginSchema)
  });

  const onSubmit = async (data) => {
  const captchaToken = captchaRef.current?.getValue();


  if (!captchaToken) {
    toast.error("Please verify captcha");
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/users/login`,
      {
        ...data,
        captchaToken
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    );

    if (response.data?.success) {
        dispatch(setUser(response?.data?.user));
       captchaRef.current.reset();
        if(response?.data?.user?.role === 'admin'){
          navigate("/user/admin/dashboard");
        }else{
          navigate("/user/dashboard");
        }
        toast.success(response.data?.message);
    }
  } catch (error) {
    captchaRef.current.reset();
    toast.error(
      error?.response?.data?.message || "Internal Server Error"
    );
  }
};


  return (
    <div className="bg-white w-screen h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full bg-white shadow-xl rounded-2xl flex"
      >

        <div className="md:w-[60%] hidden md:flex flex-col items-center justify-center ">
          
        
            {/* <img src={companyLogo} alt="Company Logo" className="h-10"/> */}
      
          <div className=" h-[50%]">
            <img src={authLogo} alt="Hero Image " className="w-full h-full mix-blend-multiply"/>
          </div>
        </div>
    
        <div className="md:w-[40%] w-full h-full  flex items-center justify-center ">
        
          <div className="md:w-[80%] w-full flex flex-col items-center py-6 px-6 gap-2">
            <div className="text-center">
                {/* <img src={companyLogo} alt="Company Logo" className="h-14 inverted-colors:text-orange-500 md:hidden flex"/> */}
            <h1 className="text-black/70 font-semibold text-xl">
              Login to your account
            </h1>
            
          </div>

          {/* EMAIL */}
          <div className="w-full space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <MdOutlineEmail  className="text-gray-400 text-xl mr-2"/>
                <input
              type="email"
              placeholder="Enter your email"
              className="w-full outline-none text-sm bg-transparent"
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
          <div className="w-full space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <TbLockPassword className="text-gray-400 text-xl mr-2"/>
                <input
              type={showPassword ? "text":"password"}
              placeholder="Enter your password"
              className="w-full outline-none text-sm bg-transparent"
              {...register("password")}
            />
            {showPassword ? 
            <FaEyeSlash onClick={()=>setShowPassword(false)} className=" w-5 h-5 mx-2" />
            :<FaEye onClick={()=>setShowPassword(true)} className=" w-5 h-5 mx-2" />}
            
            </div>
            <div className="flex w-full justify-between">
                {errors.password && (
                <p className="text-red-500 text-xs ">
                {errors.password.message}
                </p>
            )}
                <p onClick={()=>navigate("/user/auth/forgot-password")} className="ml-auto text-xs w-fit text-red-500 cursor-pointer hover:underline ">
            Forgot Password?
            </p>
            
            </div>
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
            className="w-full bg-blue-600 shadow-lg text-sm mt-1 text-white leading-none p-2.5 rounded
                        hover:bg-blue-500 transition duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
            {isSubmitting ? (
                <>
                <ClipLoader color="#ffffff" size={18} />
                <span>Logging in...</span>
                </>
            ) : (
                "Login"
            )}
            </button>


          <div className="w-[80%] flex items-center gap-2">
            <div className="w-[25%] border-b border-slate-300"></div>
            <div className="w-[50%] text-slate-500 text-[14px] flex items-center justify-center">Or Continue</div>
            <div className="w-[25%] border-b border-slate-300"></div>
          </div>

          {/* GOOGLE */}
          <GoogleLogin/>

          <p className="text-xs">
            Don't have an account?{" "}
            <span
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/user/auth/signup")}
            >
              Signup
            </span>
          </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
