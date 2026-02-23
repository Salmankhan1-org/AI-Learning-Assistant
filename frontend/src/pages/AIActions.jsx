import React, { useState } from 'react'
import { LuBrain } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import { ClipLoader } from 'react-spinners';
import { useDocument } from '../helper/DocumentContext';
import { toast } from 'react-toastify';
import api from '../helper/axiosAPI';
import AIResponseCard from '../components/AIResponseCard';


const AIActions = () => {
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingExplanation, setLoadingExplanation] = useState(false);
    const [openAIResponseCard, setOpenAIResponseCard] = useState(false);
    const [aiResponse, setAIResponse] = useState({
        heading : '',
        explanation: ''
    });
    const [prompt, setPrompt] = useState('');
    const document = useDocument();

    // Summarize the document
    const handleGenerateSummary = async()=>{
        try {
            setLoadingSummary(true);
            const response = await api.get(`/documents/${document._id}/summary`);
            if(response?.data?.success){
                setAIResponse({
                    heading : `Summary of "${document?.title}" `,
                    explanation : response.data.data
                });
                setOpenAIResponseCard(true);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message||"Error in Summarization");
        }finally{
            setLoadingSummary(false);
        }
    }

    // Explain a concept using ai
    const handleExplainConcept = async()=>{
        try {
            setLoadingExplanation(true);
            const response = await api.post(`/documents/${document._id}/explain/concept`,{prompt});
            if(response?.data?.success){
                setAIResponse({
                    heading : `Explanation of "${prompt}" `,
                    explanation : response.data.data
                });
                setPrompt('');
                setOpenAIResponseCard(true);
            }
        } catch (error) {
        
            toast.error(error?.response?.data?.message||"Error in Explaining Concept")
        }finally{
            setLoadingExplanation(false);
        }
    }

  return (
    <div className='w-full h-full bg-white rounded-xl flex flex-col gap-4'>
        {/* Heading AI Assistant */}
        <div className='p-4 border-b border-b-slate-200 flex items-start gap-2'>
            <span className='text-white bg-green-600 p-2 rounded text-lg'><LuBrain/></span>
            <div className='flex flex-col gap-1'>
                <h1 className='leading-none text-black/70 text-lg'>AI Assistant</h1>
                <p className='text-[10px] text-black/60 leading-none'>Powered By Advance AI</p>
            </div>
        </div>
        <div className='w-full h-full flex flex-col gap-4 p-6'>
            {/* Summarize the Entire Document */}
            <div className='w-full flex flex-col gap-2 border px-2 py-4 border-slate-200 rounded-xl'>
                <div className='flex items-center gap-2'>
                    <div className=' bg-blue-200 text-blue-600 p-2 rounded text-lg'><IoBookOutline/></div>
                    <div className='w-full flex justify-between'>
                        <h1 className='text-black/70 text-lg'>Generate Summary</h1>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingSummary}
                            className={`leading-none p-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded text-sm cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2
                                ${loadingSummary ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-400 hover:to-emerald-500"}`}
                            >
                            {loadingSummary && (
                                <ClipLoader size={16} color="#ffffff" />
                            )}

                            {loadingSummary ? "Summarizing..." : "Summarize"}
                        </button>
                    </div>
                </div>
                    <p className='text-sm text-black/60 '>Get a concise summary of entire document</p>
            </div>
            {/* Explain a Concept */}
            <div className='w-full flex flex-col gap-2 border px-2 py-4 border-slate-200 rounded-xl'>
                <div className='flex items-center gap-2'>
                    <span className='text-orange-400 bg-orange-200 p-2 rounded text-lg'><HiOutlineLightBulb/></span>
                    <h1 className=' text-black/70 text-lg'>Explain a Concept</h1>
                </div>
                <p className='text-black/60 text-sm'>Enter a topic or concept from document to get a detailed explanation</p>
                {/* Search bar and button */}
                <div className='w-full flex gap-2'>
                    <div className='flex-1 p-1 rounded border border-slate-200'>
                        <input 
                        type="text"
                        value={prompt}
                        onChange={(e)=>setPrompt(e.target.value)}
                        placeholder='e.g, Hooks in React'
                        className='w-full h-full outline-none text-black/60 text-sm'
                         />
                    </div>
                    <button
                        onClick={handleExplainConcept}
                        disabled={loadingExplanation}
                        className={`leading-none p-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded text-sm cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2
                            ${loadingExplanation ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-400 hover:to-emerald-500"}`}
                        >
                        {loadingExplanation && (
                            <ClipLoader size={16} color="#ffffff" />
                        )}

                        {loadingExplanation ? "Explaining..." : "Explain"}
                    </button>
                </div>
            </div>
        </div>
        {openAIResponseCard && <AIResponseCard aiResponse={aiResponse} onClose={()=>setOpenAIResponseCard(false)} />}
    </div>
  )
}

export default AIActions