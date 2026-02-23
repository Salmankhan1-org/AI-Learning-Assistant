import { useState, useRef } from "react";
import { FaCamera, FaUpload } from "react-icons/fa";

const ImageUpload = ({ preview, setPreview, setImageFile }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFiles = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setImageFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // File change via input
  const handleChange = (e) => {
    handleFiles(e.target.files[0]);
  };

  // Drag & drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFiles(file);
  };

  return (
    <div
  className={`relative w-full h-28 sm:h-32 border border-dashed rounded-lg overflow-hidden cursor-pointer transition
    ${isDragging ? "border-green-500 bg-green-50" : "border-slate-300 bg-white"}`}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={() => fileInputRef.current.click()}
>
  {/* If image is selected, show circular preview */}
  {preview && (
    <div className="absolute inset-0 flex items-center justify-center">
      <img
        src={preview}
        alt="Profile"
        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border border-slate-300"
      />
    </div>
  )}

  {/* Icons and upload text */}
  {!preview && (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-gray-500">
      <FaCamera className="text-2xl sm:text-3xl" />
      <div className="flex items-center gap-1 text-sm sm:text-base">
        <FaUpload /> Upload / Drag
      </div>
    </div>
  )}

  {/* Overlay on hover */}
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition">
    <FaCamera className="text-white text-xl mb-1" />
    <span className="text-white text-xs flex items-center gap-1">
      <FaUpload /> Upload / Drag
    </span>
  </div>

  {/* Hidden file input */}
  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    hidden
    onChange={handleChange}
  />
</div>


  );
};

export default ImageUpload;
