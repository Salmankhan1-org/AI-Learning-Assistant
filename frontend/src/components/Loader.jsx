import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({
  size = 40,
  color = "#2563eb", // blue-600
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex items-center justify-center bg-white  ${
        fullScreen ? "h-screen w-screen" : "w-full h-full rounded-xl"
      }`}
    >
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default Loader;
