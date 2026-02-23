import React, { useEffect, useState } from 'react'
import api from '../helper/axiosAPI';
import Loader from '../components/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { BsTrophy } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CiCircleCheck } from "react-icons/ci";
import ScoreCircle from '../components/ScoreCircle';
import { IoBookOutline } from "react-icons/io5";

const QuizAnalysis = () => {

    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState();
    const [quizLoading, setQuizLoading] = useState(false);

    // Fetch Quiz
    const fetchQuizById = async () => {
        try {
            setQuizLoading(true);
            const response = await api.get(`/quiz/${quizId}/get`);
            if (response?.data?.success) {
                setQuiz(response?.data?.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setQuizLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizById();
    }, []);

    if (quizLoading) return <Loader fullScreen />;
    if (!quiz) return <p className="text-center">Quiz not found</p>;

    const totalQuestions = quiz?.totalQuestions || 0;
    const correctAnswers = quiz?.userAnswers?.filter(a => a.isCorrect)?.length || 0;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = totalQuestions
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    return (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col space-y-4 p-4 rounded-xl">

            {/* Navigate */}
            <p
                onClick={() => navigate('/documents')}
                className="text-black/60 text-sm cursor-pointer flex items-center gap-1"
            >
                <IoArrowBackOutline /> Back to Documents
            </p>

            {/* Title */}
            <div className='p-2 rounded-xl bg-white'>
                <h1 className="text-black/60 text-lg">
                    {quiz?.documentId?.title}
                </h1>
            </div>

            {/* Quiz Score */}
            <div className='w-full bg-white rounded-xl flex flex-col items-center gap-4 p-3'>
                <span className='p-3 bg-yellow-100 text-yellow-600 rounded'>
                    <BsTrophy className='text-xl' />
                </span>

                <ScoreCircle score={percentage} />

                <div className='flex gap-2 items-center justify-center flex-wrap'>

                    {/* Total */}
                    <button className='leading-none p-2 bg-slate-200 border border-slate-300 rounded flex items-center text-sm gap-1'>
                        <CiCirclePlus />
                        <span className='text-black/60'>
                            {totalQuestions} Total
                        </span>
                    </button>

                    {/* Correct */}
                    <button className='leading-none p-2 bg-green-200 border border-green-300 text-green-600 rounded flex items-center text-sm gap-1'>
                        <CiCircleCheck />
                        <span>{correctAnswers} Correct</span>
                    </button>

                    {/* Incorrect */}
                    <button className='leading-none p-2 bg-red-200 border border-red-300 text-red-600 rounded flex items-center text-sm gap-1'>
                        <AiOutlineCloseCircle />
                        <span>{incorrectAnswers} Incorrect</span>
                    </button>
                </div>
            </div>

            {/* Detailed Review */}
            <div className='w-full flex flex-col gap-4'>
                <p className='text-black/60 flex items-center gap-1'>
                    <IoBookOutline /> Detailed Review
                </p>

                {quiz?.questions?.map((question, qIndex) => {

                    const userAnswer = quiz?.userAnswers?.find(
                        (ans) => ans.questionIndex === qIndex
                    );

                    const selectedAnswer = userAnswer?.selectedAnswer;
                    const isCorrect = userAnswer?.isCorrect;

                    return (
                        <div
                            key={qIndex}
                            className='w-full bg-white flex flex-col gap-3 p-3 rounded-xl'
                        >

                            {/* Question Header */}
                            <div className='flex justify-between items-center'>
                                <span className='p-2 leading-none rounded text-black/60 bg-slate-200 border border-slate-300 text-sm'>
                                    Question : {qIndex + 1}
                                </span>

                                {selectedAnswer ? (
                                    <span
                                        className={`p-2 rounded ${isCorrect
                                            ? 'bg-green-100 border border-green-300 text-green-600'
                                            : 'bg-red-100 border border-red-300 text-red-600'
                                            }`}
                                    >
                                        {isCorrect
                                            ? <CiCircleCheck />
                                            : <AiOutlineCloseCircle />}
                                    </span>
                                ) : (
                                    <span className='p-2 rounded bg-gray-100 border border-gray-300 text-gray-500 text-xs'>
                                        Not Attempted
                                    </span>
                                )}
                            </div>

                            {/* Question Text */}
                            <h2 className='text-black/70'>
                                {question.question}
                            </h2>

                            {/* Options */}
                            <div className='flex flex-col gap-2'>
                                {question.options.map((option, oIndex) => {

                                    const isSelected = selectedAnswer === option;
                                    const isRightAnswer = option === question.correctAnswer;

                                    let optionStyle =
                                        "border border-slate-200 text-black/60 bg-white";

                                    let icon = null;

                                    // ❌ Wrong selected
                                    if (isSelected && !isRightAnswer) {
                                        optionStyle =
                                            "border border-red-400 bg-red-100 text-red-600";
                                        icon = <AiOutlineCloseCircle className="text-lg" />;
                                    }

                                    // ✅ Correct answer
                                    if (isRightAnswer) {
                                        optionStyle =
                                            "border border-green-400 bg-green-100 text-green-600";
                                        icon = <CiCircleCheck className="text-lg" />;
                                    }

                                    // Neutral option
                                    if (!isSelected && !isRightAnswer) {
                                        icon = (
                                            <div className="w-4 h-4 rounded-full border border-slate-300" />
                                        );
                                    }

                                    return (
                                        <div
                                            key={oIndex}
                                            className={`p-2 rounded-md flex items-center gap-2 ${optionStyle}`}
                                        >
                                            {icon}
                                            <span>{option}</span>

                                            {/* Show "Your Answer" label */}
                                            {isSelected && (
                                                <span className="ml-auto text-xs font-medium">
                                                    Your Answer
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Explanation (only if wrong & attempted) */}
                            {selectedAnswer && question.explanation && (
                                <div className='mt-3 p-3 bg-blue-50 border border-blue-200 rounded flex gap-2 items-start text-sm text-blue-700'>
                                    <IoBookOutline className="text-lg mt-1" />
                                    <div>
                                        <p className="font-semibold">Explanation</p>
                                        <p>{question.explanation}</p>
                                    </div>
                                </div>
                            )}


                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default QuizAnalysis;
