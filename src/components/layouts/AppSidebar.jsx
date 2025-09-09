import { Image } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import {
  FaHome,
  FaPoll,
  FaFileAlt,
  FaHeart,
  FaUser,
  FaLock,
  FaBars,
  FaTimes,
  FaVoteYea,
  FaGavel,
  FaUserShield,
  FaQuestionCircle
} from "react-icons/fa";
import Tutorial from "../Tutorial";

const AppSidebar = ({ isOpen, onToggle, chatHistory }) => {
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

  return (
    <>
      {/* Tutorial Component */}
      <Tutorial visible={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white text-gray-800 flex flex-col h-screen shadow-lg border-r-1 overflow-hidden transform transition-transform duration-300 ease-in-out lg:transform-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`} style={{borderRightColor: '#01077A'}}>
        
        {/* Mobile Close Button */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-md text-white hover:bg-blue-800 transition-colors"
        >
          <FaTimes size={20} />
        </button>
        
        {/* Header Logo */}
        <div className="flex gap-3 items-center justify-center h-20 border-b" style={{backgroundColor: '#01077A'}}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            className="rounded-full mr-2"
            preview={false}
          />
          <h1 className="text-2xl font-extrabold text-white">
            SmartPol
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-auto">
          {/* Main Navigation */}
          <div className="text-xs font-semibold uppercase px-2 mb-2 mt-4 tracking-wider" style={{color: '#01077A'}}>
            Menu Utama
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-blue-800 hover:text-white transition-colors duration-200 group w-full text-left"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FaHome className="mr-3" />
            Beranda
          </button>
          <button
            onClick={() => navigate('/polling')}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-blue-800 hover:text-white transition-colors duration-200 group w-full text-left"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            data-tutorial="polling"
          >
            <FaVoteYea className="mr-3" />
            Polling
          </button>
          <button
            onClick={() => navigate('/policies')}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-blue-800 hover:text-white transition-colors duration-200 group w-full text-left"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            data-tutorial="kebijakan"
          >
            <FaGavel className="mr-3" />
            Kebijakan
          </button>
          {user?.is_admin && (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-blue-800 hover:text-white transition-colors duration-200 group w-full text-left"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaUserShield className="mr-3" />
              Admin
            </button>
          )}

          {/* Chat History Section */}
          {chatHistory && (
            <div className="mt-6">
              {chatHistory}
            </div>
          )}

          {/* Informasi Section */}
          <div className="text-xs font-semibold uppercase px-2 mb-2 mt-6 tracking-wider" style={{color: '#01077A'}}>
            Informasi
          </div>
          <button
            onClick={() => setTutorialOpen(true)}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-blue-800 hover:text-white transition-colors duration-200 group w-full text-left"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FaQuestionCircle className="mr-3" />
            Tutorial Pemakaian
          </button>
          <button
            onClick={() => navigate('/credits')}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-blue-800 hover:text-white transition-colors duration-200 group w-full text-left"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FaHeart className="mr-3" />
            Tentang Tim
          </button>
        </nav>

        {/* Footer Section */}
        <div className="px-4 py-6 border-t bg-white" style={{borderTopColor: '#01077A'}}>
          {/* Settings Menu Items */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-blue-800 hover:text-white transition-colors duration-200"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              data-tutorial="edit-profile"
            >
              <FaUser className="mr-3" />
              Edit Profile
            </button>
            
            <button
              onClick={() => navigate('/nik-verification')}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-blue-800 hover:text-white transition-colors duration-200"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              data-tutorial="nik-verification"
            >
              <FaUserShield className="mr-3" />
              Verifikasi NIK
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg  text-[#dc2626] hover:text-white transition-colors duration-200"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaLock className="mr-3" />
              Logout
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center px-3 py-2 mt-4">
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover mr-3 shadow-inner border border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 shadow-inner ${user?.avatar_url ? 'hidden' : ''}`} 
              style={{backgroundColor: '#01077A'}}
            >
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{color: '#01077A'}}>
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

export default AppSidebar;
