import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { Link, useLocation, useParams } from 'react-router-dom';
import { MdDelete, MdNavigateBefore } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import SetCard from '../components/SetCard';
import api from '../helper/axiosAPI';

const reactQnA = [
  {
    id: 1,
    question: "What is React?",
    answer: "React is a JavaScript library used to build fast and interactive user interfaces."
  },
  {
    id: 2,
    question: "What is JSX?",
    answer: "JSX is a syntax extension that allows writing HTML-like code inside JavaScript."
  },
  {
    id: 3,
    question: "What is a component in React?",
    answer: "A component is a reusable piece of UI that returns JSX."
  },
  {
    id: 4,
    question: "What is state in React?",
    answer: "State is an object that stores data which can change over time in a component."
  },
  {
    id: 5,
    question: "What are props?",
    answer: "Props are read-only data passed from a parent component to a child component."
  },
  {
    id: 6,
    question: "What is useState hook?",
    answer: "useState is a hook that allows functional components to manage state."
  },
  {
    id: 7,
    question: "What is useEffect used for?",
    answer: "useEffect is used to handle side effects like API calls or subscriptions."
  },
  {
    id: 8,
    question: "What is virtual DOM?",
    answer: "The virtual DOM is a lightweight copy of the real DOM that improves performance."
  },
  {
    id: 9,
    question: "What is conditional rendering?",
    answer: "It is rendering components or elements based on certain conditions."
  },
  {
    id: 10,
    question: "What is key in React lists?",
    answer: "A key helps React identify which list items have changed or been updated."
  }
];

const FlashcardSet = () => {
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cards, setCards] = useState([]);

    const params = useParams();
    // Navigate to next card
    const next = ()=>{
        if(index < reactQnA.length-1){
            setIsFlipped(false);
            setIndex(index+1);

        }
    }
    // Navigate to previous card
    const previous = ()=>{
        if(index > 0){
            setIsFlipped(false);
            setIndex(index-1);
        }
    }

    // fetch the flashcard by id
    const fetchFlashcardById = async()=>{
      try {
        const response = await api.get(`/flashcards/${params.id}`);
        if(response?.data?.success){
          setCards(response.data.data.cards);
        }
      } catch (error) {
        console.log(error?.response?.data?.message || "Error in fetching Flashcard");
      }
    }

    useEffect(()=>{
      fetchFlashcardById();
    },[]);
  return (
    <div className='w-full flex flex-col space-y-6'>
        <div className='w-full flex items-center justify-between '>
            <h1 className='text-slate-700 text-sm md:text-base'>Flashcard</h1>
            <button className='leading-none p-1.5 flex items-center justify-center gap-1 text-white bg-green-600 hover:bg-green-500 transition-colors duration-300 cursor-pointer text-sm rounded'><MdDelete/>Delete Set</button>
        </div>

        {/* Question and Answer set */}
        <div className='w-full max-w-md mx-auto flex flex-col space-y-4'> 
              <SetCard flashcardId={params.id} currentCard={cards[index]} isFlipped={isFlipped} setIsFlipped={setIsFlipped} cards={cards} setCards={setCards} />
          <div className='w-full flex justify-between items-center'>
              <button onClick={previous} className='leading-none cursor-pointer flex items-center gap-1 p-1.5 rounded bg-slate-300 border border-slate-400'>
                  <MdNavigateBefore className='text-xl'/>
                  Previous
              </button>
              <p>{index+1}/{cards?.length}</p>
              <button onClick={next} className='leading-none cursor-pointer flex items-center gap-1 p-1.5 rounded bg-slate-300 border border-slate-400'>
                  Next
                  <MdNavigateNext className='text-xl'/>
              </button>
          </div>
        </div>

    </div>
  )
}

export default FlashcardSet