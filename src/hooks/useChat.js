import { useState, useEffect } from 'react';
import { chatAPI, authAPI, reportAPI } from '../services/api';
import { deepseekAPI } from '../services/deepseek';
import { v4 as uuidv4 } from 'uuid';

// Function to get user info from localStorage or API
const getUserInfo = async () => {
  try {
    // First try to get from localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const userData = JSON.parse(userFromStorage);
      return {
        name: userData.full_name || userData.username || 'Pengguna',
        kecamatan: userData.kecamatan || 'Tidak diketahui',
        dapil: userData.dapil || 'Tidak diketahui'
      };
    }
    
    // If not in localStorage, try to get from API
    const response = await authAPI.getProfile();
    if (response.user) {
      const userData = response.user;
      return {
        name: userData.full_name || userData.username || 'Pengguna',
        kecamatan: userData.kecamatan || 'Tidak diketahui',
        dapil: userData.dapil || 'Tidak diketahui'
      };
    }
  } catch (error) {
    console.error('Error getting user info:', error);
  }
  
  return {
    name: 'Pengguna',
    kecamatan: 'Tidak diketahui',
    dapil: 'Tidak diketahui'
  };
};

// Generate personalized welcome message
const generateWelcomeMessage = (userInfo) => {
  const { name, kecamatan, dapil } = userInfo;
  let welcomeText = `🤖 Halo ${name}! Saya PICO, asisten AI dari masa depan yang hadir untuk membantu Anda!`;
  
  if (kecamatan !== 'Tidak diketahui' || dapil !== 'Tidak diketahui') {
    welcomeText += ` Saya melihat Anda berasal dari ${kecamatan !== 'Tidak diketahui' ? `Kecamatan ${kecamatan}` : ''}`;
    if (dapil !== 'Tidak diketahui') {
      welcomeText += `${kecamatan !== 'Tidak diketahui' ? ', ' : ''}Dapil ${dapil}`;
    }
    welcomeText += `.`;
  }
  
  welcomeText += ` Saya di sini untuk memastikan setiap suara warga didengar dan menjembatani komunikasi politik dengan cara yang cerdas, netral, dan penuh integritas. Sebagai sahabat demokrasi, ada yang bisa saya bantu hari ini?`;
  
  return {
    text: welcomeText,
    isUser: false,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };
};

// Handle report creation from AI intent
const handleReportCreation = async (reportData) => {
  try {
    const response = await reportAPI.createReport(reportData);
    
    if (response.message) {
      // Add success message to chat
      const successMessage = {
        text: `✅ Laporan berhasil dibuat! ID Laporan: ${response.report?.id || 'N/A'}. Terima kasih atas partisipasi Anda dalam memperbaiki layanan publik.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, successMessage]);
      }, 1000);
    }
  } catch (error) {
    console.error('Error creating report:', error);
    
    // Add error message to chat
    const errorMessage = {
      text: `❌ Maaf, terjadi kesalahan saat membuat laporan. Silakan coba lagi atau gunakan form laporan manual.`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, errorMessage]);
    }, 1000);
  }
};

// Generate session ID for conversation tracking
const generateSessionId = () => {
  return `session_${Date.now()}_${uuidv4().slice(0, 8)}`;
};

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState(null);

  // Initialize user info and welcome message
  useEffect(() => {
    const initializeChat = async () => {
      const userInfoData = await getUserInfo();
      setUserInfo(userInfoData);
      const welcomeMsg = generateWelcomeMessage(userInfoData);
      setWelcomeMessage(welcomeMsg);
      setMessages([welcomeMsg]);
    };
    
    initializeChat();
  }, []);

  // Load chat history on component mount
  useEffect(() => {
    if (welcomeMessage) {
      loadChatHistory();
    }
  }, [welcomeMessage]);

  const loadChatHistory = async (sessionIdParam = null) => {
    try {
      setLoading(true);
      const response = await chatAPI.getChatHistory(sessionIdParam);
      
      if (response.messages && response.messages.length > 0) {
        const formattedMessages = response.messages.map(msg => ({
          text: msg.message,
          isUser: msg.is_user,
          timestamp: new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages([welcomeMessage, ...formattedMessages]);
        
        // Update session ID if loading specific session
        if (sessionIdParam) {
          setSessionId(sessionIdParam);
        } else if (response.session_id) {
          setSessionId(response.session_id);
        }
        
        // Update conversation history for AI context
        const conversationContext = response.messages.map(msg => ({
          role: msg.is_user ? 'user' : 'assistant',
          content: msg.message
        }));
        setConversationHistory(conversationContext);
        
        // Check if we need to generate summary for this session
        if (conversationContext.length >= 10) {
          // Check if summary already exists for this session
          try {
            const summaryResponse = await fetch(`/api/chat/summary/${sessionIdParam}`, {
              method: 'GET',
              credentials: 'include'
            });
            
            if (summaryResponse.status === 404) {
              // No summary exists, generate one
              await generateConversationSummary(conversationContext);
            }
          } catch (error) {
            console.error('Error checking/generating summary:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Keep welcome message if loading fails
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation commands and smart assistance
  const handleSmartAssistance = (text) => {
    const lowerText = text.toLowerCase();
    
    // Navigation commands
    if (lowerText.includes('lihat polling') || lowerText.includes('polling aktif')) {
      return {
        shouldNavigate: true,
        path: '/polling',
        response: '🗳️ Mengarahkan Anda ke halaman polling aktif...'
      };
    }
    
    if (lowerText.includes('buat polling') || lowerText.includes('polling baru')) {
      return {
        shouldNavigate: true,
        path: '/admin',
        response: '📝 Mengarahkan Anda ke halaman admin untuk membuat polling baru...'
      };
    }
    
    if (lowerText.includes('profil') || lowerText.includes('akun saya')) {
      return {
        shouldNavigate: true,
        path: '/profile',
        response: '👤 Mengarahkan Anda ke halaman profil...'
      };
    }
    
    // Handle polling navigation
    if (lowerText.includes('polling') || lowerText.includes('survei') || 
        lowerText.includes('vote') || lowerText.includes('voting')) {
      return {
        shouldNavigate: true,
        path: '/polling',
        response: 'Mengarahkan Anda ke halaman polling SmartPol...'
      };
    }
    
    // Handle policies navigation
    if (lowerText.includes('kebijakan') || lowerText.includes('policy') || 
        lowerText.includes('policies')) {
      return {
        shouldNavigate: true,
        path: '/policies',
        response: 'Mengarahkan Anda ke halaman kebijakan...'
      };
    }
    
    // Removed automatic navigation for 'laporan'/'report' to allow AI dialog assistance
    
    return { shouldNavigate: false };
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Check for smart assistance commands first
    const assistanceResult = handleSmartAssistance(text.trim());
    
    // Add user message immediately
    const userMessage = {
      text: text.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Handle navigation commands
    if (assistanceResult.shouldNavigate) {
      const navMessage = {
        text: assistanceResult.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        hasNavigation: true,
        navigationPath: assistanceResult.path
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, navMessage]);
        setIsTyping(false);
        
        // Trigger navigation after showing message
        setTimeout(() => {
          window.location.href = assistanceResult.path;
        }, 800);
      }, 500);
      
      return;
    }

    try {
      // Save user message to database
      await chatAPI.saveChatMessage(text.trim(), true, sessionId);

      // Get AI response from DeepSeek API
      try {
        // Create user context for AI
        const userContext = userInfo ? {
          name: userInfo.name,
          kecamatan: userInfo.kecamatan,
          dapil: userInfo.dapil
        } : null;
        
        // Update conversation history with user context
        const updatedHistory = [...conversationHistory, { role: 'user', content: text.trim() }];
        setConversationHistory(updatedHistory);
        
        // Get response from PICO AI with user context
        const aiResponseData = await deepseekAPI.sendMessage(text.trim(), updatedHistory, userContext);
        
        // Extract message from response
        const aiResponse = aiResponseData.success ? aiResponseData.message : aiResponseData.message;
        
        // Check for report intent in AI response
        const reportIntentMatch = aiResponse.match(/REPORT_INTENT:\s*({.*?})/);
        let displayMessage = aiResponse;
        
        if (reportIntentMatch) {
          try {
            const reportData = JSON.parse(reportIntentMatch[1]);
            displayMessage = aiResponse.replace(/REPORT_INTENT:\s*{.*?}/, '').trim();
            
            // Handle report creation
            await handleReportCreation(reportData);
          } catch (error) {
            console.error('Error parsing report intent:', error);
          }
        }
        
        const botMessage = {
          text: displayMessage,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        // Update conversation history with AI response
        setConversationHistory(prev => [...prev, { role: 'assistant', content: displayMessage }]);

        // Save bot response to database
        try {
          await chatAPI.saveChatMessage(aiResponse, false, sessionId);
        } catch (error) {
          console.error('Error saving bot message:', error);
        }
        
        // Check if conversation should be summarized (after 10+ messages)
        if (updatedHistory.length >= 10) {
          await generateConversationSummary(updatedHistory);
        }
        
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorMessage = {
          text: "Maaf, saya mengalami kendala teknis. Silakan coba lagi dalam beberapa saat.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error saving user message:', error);
      setIsTyping(false);
    }
  };

  // Generate conversation summary and check for polling triggers
  const generateConversationSummary = async (history) => {
    try {
      const summary = await deepseekAPI.generateSummary(history);
      const pollingAnalysis = await deepseekAPI.analyzeForPolling(history);
      
      // Save summary to backend
      const summaryData = {
        session_id: sessionId,
        summary: summary.summary,
        topics: JSON.stringify(summary.topics),
        message_count: history.length,
        is_polling_related: pollingAnalysis.isPollingRelated,
        polling_topics: JSON.stringify(pollingAnalysis.suggestedTopics)
      };
      
      await fetch('/api/chat/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(summaryData)
      });
      
      // If polling-related, show notification to user with navigation options
       if (pollingAnalysis.isPollingRelated && pollingAnalysis.suggestedTopics.length > 0) {
         const pollingMessage = {
           text: `🗳️ Berdasarkan diskusi kita, saya menemukan beberapa topik yang mungkin relevan untuk polling: ${pollingAnalysis.suggestedTopics.join(', ')}. \n\n📊 Saya dapat membantu Anda dengan:\n• Melihat polling aktif terkait topik ini\n• Membuat polling baru\n• Melihat hasil polling sebelumnya\n\nKetik "lihat polling" atau "buat polling" untuk melanjutkan!`,
           isUser: false,
           timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
           hasActions: true,
           actions: [
             { type: 'navigate', label: 'Lihat Polling', path: '/polling' },
             { type: 'navigate', label: 'Buat Polling', path: '/admin' }
           ]
         };
         
         setTimeout(() => {
           setMessages(prev => [...prev, pollingMessage]);
         }, 2000);
       }
      
    } catch (error) {
      console.error('Error generating conversation summary:', error);
    }
  };

  const clearChat = async () => {
    // Generate summary for current session if it has enough messages
    if (conversationHistory.length >= 10) {
      try {
        const summaryResponse = await fetch(`/api/chat/summary/${sessionId}`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (summaryResponse.status === 404) {
          // No summary exists, generate one before clearing
          await generateConversationSummary(conversationHistory);
        }
      } catch (error) {
        console.error('Error generating summary before clear:', error);
      }
    }
    
    setMessages([welcomeMessage]);
    setSessionId(generateSessionId());
    setConversationHistory([]);
  };

  const startNewSession = async () => {
    // Generate summary for current session if it has enough messages
    if (conversationHistory.length >= 10) {
      try {
        const summaryResponse = await fetch(`/api/chat/summary/${sessionId}`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (summaryResponse.status === 404) {
          // No summary exists, generate one before starting new session
          await generateConversationSummary(conversationHistory);
        }
      } catch (error) {
        console.error('Error generating summary before new session:', error);
      }
    }
    
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setMessages([welcomeMessage]);
    setConversationHistory([]);
  };

  return {
    messages,
    isTyping,
    loading: loading,
    isLoading: loading,
    currentSessionId: sessionId,
    sendMessage,
    clearChat,
    loadChatHistory,
    startNewSession
  };
};