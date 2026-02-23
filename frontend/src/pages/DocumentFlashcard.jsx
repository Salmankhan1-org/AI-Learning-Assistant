import React, { useEffect, useState } from 'react'
import { LuBrain } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { useDocument } from '../helper/DocumentContext';
import { toast } from 'react-toastify';
import api from '../helper/axiosAPI';
import { ClipLoader } from 'react-spinners';
import { MdDelete } from "react-icons/md";
import {  formatISODate } from '../helper/formatDate';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';


const DocumentFlashcard = () => {
    const [generateFlashcardLoading, setgenerateFlashcardLoading] = useState(false);
    const [fetchFlashcardLoading, setFetchFlashcardLoading] = useState(false);
    const document = useDocument();
    const [flashcards, setFlashcards] = useState([]);

    // Get Flahcards for the current document
    const fetchMyFlashcards = async()=>{
        try {
            setFetchFlashcardLoading(true);
            const response = await api.get(`/flashcards/${document._id}/get`);

            if(response?.data?.success){
                setFlashcards(response?.data?.data);
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
        }finally{
            setFetchFlashcardLoading(false);
        }
    }

    // Generate Flashcards
    const generateFlashcard = async()=>{
        try {
            setgenerateFlashcardLoading(true);
            const response = await api.post(`/flashcard/${document._id}/new`);

            if(response?.data?.success){
                fetchMyFlashcards();
                toast.success(response?.data?.message);
            }
        } catch (error) {
            setgenerateFlashcardLoading(false);
            toast.error(error?.response?.data?.message || "Error in Generating Flashcards");
        }finally{
            setgenerateFlashcardLoading(false);
        }
    }

    //Delete a Flashcard Set
    const deleteFlashcard = async(e,id)=>{
        e.preventDefault();
        try {
            const response = await api.delete(`/flashcards/${id}/delete`);

            if(response?.data?.success){
                fetchMyFlashcards();
                toast.success(response?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message||"Error in Deleting Flashcard");
        }
    }

    useEffect(()=>{
        fetchMyFlashcards();
    },[]);

    // Show Loading if fetching
    if(fetchFlashcardLoading) return <Loader/>
  return (
    <div className='w-full h-full bg-white rounded-xl' >
        {flashcards && flashcards.length > 0 ? 
        <div className='w-full h-full flex flex-col gap-1'>
            <div className='w-full flex justify-between items-center p-2'>
                <div className='flex flex-col space-y-1'>
                    <h1 className=' font-semibold text-slate-700'>Your Flashcard Sets</h1>
                    <p className='text-xs text-slate-500'>1 Set Available</p>
                </div>
                <button
                    onClick={generateFlashcard}
                    disabled={generateFlashcardLoading}
                    className={`leading-none p-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded text-sm cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2
                        ${generateFlashcardLoading ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-400 hover:to-emerald-500"}`}
                    >
                    {generateFlashcardLoading && (
                        <ClipLoader size={16} color="#ffffff" />
                    )}

                    {generateFlashcardLoading ? "Generating..." : "Generate Flashcards"}
                </button>
            </div>

            {/* List All the Flashcards */}
            <div className='w-full p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'> 
                {flashcards.map((flashcard, index)=>
                <Link to={`${flashcard._id}`} key={flashcard?._id} className='w-full flex flex-col space-y-5 p-4 rounded-xl border border-slate-300 cursor-pointer hover:border-green-400 transition-all duration-300'>
                    <div className='flex items-center justify-between '> 
                        <span className='text-2xl p-2 rounded-xl text-green-600 bg-green-300'><LuBrain/></span>
                        <span 
                        className='text-xl text-slate-500 cursor-pointer hover:scale-110 transition-all duration-500' 
                        onClick={(e)=>deleteFlashcard(e,flashcard?._id)}><MdDelete/></span>
                    </div>
                    <div className='flex flex-col '>
                        <h1 className='text-slate-700 font-semibold'>Flashcard Set</h1>
                        <p className='text-xs text-slate-500'>{formatISODate(flashcard?.createdAt)}</p>
                    </div>
                    <p className='text-sm leading-none p-2 rounded bg-green-300 text-green-600 w-fit '>{flashcard?.cards?.length} Cards</p>
                </Link>)}
            </div>

        </div>:
        <div className='w-full h-full flex items-center justify-center'>
            <div className='p-2 w-full max-w-md flex flex-col space-y-2 items-center'>
                <span className='text-3xl p-2 rounded-xl text-green-600 bg-green-300'><LuBrain/></span>
                <h1 className='text-xl font-semibold'>No Flashcards yet</h1>
                <p className='text-center text-slate-700'>Generate Flashcards from your document to start learning and reinforce your learning</p>
                <button
                    onClick={generateFlashcard}
                    disabled={generateFlashcardLoading}
                    className={`leading-none p-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded text-sm cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2
                        ${generateFlashcardLoading ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-400 hover:to-emerald-500"}`}
                    >
                    {generateFlashcardLoading && (
                        <ClipLoader size={16} color="#ffffff" />
                    )}

                    {generateFlashcardLoading ? "Generating..." : "Generate Flashcards"}
                </button>
            </div>
        </div>}
    </div>
  )
}

export default DocumentFlashcard