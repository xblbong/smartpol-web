import { Image } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import {
  FaHome,
  FaPoll, // Analisis Aspirasi
  FaFileAlt, // Laporan & Statistik
  FaHeart,
  FaUser,
  FaLock,
  FaTimes,
  FaVoteYea, // Komunikasi Publik
  FaGavel, // Manajemen Kebijakan
  FaUserShield,
  FaQuestionCircle
} from "react-icons/fa";
import Tutorial from "../Tutorial";
import ChatHistoryLegislator from "../ChatHistoryLegislator";

const AppSidebarLegislator = ({ isOpen, onToggle, chatHistory }) => {
  const [user, setUser] = useState(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.checkAuth();
        if (response.authenticated) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Warna Aksen Baru
  const accentColor = '#25a7a7'; // Ungu Cerah
  const defaultBlue = '#28b8b8'; // Biru tua untuk teks default dan border

  return (
    <>
      {/* Tutorial Component */}
      <Tutorial visible={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 lg:hidden bg-black bg-opacity-50"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white text-gray-800 flex flex-col h-screen shadow-lg border-r overflow-hidden transform transition-transform duration-300 ease-in-out lg:transform-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`} style={{borderColor: accentColor}}>
        
        {/* Mobile Close Button */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors"
        >
          <FaTimes size={20} />
        </button>
        
        {/* Header Logo */}
        <div className="flex gap-3 items-center justify-center h-20 border-b relative overflow-hidden" style={{backgroundColor: defaultBlue, borderColor: accentColor}}>
          {/* Animated background particles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4 w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: accentColor}}></div>
            <div className="absolute top-6 right-8 w-1 h-1 rounded-full animate-ping" style={{backgroundColor: accentColor, animationDelay: '1s'}}></div>
            <div className="absolute bottom-4 left-8 w-1.5 h-1.5 rounded-full animate-bounce" style={{backgroundColor: accentColor, animationDelay: '2s'}}></div>
            <div className="absolute bottom-2 right-4 w-1 h-1 rounded-full animate-pulse" style={{backgroundColor: accentColor, animationDelay: '0.5s'}}></div>
          </div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                className="rounded-full mr-2 animate-zoom-pulse hover:animate-pulse transition-all duration-300 hover:scale-110"
                preview={false}
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full opacity-0 animate-ping" style={{backgroundColor: accentColor, animationDuration: '3s'}}></div>
            </div>
            <h1 className="text-2xl font-extrabold text-white animate-fade-in-up hover:animate-bounce transition-all duration-300">
              SmartPol
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-auto">
          {/* Main Navigation */}
          <div className="text-xs font-semibold uppercase px-2 mb-2 mt-4 tracking-wider" style={{color: defaultBlue}}>
            Menu Utama
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 group w-full text-left hover:scale-105 hover:shadow-md animate-fade-in-left"
            style={{ color: defaultBlue }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
          >
            <FaHome className="mr-3 group-hover:animate-bounce" />
            Beranda
          </button>
          
          {/* Menu untuk Legislator/Kepala Daerah */}
          <button
            onClick={() => navigate('/analisis-aspirasi')} // Contoh path
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 group w-full text-left hover:scale-105 hover:shadow-md animate-fade-in-left"
            style={{ animationDelay: '0.1s', color: defaultBlue }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
          >
            <FaPoll className="mr-3 group-hover:animate-bounce" />
            Analisis Aspirasi
          </button>
          <button
            onClick={() => navigate('/manajemen-kebijakan')} // Contoh path
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 group w-full text-left hover:scale-105 hover:shadow-md animate-fade-in-left"
            style={{ animationDelay: '0.2s', color: defaultBlue }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
          >
            <FaGavel className="mr-3 group-hover:animate-bounce" />
            Manajemen Kebijakan
          </button>
          <button
            onClick={() => navigate('/laporan-statistik')} // Contoh path
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 group w-full text-left hover:scale-105 hover:shadow-md animate-fade-in-left"
            style={{ animationDelay: '0.3s', color: defaultBlue }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
          >
            <FaFileAlt className="mr-3 group-hover:animate-bounce" />
            Laporan & Statistik
          </button>
          <button
            onClick={() => navigate('/komunikasi-publik')} // Contoh path
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 group w-full text-left hover:scale-105 hover:shadow-md animate-fade-in-left"
            style={{ animationDelay: '0.4s', color: defaultBlue }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
          >
            <FaVoteYea className="mr-3 group-hover:animate-bounce" />
            Komunikasi Publik
          </button>
          
          {user?.is_admin && (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 group w-full text-left hover:scale-105 hover:shadow-md animate-fade-in-left"
              style={{ animationDelay: '0.5s', color: defaultBlue }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
            >
              <FaUserShield className="mr-3 group-hover:animate-bounce" />
              Admin
            </button>
          )}

          {/* Chat History Section - Mungkin bisa diganti dengan "Riwayat Diskusi Internal" jika ada */}
          {ChatHistoryLegislator && (
            <div className="mt-6">
              {chatHistory}
            </div>
          )}

          {/* Informasi Section */}
          <div className="text-xs font-semibold uppercase px-2 mb-2 mt-6 tracking-wider" style={{color: defaultBlue}}>
            Informasi
          </div>
          <button
            onClick={() => setTutorialOpen(true)}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 group w-full text-left hover:scale-105 hover:shadow-md animate-fade-in-left"
            style={{ animationDelay: '0.6s', color: defaultBlue }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
          >
            <FaQuestionCircle className="mr-3 group-hover:animate-bounce" />
            Tutorial Pemakaian
          </button>
          <button
            onClick={() => navigate('/credits')}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 group w-full text-left hover:scale-105 hover:shadow-md animate-fade-in-left"
            style={{ animationDelay: '0.7s', color: defaultBlue, display: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
          >
            <FaHeart className="mr-3 group-hover:animate-bounce" />
            Tentang Tim
          </button>
        </nav>

        {/* Footer Section */}
        <div className="px-4 py-6 border-t bg-white" style={{borderColor: accentColor}}>
          {/* Settings Menu Items */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: '0.1s', color: defaultBlue }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
              data-tutorial="edit-profile"
            >
              <FaUser className="mr-3 group-hover:animate-bounce" />
              Edit Profile
            </button>
            
            <button
              onClick={() => navigate('/nik-verification')}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: '0.2s', color: defaultBlue }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = defaultBlue; }}
              data-tutorial="nik-verification"
            >
              <FaUserShield className="mr-3 group-hover:animate-bounce" />
              Verifikasi NIK
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md animate-fade-in-up"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              style={{animationDelay: '0.3s'}}
            >
              <FaLock className="mr-3 group-hover:animate-bounce" />
              Logout
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center px-3 py-2 mt-4 animate-fade-in-up hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-105" style={{animationDelay: '0.4s'}}>
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover mr-3 shadow-inner border border-gray-200 hover:animate-pulse transition-all duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 shadow-inner hover:animate-pulse transition-all duration-300 ${user?.avatar_url ? 'hidden' : ''}`} 
              style={{backgroundColor: defaultBlue}}
            >
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate transition-colors duration-300" style={{color: defaultBlue}} onMouseEnter={(e) => e.target.style.color = accentColor} onMouseLeave={(e) => e.target.style.color = defaultBlue}>
                {user?.full_name || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSidebarLegislator;