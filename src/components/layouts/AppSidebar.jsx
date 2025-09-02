import { Image } from "antd";
import { useState } from "react";
import {
  FaComments,
  FaBroadcastTower,
  FaPlus,
  FaStar,
  FaHistory,
  FaTachometerAlt,
  FaFileAlt,
  FaKey,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaPalette,
  FaUser,
  FaBell,
  FaLock
} from "react-icons/fa";

const AppSidebar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-64 bg-white text-gray-800 flex flex-col h-screen shadow-lg border-r-1 overflow-hidden" style={{borderRightColor: '#01077A'}}>
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
          PICO AI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* Studio Section */}
        <div className="text-xs font-semibold uppercase px-2 mb-2 mt-4 tracking-wider" style={{color: '#01077A'}}>
          Studio
        </div>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-white transition-colors duration-200 group"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaComments className="mr-3" style={{color: '#1C73FF'}} />
          Chat
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-white transition-colors duration-200 group"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaBroadcastTower className="mr-3" style={{color: '#1C73FF'}} />
          Stream
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-white transition-colors duration-200 group"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaPlus className="mr-3" style={{color: '#1C73FF'}} />
          Generate Media
        </a>

        {/* Build Section */}
        <div className="text-xs font-semibold uppercase px-2 mb-2 mt-6 tracking-wider" style={{color: '#01077A'}}>
          Build
        </div>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-white transition-colors duration-200 group"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaStar className="mr-3" style={{color: '#1C73FF'}} />
          Models
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-white transition-colors duration-200 group"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaHistory className="mr-3" style={{color: '#1C73FF'}} />
          History
        </a>

        {/* Dashboard Section */}
        <div className="text-xs font-semibold uppercase px-2 mb-2 mt-6 tracking-wider" style={{color: '#01077A'}}>
          Dashboard
        </div>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-white transition-colors duration-200 group"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaTachometerAlt className="mr-3" style={{color: '#1C73FF'}} />
          Dashboard
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-white transition-colors duration-200 group"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaFileAlt className="mr-3" style={{color: '#1C73FF'}} />
          Documentation
        </a>
      </nav>

      {/* Footer Section */}
      <div className="px-4 py-6 border-t bg-white" style={{borderTopColor: '#01077A'}}>
        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-white transition-colors duration-200"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAC62A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="flex items-center">
              <FaCog className="mr-3" style={{color: '#1C73FF'}} />
              Settings
            </div>
            {isSettingsOpen ? 
              <FaChevronUp style={{color: '#1C73FF'}} /> : 
              <FaChevronDown style={{color: '#1C73FF'}} />
            }
          </button>
          
          {/* Settings Dropdown */}
          {isSettingsOpen && (
            <div className="mt-2 ml-6 space-y-1">
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs rounded-lg text-gray-600 hover:text-white transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#01077A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaPalette className="mr-2" style={{color: '#FAC62A'}} />
                Theme Colors
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs rounded-lg text-gray-600 hover:text-white transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#01077A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaUser className="mr-2" style={{color: '#FAC62A'}} />
                Profile
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs rounded-lg text-gray-600 hover:text-white transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#01077A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaBell className="mr-2" style={{color: '#FAC62A'}} />
                Notifications
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs rounded-lg text-gray-600 hover:text-white transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#01077A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaLock className="mr-2" style={{color: '#FAC62A'}} />
                Privacy
              </a>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center px-3 py-2 mt-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 shadow-inner" style={{backgroundColor: '#01077A'}}>
            S
          </div>
          <span className="text-sm" style={{color: '#01077A'}}>sbihh.m@gmail.c...</span>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
