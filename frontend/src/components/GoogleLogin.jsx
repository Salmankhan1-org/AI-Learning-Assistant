import React from "react";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../helper/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/authSlice";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      const payload = {
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/google-login`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.success) {
        dispatch(setUser(response?.data.user));
        toast.success(response.data.message);
        if(response?.data?.user?.role === 'admin'){
          navigate("/user/admin/dashboard");
        }else{
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center shadow-lg gap-3 border border-slate-300 cursor-pointer rounded-lg py-2 hover:bg-slate-50 transition"
    >
      <FcGoogle size={20} />
      Continue with Google
    </button>
  );
};

export default GoogleAuth;
