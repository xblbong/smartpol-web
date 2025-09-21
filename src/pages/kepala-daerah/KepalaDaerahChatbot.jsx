import React, { useState, useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import { Card, Typography, Spin } from "antd";
import { FaBars, FaUser, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import AppSidebarLegislator from "../../components/layouts/AppSidebarLegislator";
import ChatHistoryLegislator from "../../components/ChatHistoryLegislator";
import PromptInputLegislator from "../../components/layouts/PromptInputLegislator";
import { authAPI } from "../../services/api";

const { Title, Text, Paragraph } = Typography;

function KepalaDaerahChatbot() {
  const { messages, isTyping, isLoading, currentSessionId, sendMessage, startNewSession, loadChatHistoryLegislator } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [pikoMessages, setPikoMessages] = useState([]);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
    
    // Initialize PIKO welcome message
    if (showWelcome) {
      const welcomeMessage = {
        id: 'welcome-piko',
        content: `Selamat datang di PIKO (Platform Informasi Kepala Daerah Online)! 🏛️\n\nSaya adalah asisten AI yang akan membantu Anda mengakses informasi terkini tentang aspirasi dan laporan warga. Berikut yang bisa saya bantu:\n\n📊 **Laporan Terbaru**: Melihat aspirasi warga yang masuk hari ini\n📈 **Analisis Data**: Statistik dan tren laporan masyarakat\n🗺️ **Pemetaan Wilayah**: Sebaran laporan berdasarkan kecamatan\n📋 **Kategori Laporan**: Infrastruktur, kesehatan, pendidikan, dll\n\nAda yang ingin Anda ketahui tentang kondisi daerah hari ini?`,
        sender: 'piko',
        timestamp: new Date().toISOString(),
        type: 'welcome'
      };
      setPikoMessages([welcomeMessage]);
      fetchRecentReports();
    }
  }, [showWelcome]);

  const fetchRecentReports = async () => {
    try {
      setLoadingReports(true);
      const response = await fetch('/api/reports/recent?limit=5');
      if (response.ok) {
        const data = await response.json();
        setRecentReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Set dummy data for demo
      setRecentReports([
        {
          id: 1,
          title: "Jalan Rusak di Kecamatan Bandung Wetan",
          description: "Jalan berlubang menyebabkan kemacetan dan membahayakan pengendara",
          category: "Infrastruktur",
          user_name: "Ahmad Sudrajat",
          user_kecamatan: "Bandung Wetan",
          user_kelurahan: "Cihapit",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Kurangnya Fasilitas Kesehatan",
          description: "Puskesmas kekurangan tenaga medis dan obat-obatan",
          category: "Kesehatan",
          user_name: "Siti Nurhaliza",
          user_kecamatan: "Coblong",
          user_kelurahan: "Lebak Gede",
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          title: "Sekolah Membutuhkan Renovasi",
          description: "Atap bocor dan fasilitas pembelajaran tidak memadai",
          category: "Pendidikan",
          user_name: "Budi Santoso",
          user_kecamatan: "Cicendo",
          user_kelurahan: "Arjuna",
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
    } finally {
      setLoadingReports(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam lalu`;
    return `${Math.floor(diffInMinutes / 1440)} hari lalu`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Infrastruktur': '#f59e0b',
      'Kesehatan': '#ef4444',
      'Pendidikan': '#3b82f6',
      'Lingkungan': '#10b981',
      'Keamanan': '#8b5cf6',
      'default': '#6b7280'
    };
    return colors[category] || colors.default;
  };

  const handleNewChat = () => {
    startNewSession();
    setShowWelcome(true);
  };

  const chatBackground = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh'
  };

  return (
    <div className="flex h-screen bg-gray-100" style={chatBackground}>
      <AppSidebarLegislator 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        currentSessionId={currentSessionId}
      />
      
      <div className="flex-1 flex flex-col relative">
        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white/95 backdrop-blur-sm m-4 rounded-xl shadow-2xl overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* PIKO Messages */}
            {pikoMessages.map((message, index) => (
              <div key={message.id || index} className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-sm">PIKO</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                    <Paragraph className="!mb-0 text-gray-800 whitespace-pre-wrap">
                      {message.content}
                    </Paragraph>
                    
                    {/* Recent Reports Section */}
                    {message.type === 'welcome' && (
                      <div className="mt-4 space-y-3">
                        <Title level={5} className="!mb-2 text-purple-700">📋 Aspirasi Warga Terbaru:</Title>
                        {loadingReports ? (
                          <div className="flex items-center justify-center py-4">
                            <Spin size="small" />
                            <Text className="ml-2 text-gray-600">Memuat data...</Text>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {recentReports.slice(0, 3).map((report, idx) => (
                              <Card key={report.id} size="small" className="border-l-4 hover:shadow-md transition-shadow" style={{borderLeftColor: getCategoryColor(report.category)}}>
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FaUser className="text-gray-600 text-xs" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Text strong className="text-sm">{report.user_name}</Text>
                                      <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                      <Text className="text-xs text-gray-500">
                                        {report.user_kecamatan && `Kec. ${report.user_kecamatan}`}
                                        {report.user_kelurahan && `, Kel. ${report.user_kelurahan}`}
                                      </Text>
                                    </div>
                                    <Title level={5} className="!mb-1">{report.title}</Title>
                                    <Paragraph className="!mb-2 text-gray-700 text-sm" ellipsis={{rows: 2}}>
                                      {report.description}
                                    </Paragraph>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span className="px-2 py-1 rounded-full" style={{backgroundColor: getCategoryColor(report.category) + '20', color: getCategoryColor(report.category)}}>
                                        {report.category}
                                      </span>
                                      <div className="flex items-center space-x-1">
                                        <FaClock />
                                        <span>{formatTimeAgo(report.created_at)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                            
                            {recentReports.length > 3 && (
                              <div className="text-center">
                                <Text className="text-gray-500 text-sm">
                                  Dan {recentReports.length - 3} laporan lainnya...
                                </Text>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Regular Chat Messages */}
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-br from-green-500 to-green-600' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  <span className="text-white font-bold text-sm">
                    {message.sender === 'user' ? 'U' : 'PIKO'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className={`rounded-lg p-4 ${
                    message.sender === 'user' 
                      ? 'bg-green-50 ml-auto max-w-[80%]' 
                      : 'bg-blue-50'
                  }`}>
                    <Paragraph className="!mb-0 text-gray-800 whitespace-pre-wrap">
                      {message.content}
                    </Paragraph>
                  </div>
                  <div className={`flex items-center space-x-2 mt-2 ${
                    message.sender === 'user' ? 'justify-end' : ''
                  }`}>
                    <FaClock className="text-gray-400 text-xs" />
                    <Text className="text-xs text-gray-500">
                      {message.timestamp ? new Date(message.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Sekarang'}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">PIKO</span>
                </div>
                <div className="flex-1">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t bg-gray-50 p-4">
            <PromptInputLegislator
              onSendMessage={sendMessage}
              disabled={isLoading}
              isTyping={isTyping}
              placeholder="Tanyakan sesuatu kepada PIKO..."
            />
          </div>
        </div>
        
        {/* Background Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-4 h-4 rounded-full animate-pulse" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)'}}></div>
          <div className="absolute top-[30%] right-[10%] w-6 h-6 rounded-full animate-pulse" style={{backgroundColor: 'rgba(59, 130, 246, 0.08)', animationDelay: '2s'}}></div>
          <div className="absolute top-[60%] left-[25%] w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: 'rgba(59, 130, 246, 0.06)', animationDelay: '4s'}}></div>
        </div>
      </div>
    </div>
  );
}

export default KepalaDaerahChatbot;