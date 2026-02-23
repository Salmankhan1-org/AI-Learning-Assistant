import React from "react";
import { FaRegStar } from "react-icons/fa";
import { TbHandClick } from "react-icons/tb";
import { toast } from "react-toastify";
import api from "../helper/axiosAPI";
import { BsCheckCircle } from "react-icons/bs";

const SetCard = ({ flashcardId,  currentCard, isFlipped, setIsFlipped, cards, setCards }) => {

  // Toggle card Star
  const toggleStar = async(e)=>{
    e.stopPropagation();
    //Toggle the star temporarily before calling the api
    setCards(prev =>
    prev.map(card =>
      card._id === currentCard?._id
        ? { ...card, isStarred: !card.isStarred }
        : card
    )
  );
    try {
      const response = await api.patch(`/flashcards/${flashcardId}/cards/${currentCard?._id}/star`);

      if(response?.data?.success){
        toast.success(response?.data?.message);
      }
    } catch (error) {
      //revert the toggled start if failed in backend
      setCards(prev =>
      prev.map(card =>
        card._id === currentCard?._id
          ? { ...card, isStarred: !card?.isStarred }
          : card
      )
    );
      toast.error(error?.response?.data?.message || "Error in Toggling Star");
    }
  }


  // Update last reviewed and review Count
  const markReviewed = async(e)=>{
    if(!currentCard) return ;

    const today = new Date().toDateString();
    const lastReviewed = currentCard?.lastReviewed
      ? new Date(currentCard.lastReviewed).toDateString()
      : null;

    if (lastReviewed === today) { // check if already viewed today or not
      toast.warn("Card is Already reviewed today")
      return;
    }

    try {
      const response = await api.patch(`/flashcards/${flashcardId}/cards/${currentCard?._id}/review`);

      if(response?.data?.success){
        // update the review Count of card locally for immediate change in counts
        setCards((prev) =>
          prev.map((card) =>
            card._id === currentCard._id
              ? {
                  ...card,
                  reviewCount: response.data.reviewCount,
                  lastReviewed: response.data.lastReviewed,
                }
              : card
          ))
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error in updating reviews");
    }
  }

  return (
    <div
      className="w-full mt-10 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={(e) => {
        if (e.target.closest("button")) return;
        setIsFlipped(!isFlipped);
      }}
    >
      {/* Card */}
      <div
        className={`
          relative w-full transition-transform duration-500
          transform-style-preserve-3d
           ${isFlipped ? "rotate-y-180" : ""}
        `}
        style={{minHeight:"200px"}}
      >
       {/* FRONT */}
        <div className="absolute inset-0 backface-hidden">
  <div className="w-full flex flex-col items-center space-y-6 bg-white shadow hover:shadow-xl transition-shadow duration-300 p-4 rounded-xl h-full">
            <div className="w-full flex items-center justify-between">
              <span
                className={`p-1.5 text-xs rounded border capitalize
                  ${currentCard?.difficulty === "easy" && "bg-green-100 text-green-700 border-green-300"}
                  ${currentCard?.difficulty === "medium" && "bg-yellow-100 text-yellow-700 border-yellow-300"}
                  ${currentCard?.difficulty === "hard" && "bg-red-100 text-red-700 border-red-300"}
                `}
              >
                {currentCard?.difficulty}
            </span>

              <span onClick={(e)=>toggleStar(e)} className={`p-1.5 rounded bg-slate-200 border border-slate-300 ${currentCard?.isStarred ? 'bg-yellow-400 text-white':''}`}>
                <FaRegStar />
              </span>
            </div>

            <h1 className="text-slate-700 text-center">
              {currentCard?.question}
            </h1>

            <p className="flex items-center gap-1 text-sm  text-slate-400">
              <TbHandClick /> Click to reveal answer
            </p>
          </div>
        </div>

                {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full relative flex flex-col items-center justify-center space-y-4 bg-green-600 text-white shadow-xl p-4 rounded-xl h-full">
            <h2 className="text-lg font-semibold">Answer</h2>
            <p className="text-center text-sm">{currentCard?.answer}</p>
            <span className="text-xs opacity-80">Click to flip back</span>
            <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  markReviewed(e);
                }}
                className={`absolute right-2 top-2 
                  p-2 rounded-full 
                  backdrop-blur-sm 
                  transition-all duration-200 
                  hover:scale-110 
                  ${
                    currentCard?.reviewCount > 0
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-400 bg-white/70 hover:text-emerald-500"
                  }
                `}
              >
                <BsCheckCircle className="text-lg" />
          </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SetCard;

