import React, { useState, useRef, useEffect } from "react";
import { FaMessage } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import api from "../helper/axiosAPI";
import { useDocument } from "../helper/DocumentContext";

const CardAIChat = () => {
  const [loadingChat, setLoadingChat] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const document = useDocument();

  // Auto scroll to bottom when messages change
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  
  // FETCH PREVIOUS CHAT HISTORY

  const fetchPreviousChat = async () => {
    try {
      const response = await api.get(
        `/documents/${document._id}/chats/get`
      );

      if (response.data?.data?.messages) {
        setMessages(response.data.data.messages);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (document?._id) {
      fetchPreviousChat();
    }
  }, [document]);


  // ASK AI
  const handleAskAi = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", content: prompt };

    // Show user message instantly
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoadingChat(true);

    try {
      const response = await api.post(
        `/documents/${document._id}/chat/new`,
        { prompt } 
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAskAi();
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">

      {/* chat Area */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <FaMessage className="text-lg" />
              </span>
              <h1 className="text-black/70 md:text-lg font-medium">
                Start Conversation
              </h1>
              <p className="text-black/50 text-sm">
                Ask me anything about the document
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm leading-relaxed wrap-break-word ${
                  msg.role === "user"
                    ? "bg-emerald-500 text-white rounded-br-none"
                    : "bg-gray-100 text-black rounded-bl-none"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {loadingChat && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm">
              <ClipLoader size={14} />
            </div>
          </div>
        )}
      </div>

      {/* input area */}
      <div className="border-t border-slate-200 p-3 bg-white">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this document..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-400 outline-none text-black/90"
            />
          </div>

          <button
            onClick={handleAskAi}
            disabled={loadingChat}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-200
              ${
                loadingChat
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500"
              }`}
          >
            {loadingChat ? (
              <>
                <ClipLoader size={16} color="#ffffff" />
                Asking...
              </>
            ) : (
              <>
                <FiSend />
                Ask AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardAIChat;
