import { useState } from 'react';

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

export const useChat = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    // Tambah pesan user
    const userMessage = {
      text: text.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulasi respons bot dengan delay
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        text: randomResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5 detik
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages
  };
};