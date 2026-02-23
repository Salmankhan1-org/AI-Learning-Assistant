import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import api from "../helper/axiosAPI";
import Loader from "../components/Loader";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { IoArrowBackOutline } from "react-icons/io5";

const DisplayQuiz = () => {
  const [index, setIndex] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubmitQuiz, setLoadingSubmitQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();

  const { quizId } = useParams();

  // Fetch Quiz
  const fetchQuizById = async () => {
    try {
      const response = await api.get(`/quiz/${quizId}/get`);
      if (response?.data?.success) {
        setQuiz(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizById();
  }, []);

  if (loading) return <Loader fullScreen />;

  if (!quiz) return <p className="text-center">Quiz not found</p>;

  const totalQuestions = quiz?.questions?.length || 0;
  const currentQuestion = quiz?.questions?.[index];

  // Navigation
  const previous = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  const next = () => {
    if (index < totalQuestions - 1) setIndex((prev) => prev + 1);
  };

  // Select option
  const handleSelect = (selectedAnswer) => {
    setUserAnswers((prev) => {
        const existing = prev.find(
        (ans) => ans.questionIndex === index
        );

        if (existing) {
        // update answer
        return prev.map((ans) =>
            ans.questionIndex === index
            ? { ...ans, selectedAnswer }
            : ans
        );
        } else {
        // add new answer
        return [
            ...prev,
            { questionIndex: index, selectedAnswer }
        ];
        }
    });
    };


  // Track the progress of the questions has been attempted
  const answeredCount = userAnswers.length;

    const progress =
    totalQuestions === 0
        ? 0
        : Math.round((answeredCount / totalQuestions) * 100);


    // Submit the quiz
    const handleSubmitQuiz = async () => {
        if (answeredCount !== totalQuestions) {
            const confirmSubmit = window.confirm(
            `You have attempted ${answeredCount}/${totalQuestions} questions. Do you want to continue?`
            );

            if (!confirmSubmit) return;
        }
        try {
            setLoadingSubmitQuiz(true);

            const response = await api.post(
            `/quiz/${quizId}/submit`,
            { userAnswers }
            );

            if (response?.data?.success) {
                toast.success(response.data.message);
                navigate(`/quizzes/${quizId}/analysis`)
            }
        } catch (error) {
            toast.error(
            error?.response?.data?.message ||
                "Error in Submitting Quiz"
            );
        } finally {
            setLoadingSubmitQuiz(false);
        }
    };


  return (
    <div className="w-full h-full max-w-3xl mx-auto flex flex-col space-y-4 p-4 rounded-xl">
      {/* Navigate to Documents */}
      <p onClick={()=>navigate('/documents')} className="text-black/60 text-sm cursor-pointer flex items-center gap-1"> <IoArrowBackOutline/>  Back to Documents</p>
      {/* Title */}
      <h1 className="text-black/60 text-xl">
        {quiz?.documentId?.title}
      </h1>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[12px] text-black/60">
          <p>
            Question {index + 1}/{totalQuestions}
          </p>
          <p>{progress}% completed</p>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-green-500 h-2 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full bg-white flex flex-col gap-3 rounded-xl p-4 shadow-sm">
        <span className="text-xs text-green-600 flex items-center gap-1 bg-green-200 px-2 py-1 rounded w-fit">
          <FaArrowRightLong />
          Question {index + 1}
        </span>

        <h1 className="text-sm md:text-base text-black/70">
          {currentQuestion?.question}?
        </h1>

        <div className="flex flex-col gap-2">
          {currentQuestion?.options?.map((option) => {
            const isSelected =
            userAnswers.find(
                (ans) => ans.questionIndex === index
            )?.selectedAnswer === option;


            return (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`p-2 rounded-md border flex items-center gap-2 hover:border-green-500 hover:bg-green-100 hover:text-green-600 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-green-500 bg-green-100 text-green-600"
                    : "border-slate-200 text-black/60 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border  hover:border-4 hover:border-green-500  transition-all
                  ${
                    isSelected
                      ? "border-green-500 border-4"
                      : "border-slate-300"
                  }`}
                />
                <p className="text-sm">{option}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={previous}
          disabled={index === 0}
          className="flex items-center gap-1 leading-none p-2 rounded bg-slate-300 border border-slate-400 disabled:opacity-50"
        >
          <MdNavigateBefore className="text-xl" />
          Previous
        </button>

        <p>
          {index + 1}/{totalQuestions}
        </p>

        {index+1 < totalQuestions ? 
        <button
          onClick={next}
          disabled={index === totalQuestions - 1}
          className="flex items-center gap-1 leading-none p-2 rounded bg-slate-300 border border-slate-400 disabled:opacity-50"
        >
          Next
          <MdNavigateNext className="text-xl" />
        </button>:
        <button 
            onClick={handleSubmitQuiz}
            disabled={loadingSubmitQuiz}
            className={`leading-none p-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded text-sm cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2
                ${loadingSubmitQuiz ? "opacity-70 cursor-not-allowed" : "hover:from-emerald-400 hover:to-emerald-500"}`}
            >
            {loadingSubmitQuiz && (
                <ClipLoader size={16} color="#ffffff" />
            )}

            {loadingSubmitQuiz ? "Submitting..." : "Submit Quiz"}
        </button>}
      </div>
    </div>
  );
};

export default DisplayQuiz;
