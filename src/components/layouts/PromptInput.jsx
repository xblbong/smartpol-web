import { useState, useRef, useEffect } from "react";
import { FaPlus, FaPaperPlane, FaMicrophone, FaImage, FaTimes, FaMicrophoneSlash } from "react-icons/fa";
import { message } from "antd";

const PromptInput = ({ onSendMessage, isTyping }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'id-ID';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
        
        // Auto-submit after speech recognition completes
        setTimeout(() => {
          if (transcript.trim() && !isTyping) {
            handleSubmit({ preventDefault: () => {} });
          }
        }, 500);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          message.error('Akses mikrofon ditolak. Silakan izinkan akses mikrofon di browser.');
        } else if (event.error === 'no-speech') {
          message.warning('Tidak ada suara yang terdeteksi. Silakan coba lagi.');
        } else {
          message.error('Terjadi kesalahan pada pengenalan suara.');
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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

  const handleSpeechRecognition = () => {
    if (!speechSupported) {
      message.error('Browser Anda tidak mendukung pengenalan suara.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        message.error('Gagal memulai pengenalan suara.');
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-2 sm:p-4 z-10 lg:left-64">
      <div className="max-w-7xl mx-auto px-2 sm:px-0">
        {isTyping && (
          <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm animate-fade-in">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#01077A'}}></div>
              <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#01077A', animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#01077A', animationDelay: '0.2s'}}></div>
            </div>
            <span className="animate-pulse">PICO sedang mengetik...</span>
          </div>
        )}
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block animate-fade-in">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-xs max-h-32 rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110 hover:animate-pulse"
              title="Hapus Gambar"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        )}
        
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up"
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
            className="p-2 sm:p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-l-2xl flex-shrink-0 hover:scale-110 hover:animate-pulse"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Upload Gambar"
          >
            <FaImage className="text-base sm:text-lg" />
          </button>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="flex-1 px-2 sm:px-4 py-2 sm:py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base min-w-0"
            disabled={isTyping}
          />
          <button
            type="button"
            onClick={handleSpeechRecognition}
            disabled={isTyping}
            className={`p-2 sm:p-3 transition-all duration-300 flex-shrink-0 hover:scale-110 ${
              isListening 
                ? 'text-red-500 animate-pulse bg-red-100' 
                : speechSupported 
                  ? 'text-gray-400 hover:text-white hover:animate-pulse' 
                  : 'text-gray-300 cursor-not-allowed'
            }`}
            onMouseEnter={(e) => {
              if (!isListening && speechSupported && !isTyping) {
                e.target.style.backgroundColor = '#FAC62A';
              }
            }}
            onMouseLeave={(e) => {
              if (!isListening) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            title={isListening ? 'Klik untuk berhenti merekam' : 'Rekam Suara'}
          >
            {isListening ? (
              <FaMicrophoneSlash className="text-base sm:text-lg" />
            ) : (
              <FaMicrophone className="text-base sm:text-lg" />
            )}
          </button>
          <button
            type="submit"
            disabled={(!prompt.trim() && !selectedImage) || isTyping}
            className="flex items-center px-3 sm:px-5 py-2 sm:py-3 text-white rounded-r-2xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:scale-110 hover:animate-pulse"
            style={{backgroundColor: '#01077A', focusRingColor: '#01077A'}}
            title="Kirim Pesan"
          >
            <FaPaperPlane className="text-base sm:text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromptInput;