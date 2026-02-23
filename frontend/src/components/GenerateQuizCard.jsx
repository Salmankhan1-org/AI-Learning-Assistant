import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { LuFileQuestion } from "react-icons/lu";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import api from '../helper/axiosAPI';

const GenerateQuizCard = ({documentId, onClose, fetchAllQuizzes}) => {
    const [questions, setQuestions] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerateQuiz = async()=>{
        const question = Number(questions);
        try {
            setLoading(true);
            const response = await api.post(`/quiz/${documentId}/new`,{questions:question});

            if(response?.data?.success){
                onClose();
                fetchAllQuizzes();
                toast.success(response?.data?.message);
            }
            
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in generating quiz");
        }finally{
            setLoading(false);
        }
    }
  return (
    <div className="absolute inset-0 bg-black/25 z-60 flex justify-center items-center" >
        <div className='w-full max-w-md bg-white p-2 flex flex-col space-y-4 rounded-xl'>
            <div className='w-full flex justify-between'>
                <h1 className="text-slate-700 text-sm md:text-base">Upload Document</h1>
                <button type="button" onClick={onClose} className='cursor-pointer'>
                <MdClose className="text-2xl text-slate-500 hover:scale-110 transition-all duration-300"/>
                </button>
            </div>

            <div className="w-full">
                <label className=" text-sm">
                Number of Questions
                </label>
                <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                    <LuFileQuestion className="px-1 text-gray-400 text-2xl"/>
                    <input
                    type="text"
                    value={questions}
                    onChange={(e)=>setQuestions(e.target.value)}
                    placeholder="Enter your Name"
                    className=" w-full border-none outline-none text-sm"
                    />
                </div>
            </div>

            <button
                    onClick={handleGenerateQuiz}
                    disabled={loading}
                    className={`leading-none ml-auto p-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded text-sm cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2
                        ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-400 hover:to-emerald-500"}`}
                    >
                    {loading && (
                        <ClipLoader size={16} color="#ffffff" />
                    )}

                    {loading ? "Generating..." : "Generate Quiz"}
                </button>
        </div>
    </div>
  )
}

export default GenerateQuizCard