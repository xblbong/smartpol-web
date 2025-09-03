import { useState, useEffect } from 'react';
import { chatAPI } from '../services/api';

// Data dummy untuk percakapan chatbot
const dummyMessages = [
  {
    text: "Halo! Selamat datang di SmartPol. Saya PICO, asisten virtual yang siap membantu Anda. Ada yang bisa saya bantu hari ini?",
    isUser: false,
    timestamp: "10:00"
  },
  {
    text: "Halo PICO! Saya ingin tahu tentang kebijakan terbaru mengenai transparansi pemerintahan.",
    isUser: true,
    timestamp: "10:01"
  },
  {
    text: "Tentu! Kebijakan transparansi pemerintahan terbaru mencakup beberapa poin penting:\n\n1. Keterbukaan informasi publik\n2. Akses data pemerintah\n3. Partisipasi masyarakat dalam pengambilan keputusan\n\nApakah ada aspek tertentu yang ingin Anda ketahui lebih detail?",
    isUser: false,
    timestamp: "10:02"
  },
  {
    text: "Bagaimana cara saya mengakses data pemerintah yang terbuka untuk publik?",
    isUser: true,
    timestamp: "10:03"
  },
  {
    text: "Untuk mengakses data pemerintah terbuka, Anda dapat:\n\n📊 Mengunjungi portal data.go.id\n📋 Mengajukan permohonan informasi melalui PPID\n🔍 Menggunakan fitur pencarian di website resmi instansi\n📱 Menggunakan aplikasi mobile yang tersedia\n\nApakah Anda memerlukan bantuan untuk mengakses data tertentu?",
    isUser: false,
    timestamp: "10:04"
  }
];

const botResponses = [
  "Terima kasih atas pertanyaan Anda. Saya sedang memproses informasi yang Anda butuhkan...",
  "Itu pertanyaan yang bagus! Berdasarkan data terbaru yang saya miliki...",
  "Saya dapat membantu Anda dengan informasi tersebut. Berikut penjelasannya:",
  "Untuk menjawab pertanyaan Anda, ada beberapa hal yang perlu dipertimbangkan:",
  "Berdasarkan kebijakan yang berlaku saat ini, berikut informasi yang dapat saya berikan:"
];

export const useChat = (sessionId = null) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(sessionId || `session_${Date.now()}`);
  const [isLoading, setIsLoading] = useState(true);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, [sessionId]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.id) {
        const response = await chatAPI.getChatHistory(sessionId);
        const chatHistory = response.chat_history || [];
        
        if (chatHistory.length > 0) {
          const formattedMessages = chatHistory.map(msg => ({
            text: msg.message,
            isUser: msg.is_user,
            timestamp: new Date(msg.timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })
          }));
          setMessages(formattedMessages);
        } else {
          // If no history, start with welcome message
          setMessages([{
            text: "Halo! Selamat datang di SmartPol. Saya PICO, asisten virtual yang siap membantu Anda. Ada yang bisa saya bantu hari ini?",
            isUser: false,
            timestamp: new Date().toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })
          }]);
        }
      } else {
        // User not logged in, use dummy messages
        setMessages(dummyMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Fallback to dummy messages on error
      setMessages(dummyMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChatMessage = async (message, isUser) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        await chatAPI.saveChatMessage(message, isUser, currentSessionId);
      }
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const sendMessage = async (text, image = null) => {
    if (!text.trim() && !image) return;

    // Tambah pesan user
    const userMessage = {
      text: text.trim(),
      image: image,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Save user message to database
    await saveChatMessage(text.trim(), true);

    // Simulasi respons bot dengan delay
    setTimeout(async () => {
      let responseText = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      // Jika ada gambar, berikan respons khusus
      if (image) {
        responseText = "Terima kasih telah mengirim gambar! Saya dapat melihat gambar yang Anda kirim. Berdasarkan gambar tersebut, saya akan memberikan analisis atau informasi yang relevan. Apakah ada hal spesifik yang ingin Anda tanyakan tentang gambar ini?";
      }
      
      const botMessage = {
        text: responseText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Save bot message to database
      await saveChatMessage(responseText, false);
    }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5 detik
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const startNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setMessages([{
      text: "Halo! Selamat datang di SmartPol. Saya PICO, asisten virtual yang siap membantu Anda. Ada yang bisa saya bantu hari ini?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }]);
  };

  return {
    messages,
    isTyping,
    isLoading,
    currentSessionId,
    sendMessage,
    clearMessages,
    startNewSession,
    loadChatHistory
  };
};