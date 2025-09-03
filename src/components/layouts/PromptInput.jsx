import { useState, useRef } from "react";
import { FaPlus, FaPaperPlane, FaMicrophone, FaImage, FaTimes } from "react-icons/fa";
import { message } from "antd";

const PromptInput = ({ onSendMessage, isTyping }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((prompt.trim() || selectedImage) && !isTyping) {
      onSendMessage(prompt, selectedImage);
      setPrompt("");
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        message.error('Hanya file gambar yang diperbolehkan!');
        return;
      }
      
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Ukuran file tidak boleh lebih dari 5MB!');
        return;
      }
      
      setSelectedImage(file);
      
      // Buat preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
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
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-xs max-h-32 rounded-lg border border-gray-200 shadow-sm"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Hapus Gambar"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        )}
        
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleImageButtonClick}
            className="p-3 text-gray-400 hover:text-white transition-colors duration-200 rounded-l-2xl"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Upload Gambar"
          >
            <FaImage className="text-lg" />
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
            disabled={(!prompt.trim() && !selectedImage) || isTyping}
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