import { useState } from "react";
import { FaPlus, FaPaperPlane, FaMicrophone } from "react-icons/fa";

const PromptInput = ({ onSendMessage, isTyping }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isTyping) {
      onSendMessage(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {isTyping && (
          <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#01077A'}}></div>
              <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#01077A', animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#01077A', animationDelay: '0.2s'}}></div>
            </div>
            <span>PICO sedang mengetik...</span>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <button
            type="button"
            className="p-3 text-gray-400 hover:text-white transition-colors duration-200 rounded-l-2xl"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Tambah Media"
          >
            <FaPlus className="text-lg" />
          </button>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
            disabled={isTyping}
          />
          <button
            type="button"
            className="p-3 text-gray-400 hover:text-white transition-colors duration-200"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Rekam Suara"
          >
            <FaMicrophone className="text-lg" />
          </button>
          <button
            type="submit"
            disabled={!prompt.trim() || isTyping}
            className="flex items-center px-5 py-3 text-white rounded-r-2xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{backgroundColor: '#01077A', focusRingColor: '#01077A'}}
            title="Kirim Pesan"
          >
            <FaPaperPlane className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromptInput;