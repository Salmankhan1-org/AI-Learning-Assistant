import React, { useEffect, useState } from 'react'
import { GoPlus } from "react-icons/go";
import { FaBookReader } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { MdQuiz } from "react-icons/md";
import UploadDocument from '../components/UploadDocument';
import { Link } from 'react-router-dom';
import api from '../helper/axiosAPI';
import { toast } from 'react-toastify';
import { formatISODate } from '../helper/formatDate';
import Loader from '../components/Loader';

const BG_COLORS = {
  from_green: "#bbf7d0",
  to_green:'#86efac',
  from_blue: "#bae6fd",
  to_blue: '#7dd3fc',
  from_orange: "#fdba74",
  to_orange: '#fb923c',
  from_purple: "#e9d5ff",
  to_purple: '#c4b5fd'
};

const Documents = () => {
  const [isOpenUploadDocForm, setIsOpenUploadDocForm] = useState(false);
  const [MyDocuments, setMyDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyDocuments = async()=>{
    try {
      setLoading(true);
      const response = await api.get('/documents/all',{
        withCredentials: true
      });

      if(response?.data?.success){
        setMyDocuments(response.data.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.message || "Error in fetch Documents");
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchMyDocuments();
  },[]);

  if(loading) return <Loader />
  return (
    <div className='w-full h-full flex flex-col space-y-3'>
        {MyDocuments && MyDocuments.length > 0 ? 
        <>
        <div className='w-full flex justify-between items-center bg-white py-2 px-4 rounded-xl shadow'>
            <div className='flex flex-col '>
                <h2 className='text-black/60 text-sm md:text-base'>My Documents</h2>
                <p className=' text-[10px] md:text-sm text-black/50'>Manage and Organize your learning materials</p>
            </div>
            <button onClick={()=>setIsOpenUploadDocForm(true)} className='leading-none text-sm p-1 flex items-center space-x-1 text-white rounded bg-orange-500 hover:bg-orange-600 cursor-pointer transition-colors duration-300'>
                <GoPlus className=' size-4 md:size-5'/>
                Document
            </button>
           
        </div>
         {/* Document Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {
          MyDocuments.map((document, index) => (
            <Link to={document._id}
            key={document._id}
            className="relative group w-full flex flex-col space-y-4 p-4 rounded-xl shadow bg-white hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            >
        
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>

       
            <span className="p-2 rounded bg-[#f97316] text-white inline-flex w-fit items-center justify-center text-xl z-10">
                <FaBookReader />
            </span>


            <div className="flex flex-col space-y-1 z-10">
                <h1 className="text-slate-700 truncate font-medium">{document?.title}</h1>
                <p className="text-xs text-slate-400">{document?.file?.size}</p>
            </div>

            <div className="flex justify-between z-10">
                <span className={`flex items-center space-x-1 leading-none p-1 text-[10px] rounded text-purple-700 bg-linear-to-r from-[#bae6fd] to-[#7dd3fc]`}>
                <CgFileDocument className="text-sm" />
                <span>{document?.countFlashcards} Flashcards</span>
                </span>
                <span className={`flex items-center space-x-1 leading-none p-1 text-[10px] rounded text-green-800 bg-linear-to-r from-[#bbf7d0] to-[#86efac]`}>
                <MdQuiz className="text-sm" />
                <span>{document?.countQuizzes} Quizzes</span>
                </span>
            </div>
            <p className="text-sm text-slate-400 z-10">{formatISODate(document?.createdAt)}</p>
            </Link>
        ))
        }
        </div>
        </>
        :
        <div className='w-full h-full flex items-center justify-center'>
          <div className='bg-white w-full max-w-md rounded-lg p-4 flex flex-col items-center gap-4'>
            <h1 className='text-black/60'>No Document Available.</h1>
            <p className='text-sm text-black/60'>You can Start your learning journey by Adding a document</p>
            <button onClick={()=>setIsOpenUploadDocForm(true)} className='leading-none text-[10px] md:text-[12px] p-0.5 md:p-1 flex items-center space-x-1 text-white rounded bg-green-500 hover:bg-green-600 cursor-pointer transition-colors duration-300'>
                <GoPlus className=' size-4 md:size-5'/>
                Document
            </button>
          </div>
        </div>}

        {isOpenUploadDocForm && <UploadDocument onClose={()=>setIsOpenUploadDocForm(false)} fetchMyDocuments={fetchMyDocuments} />}

    </div>
  )
}

export default Documents