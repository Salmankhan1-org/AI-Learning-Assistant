import React, { useEffect, useState } from 'react'
import { MdDelete, MdOutlineQuiz } from "react-icons/md";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import GenerateQuizCard from '../components/GenerateQuizCard';
import api from '../helper/axiosAPI';
import { FaPlus } from 'react-icons/fa';
import { MdBarChart } from "react-icons/md";
import { formatDistanceToNow } from 'date-fns';
import Loader from '../components/Loader';
import { FaPlay } from "react-icons/fa";

const Quizzes = () => {
    const [openNewQuizCard, setOpenNewQuizCard] = useState(false);
    const [quizzes , setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const documentId = useParams().id;
    const navigate = useNavigate();

    // Fetch All Quizzes For this Document once the component mounts
    const fetchAllQuizzes = async()=>{
        
        try {
            setLoading(true);
            const response = await api.get(`/quiz/${documentId}/get/all`);

            if(response?.data?.success){
                setQuizzes(response.data.data);
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

     // Delete Quiz
    const handleDeleteQuiz = async(e,quizId)=>{
        e.preventDefault();
        try {
            const response = await api.delete(`/quiz/${quizId}/delete`);

            if(response?.data?.success){
                fetchAllQuizzes();
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message||"Error in Deleting Quiz");
        }
    }

    useEffect(()=>{
        fetchAllQuizzes();
    },[])

  if(loading) return <Loader/>
  return (
    <div className='w-full h-full bg-white rounded-xl'>
        {quizzes && quizzes?.length > 0 ? 
        <div className='w-full h-full flex flex-col gap-1'>
            <div className='w-full flex justify-between items-center p-2'>
                <div className='flex flex-col space-y-1'>
                    <h1 className=' font-semibold text-slate-700'>Your Quizzes</h1>
                    <p className='text-xs text-slate-500'>{quizzes?.length || 0} quiz Available</p>
                </div>
                <button 
                onClick={()=>setOpenNewQuizCard(true)}
                className='leading-none p-2 text-sm rounded cursor-pointer bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-colors duration-300 flex items-center text-white gap-1'> <FaPlus/> Generate New Quiz</button>
            </div>
            <div className='w-full p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {quizzes.map((quiz, index)=>
                <div  key={quiz?._id} className='w-full flex flex-col space-y-6 p-4 rounded-xl border border-slate-300 hover:border-green-400 transition-all duration-300'>
                    <div className='flex items-center justify-between '> 
                        <span className='text-sm p-1 rounded text-green-600 bg-green-300 flex items-center gap-1'><MdBarChart/> Score {quiz?.score}/{quiz?.totalQuestions}</span>
                        <span 
                        className='text-xl text-slate-500 cursor-pointer hover:scale-110 transition-all duration-500' 
                        onClick={(e)=>handleDeleteQuiz(e,quiz?._id)}
                        >
                            <MdDelete/></span>
                    </div>
                    <div className='flex flex-col '>
                        <h1 className='text-slate-700 font-semibold'>{quiz?.documentId?.title} - Quiz</h1>
                        <p className='text-xs text-slate-500'>Created {formatDistanceToNow(quiz?.createdAt, {addSuffix:true})}</p>
                    </div>
                    <p className='text-xs leading-none p-2 rounded bg-slate-300  w-fit '>{quiz?.questions?.length} Questions</p>

                    {quiz?.completedAt ? 
                    <button 
                    onClick={()=>navigate(`/quizzes/${quiz?._id}/analysis`)}
                    className='text-sm leading-none p-3 rounded bg-slate-300 hover:bg-slate-200 cursor-pointer transition-all duration-300  md:w-[70%] md:mx-auto flex items-center justify-center gap-1 '> <MdBarChart/> View Result</button>
                    :
                    <button 
                    onClick={()=>navigate(`/quizzes/${quiz?._id}`)}
                    className='text-sm leading-none cursor-pointer p-3 rounded bg-green-500 hover:bg-green-400 transition-colors duration-300 text-white   md:w-[70%] md:mx-auto flex items-center justify-center gap-1 '> <FaPlay/> Start Quiz</button>}
                </div>)}
            </div>
        </div>
        :
        <div className='w-full h-full flex items-center justify-center'>
            <div className='p-2 w-full max-w-md flex flex-col space-y-2 items-center'>
                <span className='text-3xl p-2 rounded-xl text-green-600 bg-green-300'><MdOutlineQuiz/></span>
                <h1 className='text-xl font-semibold'>No Quizzes yet</h1>
                <p className='text-center text-slate-700'>Generate Quizzes from your document to start learning and reinforce your knowledge</p>
                <button
                    onClick={()=>setOpenNewQuizCard(true)}
                    className={`leading-none p-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded text-sm cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2`}
                    >
                   Generate Quiz
                </button>
            </div>
        </div> }
        {openNewQuizCard  && <GenerateQuizCard documentId={documentId} onClose={()=>setOpenNewQuizCard()} fetchAllQuizzes={fetchAllQuizzes}/>}
    </div>
  )
}

export default Quizzes