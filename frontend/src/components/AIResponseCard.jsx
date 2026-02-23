import React from 'react'
import { MdClose } from 'react-icons/md'
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

const options = {
    h2: ({ ...props }) => (
      <h2
        className="text-xl font-bold text-black/60 mt-10 mb-4 border-b pb-2"
        {...props}
      />
    ),
    h3: ({ ...props }) => (
      <h3
        className="text-lg font-semibold text-black/60 mt-6 mb-3"
        {...props}
      />
    ),
    p: ({ ...props }) => (
      <p className="mb-2 leading-relaxed text-black/60" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="list-disc pl-6 mb-2 text-black/60 space-y-2" {...props} />
    ),
    ol: ({ ...props }) => (
      <ol className="list-decimal pl-6 text-black/60 mb-2 space-y-2" {...props} />
    ),
  }

const AIResponseCard = ({ aiResponse , onClose}) => {
  return (
    <div className="absolute inset-0 bg-black/25 z-60 flex justify-center items-center">
        <div className="w-full max-w-md h-[90%] bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-full p-4 flex flex-col gap-2 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-slate-700 md:text-lg">{aiResponse?.heading}</h1>
                    <button type="button" onClick={onClose}>
                    <MdClose className="text-2xl text-slate-500" />
                    </button>
                </div>

                {/* AI Response */}
                <div className="prose max-w-full">
                    <ReactMarkdown  components={options} >{aiResponse?.explanation}</ReactMarkdown>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AIResponseCard;