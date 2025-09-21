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
        nik_verified: userData.nik_verified || false,
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
        nik_verified: userData.nik_verified || false,
        kecamatan: userData.kecamatan || 'Tidak diketahui',
        dapil: userData.dapil || 'Tidak diketahui'
      };
    }
  } catch (error) {
    console.error('Error getting user info:', error);
  }
  
  return {
    name: 'Pengguna',
    nik_verified: false,
    kecamatan: 'Tidak diketahui',
    dapil: 'Tidak diketahui'
  };
};

// Function to check official status
const checkOfficialStatus = async (officialName) => {
  try {
    const response = await fetch(`/api/officials/check-status/${encodeURIComponent(officialName)}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    return { success: false, found: false };
  } catch (error) {
    console.error('Error checking official status:', error);
    return { success: false, found: false };
  }
};

// Function to get smartpol members
const getSmartpolMembers = async () => {
  try {
    const response = await fetch('/api/officials/smartpol-members', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    return { success: false, officials: [] };
  } catch (error) {
    console.error('Error getting smartpol members:', error);
    return { success: false, officials: [] };
  }
};

// Submit aspirasi warga
const submitAspirasi = async (category, subcategory, sessionId) => {
  try {
    const response = await fetch('/api/aspirasi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        category,
        subcategory,
        session_id: sessionId
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.aspirasi };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  } catch (error) {
    console.error('Error submitting aspirasi:', error);
    return { success: false, error: 'Terjadi kesalahan saat mengirim aspirasi' };
  }
};

// Get aspirasi statistics
const getAspirasiStats = async () => {
  try {
    const response = await fetch('/api/aspirasi/stats', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, error: 'Gagal mengambil statistik aspirasi' };
    }
  } catch (error) {
    console.error('Error getting aspirasi stats:', error);
    return { success: false, error: 'Terjadi kesalahan saat mengambil statistik' };
  }
};

// Submit polling publik
const submitPollingPublik = async (questionId, answer, sessionId) => {
  try {
    const response = await fetch('/api/polling-publik', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        question_id: questionId,
        answer,
        session_id: sessionId
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.polling };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  } catch (error) {
    console.error('Error submitting polling:', error);
    return { success: false, error: 'Terjadi kesalahan saat mengirim polling' };
  }
};

// Get polling publik statistics
const getPollingPublikStats = async () => {
  try {
    const response = await fetch('/api/polling-publik/stats', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, error: 'Gagal mengambil statistik polling' };
    }
  } catch (error) {
    console.error('Error getting polling stats:', error);
    return { success: false, error: 'Terjadi kesalahan saat mengambil statistik' };
  }
};

// Get events pendidikan politik
const getEvents = async () => {
  try {
    const response = await fetch('/api/events', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.events };
    } else {
      return { success: false, error: 'Gagal mengambil data event' };
    }
  } catch (error) {
    console.error('Error getting events:', error);
    return { success: false, error: 'Terjadi kesalahan saat mengambil data event' };
  }
};

// Function to generate official persona message
const generateOfficialPersona = (official) => {
  const birthDate = official.birth_date ? new Date(official.birth_date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  }) : 'tidak diketahui';
  
  return `Halo Warga... Assalamualaikum, Salam hormat!

Saya ${official.name}${official.birth_place && official.birth_date ? ` lahir di ${official.birth_place} pada ${birthDate}` : ''}. ${official.education ? official.education + ' ' : ''}Saya sekarang sebagai ${official.position}${official.party ? ` dari ${official.party}` : ''}${official.commission ? ` di ${official.commission}` : ''}${official.commission_focus ? ` yang membidangi ${official.commission_focus}` : ''}.

Bagaimana kabarnya... semoga sehat ya, begitu juga keluarga dirumah ya. Itu yang paling penting.

Gimana warga.. apa yang bisa kami bantu sebagai ${official.position}${official.electoral_district ? ` di ${official.electoral_district}` : ''}${official.commission ? ` ${official.commission}` : ''}......`;
};

// Function to get dapil and officials information
const getDapilInfo = async () => {
  try {
    const response = await fetch('/api/user/dapil-info', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error getting dapil info:', error);
  }
  
  return null;
};

// Generate personalized welcome message
const generateWelcomeMessage = async (userInfo) => {
  const { name, nik_verified } = userInfo;
  
  if (!nik_verified) {
    // Welcome message for unverified users
    let welcomeText = `Assalamualaikum, Salam hormat! Saya Piko, siap menemani Anda menjelajahi SMARTPOL UB\n\n`;
    welcomeText += `Silahkan Sebut Nama sesuai KTP, Alamat Rumah Sesuai KTP: (Alamat RT/RW, Kabupaten/Kota, Kecamatan dan Desa/Kelurahan) harus lengkap ya\n\n`;
    welcomeText += `Dan mau pake Bahasa apa, sebut saja.`;
    
    return {
      text: welcomeText,
      isUser: false,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  } else {
    // Welcome message for verified users with dapil information
    try {
      const dapilInfo = await getDapilInfo();
      
      let welcomeText = `🤖 Halo ${name}! Saya PICO, asisten AI dari masa depan yang hadir untuk membantu Anda!\n\n`;
      
      if (dapilInfo && dapilInfo.dapil) {
        welcomeText += `Terimakasih, anda berada di ${dapilInfo.dapil.name} yakni ${dapilInfo.dapil.description}\n\n`;
        
        // Add officials information
        const officials = dapilInfo.officials;
        
        // Gubernur
        if (officials.gubernur && officials.gubernur.length > 0) {
          const gubernur = officials.gubernur[0];
          welcomeText += `Gubernurnya ${gubernur.name}`;
          if (officials.gubernur.length > 1) {
            welcomeText += ` - wakilnya ${officials.gubernur[1].name}`;
          }
          welcomeText += `.\n`;
        }
        
        // Bupati
        if (officials.bupati && officials.bupati.length > 0) {
          const bupati = officials.bupati[0];
          welcomeText += `Bupati anda Adalah ${bupati.name}`;
          if (officials.bupati.length > 1) {
            welcomeText += ` dan Wakil Bupati ${officials.bupati[1].name}`;
          }
          welcomeText += `\n`;
        }
        
        // Walikota
        if (officials.walikota && officials.walikota.length > 0) {
          const walikota = officials.walikota[0];
          welcomeText += `Walikota anda Adalah ${walikota.name}`;
          if (officials.walikota.length > 1) {
            welcomeText += ` dan Wakil Walikota ${officials.walikota[1].name}`;
          }
          welcomeText += `\n`;
        }
        
        // Anggota DPR RI
        if (officials.dpri && officials.dpri.length > 0) {
          welcomeText += `\nAnggota DPR RI nya:\n`;
          officials.dpri.forEach((dpri, index) => {
            welcomeText += `${index + 1}. ${dpri.name}`;
            if (dpri.party) {
              welcomeText += ` (${dpri.party})`;
            }
            welcomeText += `\n`;
          });
        }
        
        // Anggota DPRD Provinsi
        if (officials.dprd_provinsi && officials.dprd_provinsi.length > 0) {
          welcomeText += `\nDan anggota DPRD Provinsinya:\n`;
          officials.dprd_provinsi.forEach((dprd, index) => {
            welcomeText += `${index + 1}. ${dprd.name}`;
            if (dprd.party) {
              welcomeText += ` (${dprd.party})`;
            }
            welcomeText += `\n`;
          });
        }
        
        // Anggota DPRD Kota/Kabupaten
        if (officials.dprd_kota && officials.dprd_kota.length > 0) {
          welcomeText += `\nSementara anggota DPRD Kota/Kabupaten sbb:\n`;
          officials.dprd_kota.forEach((dprd, index) => {
            welcomeText += `${index + 1}. ${dprd.name}`;
            if (dprd.party) {
              welcomeText += ` (${dprd.party})`;
            }
            welcomeText += `\n`;
          });
        }
        
        welcomeText += `\nAnda mau dihubungkankan dengan siapa, sebutkan saja?`;
      } else {
        welcomeText += `Saya di sini untuk memastikan setiap suara warga didengar dan menjembatani komunikasi politik dengan cara yang cerdas, netral, dan penuh integritas. Sebagai sahabat demokrasi, ada yang bisa saya bantu hari ini?`;
      }
      
      return {
        text: welcomeText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
    } catch (error) {
      console.error('Error generating welcome message with dapil info:', error);
      
      // Fallback welcome message
      let welcomeText = `🤖 Halo ${name}! Saya PICO, asisten AI dari masa depan yang hadir untuk membantu Anda!`;
      welcomeText += ` Saya di sini untuk memastikan setiap suara warga didengar dan menjembatani komunikasi politik dengan cara yang cerdas, netral, dan penuh integritas. Sebagai sahabat demokrasi, ada yang bisa saya bantu hari ini?`;
      
      return {
        text: welcomeText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
    }
  }
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
  const [currentPersona, setCurrentPersona] = useState('pico'); // 'pico' or 'official'
  const [currentOfficial, setCurrentOfficial] = useState(null);
  const [smartpolMembers, setSmartpolMembers] = useState([]);

  // Initialize user info and welcome message
  useEffect(() => {
    const initializeChat = async () => {
      const userInfoData = await getUserInfo();
      setUserInfo(userInfoData);
      const welcomeMsg = await generateWelcomeMessage(userInfoData);
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

  // Function to switch to official persona
  const switchToOfficialPersona = async (officialName) => {
    try {
      const statusResult = await checkOfficialStatus(officialName);
      
      if (!statusResult.found) {
        return {
          success: false,
          message: `Maaf warga... ${officialName} tidak ditemukan dalam database pejabat.`
        };
      }
      
      if (!statusResult.status_smartpol) {
        // Get smartpol members for suggestion
        const membersResult = await getSmartpolMembers();
        const memberNames = membersResult.officials?.map(o => o.name).join(', ') || 'pejabat lain';
        
        return {
          success: false,
          message: `Maaf warga... ${statusResult.official.name} belum mengikuti program SMARTPOL UB. Mungkin warga bisa pilih anggota DPR RI yang lain... sebutkan: ${memberNames}`
        };
      }
      
      // Additional validation for kepala daerah (head of region)
      if (statusResult.official.role === 'pimpinan_daerah') {
        // For kepala daerah, ensure they are specifically registered and active in SmartPol
        if (statusResult.official.status_smartpol !== 1) {
          const membersResult = await getSmartpolMembers();
          let membersList = '';
          
          if (membersResult.officials && membersResult.officials.length > 0) {
            const headOfRegionMembers = membersResult.officials.filter(member => member.role === 'pimpinan_daerah');
            if (headOfRegionMembers.length > 0) {
              membersList = '\n\nKepala Daerah yang terdaftar di SmartPol:\n';
              headOfRegionMembers.forEach((member, index) => {
                membersList += `${index + 1}. ${member.name} (${member.position})`;
                if (member.electoral_district) {
                  membersList += ` - ${member.electoral_district}`;
                }
                membersList += '\n';
              });
            }
          }
          
          return {
            success: false,
            message: `Maaf warga... ${statusResult.official.name} sebagai ${statusResult.official.position} belum aktif di platform SmartPol. Hanya kepala daerah yang telah terdaftar dan aktif yang dapat berkomunikasi langsung.${membersList}`
          };
        }
      }
      
      // Switch to official persona
      setCurrentPersona('official');
      setCurrentOfficial(statusResult.official);
      
      const personaMessage = generateOfficialPersona(statusResult.official);
      
      return {
        success: true,
        message: `Baik warga... saya akan panggil ${statusResult.official.name} sebagai ${statusResult.official.position}${statusResult.official.party ? ` dari ${statusResult.official.party}` : ''}.

Silahkan berkomunikasi ya...

${personaMessage}`
      };
      
    } catch (error) {
      console.error('Error switching persona:', error);
      return {
        success: false,
        message: 'Maaf, terjadi kesalahan saat menghubungi pejabat tersebut.'
      };
    }
  };
  
  // Function to switch back to Pico persona
  const switchToPicoPersona = () => {
    setCurrentPersona('pico');
    setCurrentOfficial(null);
    return 'Halo! Saya Pico, asisten virtual SmartPol. Ada yang bisa saya bantu?';
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

    const lowerText = text.trim().toLowerCase();
    
    // Check if user wants to switch back to Pico
    if (currentPersona === 'official' && (lowerText.includes('pico') || lowerText.includes('ganti pejabat') || lowerText.includes('bicara dengan') || lowerText.includes('hubungi'))) {
      const picoMessage = switchToPicoPersona();
      
      const botMessage = {
        text: picoMessage,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      
      const userMessage = {
        text: text.trim(),
        isUser: true,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, userMessage, botMessage]);
      return;
    }
    
    // Check if user wants to communicate with an official (when in Pico mode)
    if (currentPersona === 'pico' && (lowerText.includes('bicara dengan') || lowerText.includes('hubungi') || lowerText.includes('komunikasi dengan'))) {
      // Extract official name from the message
      const words = text.trim().split(' ');
      let officialName = '';
      
      // Simple name extraction - look for words after "dengan" or "hubungi"
      const triggerWords = ['dengan', 'hubungi'];
      for (const trigger of triggerWords) {
        const index = words.findIndex(word => word.toLowerCase().includes(trigger));
        if (index !== -1 && index < words.length - 1) {
          officialName = words.slice(index + 1).join(' ');
          break;
        }
      }
      
      if (officialName) {
        const userMessage = {
          text: text.trim(),
          isUser: true,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        
        const switchResult = await switchToOfficialPersona(officialName);
        
        const botMessage = {
          text: switchResult.message,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        return;
      }
    }

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
        
        // Create official context if in official persona
        const officialContext = currentPersona === 'official' && currentOfficial ? {
          persona: 'official',
          name: currentOfficial.name,
          position: currentOfficial.position,
          party: currentOfficial.party,
          bio: currentOfficial.bio,
          birth_date: currentOfficial.birth_date,
          birth_place: currentOfficial.birth_place,
          education: currentOfficial.education,
          commission: currentOfficial.commission,
          commission_focus: currentOfficial.commission_focus,
          dapil: currentOfficial.dapil
        } : null;
        
        // Update conversation history with user context
        const updatedHistory = [...conversationHistory, { role: 'user', content: text.trim() }];
        setConversationHistory(updatedHistory);
        
        // Get response from AI with appropriate context
        const aiResponseData = currentPersona === 'official' 
          ? await deepseekAPI.sendOfficialMessage(text.trim(), updatedHistory, userContext, officialContext)
          : await deepseekAPI.sendMessage(text.trim(), updatedHistory, userContext);
        
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
    currentPersona,
    currentOfficial,
    smartpolMembers,
    sendMessage,
    clearChat,
    loadChatHistory,
    startNewSession,
    switchToOfficialPersona,
    switchToPicoPersona,
    checkOfficialStatus,
    getSmartpolMembers,
    submitAspirasi: (category, subcategory) => submitAspirasi(category, subcategory, sessionId),
    getAspirasiStats,
    submitPollingPublik: (questionId, answer) => submitPollingPublik(questionId, answer, sessionId),
    getPollingPublikStats,
    getEvents
  };
};