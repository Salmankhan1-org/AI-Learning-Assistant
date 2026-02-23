import React, { useEffect, useState } from 'react'
import { FaBookOpen } from "react-icons/fa";
import { MdOutlineAutoGraph } from "react-icons/md";
import { SiStudyverse } from "react-icons/si";
import { Link } from 'react-router-dom';
import api from '../helper/axiosAPI';
import {formatDistanceToNow} from 'date-fns'
import { calculateFlashcardProgress } from '../helper/flashcardProgress';
import Loader from '../components/Loader';


const FlashCards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  // Fetch All cards
  const fetchAllFlashcards = async()=>{
    try {
      setLoadingFlashcards(true);
      const response = await api.get('/flashcards/get/all');

      if(response?.data?.success){
        setFlashcards(response?.data?.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.message || "Error in Fetching Flashcards");
    }finally{
      setLoadingFlashcards(false);
    }
  }


  // Fetch only once when component mount
  useEffect(()=>{
    fetchAllFlashcards();
  },[]);

  if(loadingFlashcards ) return <Loader/>
  return (
    <div className='w-full flex flex-col space-y-2'>
        <div className='flex flex-col bg-white px-4 py-2 rounded-xl shadow'>
            <h2 className='text-black/60 text-sm md:text-base'>All Flashcards Sets</h2>
            <p className=' text-[10px] md:text-sm text-black/50'>Analyze the Progress of your Flashcards</p>
        </div>
        {/* FlashCards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
            {flashcards && flashcards?.length > 0 && flashcards.map((flashcard,index)=> 
            <div key={flashcard?._id} className='w-full flex flex-col space-y-6 rounded-xl cursor-pointer shadow hover:shadow-2xl transition-shadow  duration-300 bg-white p-3'>
                {/* Heading and Icon */}
                <div className='w-full flex items-center gap-4'>
                    <span className='text-orange-600  bg-orange-200 p-2 rounded-xl'><FaBookOpen className='text-xl'/></span>
                    <div className='w-full'>
                        <h1 className='text-black/60 text-sm line-clamp-2'>{flashcard?.documentId?.title}</h1>
                        <p className='text-[10px] text-slate-400'>Created {formatDistanceToNow(flashcard?.createdAt ,{addSuffix:true})}</p>
                    </div>
                </div>
                {/* Number of Cards and Progress */}
                <div className='w-full flex items-center gap-6'>
                    <span className='text-xs p-1 leading-none rounded border border-slate-300 text-slate-400'>{flashcard?.cards?.length} Cards</span>
                    <span className='text-xs p-1 leading-none rounded bg-green-200 text-green-600 flex items-center gap-2'><MdOutlineAutoGraph/> {calculateFlashcardProgress(flashcard)} % </span>
                </div>
                {/* Number of Cards Completed */}
                <div className='w-full'>
                    <p className='w-fit ml-auto text-[10px]'>{flashcard?.cards?.filter(card=>card?.reviewCount > 0)?.length || 0}/{flashcard?.cards?.length}</p>
                 <div className="w-full bg-gray-200 h-2 rounded ">
                    <div
                        className="bg-green-500 h-2 rounded"
                        style={{
                            width: `${calculateFlashcardProgress(flashcard)}%`,
                        }}
                        />
                    </div>
                <div/>
                </div>
                {/* Study Now Button */}
                <Link to={`/set/${flashcard?._id}`} className='leading-none w-[80%] mx-auto flex items-center justify-center gap-1 p-2 rounded bg-green-300 text-green-700 hover:bg-green-400 transition-colors duration-300 cursor-pointer'><SiStudyverse/> Study </Link>
            </div>)}
        </div>

    </div>
  )
}

export default FlashCards