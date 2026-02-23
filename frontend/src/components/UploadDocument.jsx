import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdClose } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { uploadDocumentSchema } from "../validationSchemas/document.Schema";
import { toast } from "react-toastify";
import api from "../helper/axiosAPI";

const UploadDocument = ({ onClose, fetchMyDocuments }) => {
  const fileRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(uploadDocumentSchema)
  });

  const file = watch("file");

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setValue("file", selectedFile, { shouldValidate: true });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const getFileIcon = () => {
    if (!file) return null;
    if (file.type.includes("pdf")) return <FaFilePdf className="text-red-500 text-2xl" />;
    if (file.type.includes("word")) return <FaFileWord className="text-blue-500 text-2xl" />;
    return <IoDocumentTextOutline className="text-slate-500 text-2xl" />;
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("document", data.file);


 
    try {
        const response = await api.post('/document/new',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            },
            withCredentials : true
        });

        if(response?.data?.success){
            fetchMyDocuments();
            toast.success(response.data.message);
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Error in Upload Document");
    }

    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/25 z-60 flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-xl p-3 space-y-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-slate-700 text-sm md:text-base">Upload Document</h1>
          <button type="button" onClick={onClose}>
            <MdClose className="text-2xl text-slate-500" />
          </button>
        </div>

        <p className="text-slate-500 text-center text-xs">
          Upload documents to summarize, generate quizzes & flashcards
        </p>

        {/* Document title */}
        <div>
          <label className="text-sm">Document Title</label>
          <div className="flex items-center h-8 border border-gray-300 p-2 rounded">
            <IoDocumentTextOutline className="text-gray-400 text-xl" />
            <input
              {...register("title")}
              placeholder="Enter document title"
              className="w-full outline-none text-sm ml-1"
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Upload box */}
        <div>
          <label className="text-sm">Document (PDF Files Only) </label>
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`w-full h-12 border border-dashed rounded flex items-center justify-center gap-2 cursor-pointer transition
              ${isDragging ? "border-green-500 bg-green-50" : "border-slate-300"}
            `}
          >
            <AiOutlineCloudUpload className="text-slate-400 text-xl" />
            <p className="text-sm text-slate-400">Click or drag document here</p>
            <input
              type="file"
              hidden
              ref={fileRef}
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {errors.file && (
            <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
          )}
        </div>

        {/* Preview */}
        {file && (
          <div className="flex items-center gap-3 p-2 border border-gray-300 rounded bg-slate-50">
            {getFileIcon()}
            <div className="flex-1">
              <p className="text-sm truncate">{file.name}</p>
              <p className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <MdClose
              onClick={() => setValue("file", null)}
              className="cursor-pointer text-slate-400 hover:text-red-500"
            />
          </div>
        )}

        {/* Submit */}
        <button
          disabled={isSubmitting}
          className={`w-full p-2 text-sm rounded text-white flex justify-center gap-2 cursor-pointer transition-colors duration-300
            ${isSubmitting ? "bg-orange-400" : "bg-orange-600 hover:bg-orange-500"}
          `}
        >
          {isSubmitting ? (
            <>
              <ClipLoader size={18} color="#fff" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadDocument;
