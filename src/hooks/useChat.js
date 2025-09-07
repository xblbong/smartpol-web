import { useState, useEffect } from 'react';
import { chatAPI } from '../services/api';

// Initial welcome message
const welcomeMessage = {
  text: "Halo! Selamat datang di SmartPol. Saya PICO, asisten virtual yang siap membantu Anda. Ada yang bisa saya bantu hari ini?",
  isUser: false,
  timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
};

const botResponses = [
  "Terima kasih atas pertanyaan Anda. Saya sedang memproses informasi yang Anda butuhkan...",
  "Itu pertanyaan yang bagus! Berdasarkan data terbaru yang saya miliki...",
  "Saya dapat membantu Anda dengan informasi tersebut. Berikut penjelasannya:",
  "Untuk menjawab pertanyaan Anda, ada beberapa hal yang perlu dipertimbangkan:",
  "Berdasarkan kebijakan yang berlaku saat ini, berikut informasi yang dapat saya berikan:"
];

export const useChat = () => {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChatHistory();
      
      if (response.messages && response.messages.length > 0) {
        const formattedMessages = response.messages.map(msg => ({
          text: msg.message,
          isUser: msg.is_user,
          timestamp: new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages([welcomeMessage, ...formattedMessages]);
        setSessionId(response.session_id);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Keep welcome message if loading fails
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message immediately
    const userMessage = {
      text: text.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Save user message to database
      await chatAPI.saveChatMessage(text.trim(), true, sessionId);

      // Simulate bot response (in real implementation, this would call chatbot API)
      setTimeout(async () => {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        const botMessage = {
          text: randomResponse,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        // Save bot response to database
        try {
          await chatAPI.saveChatMessage(randomResponse, false, sessionId);
        } catch (error) {
          console.error('Error saving bot message:', error);
        }
      }, 1500);
    } catch (error) {
      console.error('Error saving user message:', error);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([welcomeMessage]);
    setSessionId(null);
  };

  return {
    messages,
    isTyping,
    loading,
    sendMessage,
    clearChat,
    loadChatHistory
  };
};