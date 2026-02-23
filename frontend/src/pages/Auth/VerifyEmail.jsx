import axios from "axios";
import React, { useRef, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OTP_LENGTH = 6;

const VerifyEmail = () => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous box
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < OTP_LENGTH) newOtp.push("");

    setOtp(newOtp);

    const focusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex].focus();
  };

  const handleSubmit = async() => {
    const otpValue = otp.join("");
    try {
        
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/verify-email`,{otpValue},
        );
       
        if(response.data?.success){
            navigate("/");
            toast.success(response?.data?.message);
        }
    } catch (error) {
        
        toast.error(error?.response?.data?.message || "Internal Server Error");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl border border-slate-300 p-4 mx-2 flex flex-col gap-4 items-center">

        {/* ICON */}
        <div className="w-10 h-10 p-2 rounded-full border border-green-500 flex items-center justify-center">
          <MdOutlineEmail className="text-green-400 text-2xl" />
        </div>

        <div className="w-[80%] border border-slate-300"></div>

        <h1 className="text-sm text-center">
          In order to register yourself, verify your email using the OTP sent to your email.
        </h1>

        {/* OTP INPUTS */}
        <div className="w-full flex flex-col items-center gap-2">
          <p className="text-sm font-light">Enter your OTP</p>

          <div
            className="flex gap-2 justify-center"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 text-center text-lg font-semibold
                           border border-gray-300 rounded-xl
                           outline-none focus:border-green-500"
              />
            ))}
          </div>

          <p className="text-xs text-green-400 hover:underline cursor-pointer">
            Resend OTP?
          </p>

          <div className="w-[50%] border border-slate-300"></div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full p-3 leading-none  bg-green-600 text-white rounded-xl
                     hover:bg-green-500 transition-colors duration-500"
        >
          Submit
        </button>

        <p className="text-sm text-center">
          If you did not sign up for this account, you can ignore this email.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
