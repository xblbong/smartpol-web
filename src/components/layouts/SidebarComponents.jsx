import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaAngleDown,
  FaAngleUp,
  FaPoll,
  FaFileAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { Image } from 'antd';

const SidebarComponents = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaHome className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      title: 'User Management',
      icon: <FaUsers className="w-5 h-5" />,
      submenu: [
        { title: 'All Users', path: '/admin/users' },
        { title: 'Add User', path: '/admin/users/add' },
        { title: 'Roles', path: '/admin/users/roles' }
      ]
    },
    {
      title: 'Polling Management',
      icon: <FaPoll className="w-5 h-5" />,
      path: '/admin/polling'
    },
    {
      title: 'Policies Management',
      icon: <FaFileAlt className="w-5 h-5" />,
      path: '/admin/policies'
    },
    {
      title: 'Reports',
      icon: <FaClipboardList className="w-5 h-5" />,
      submenu: [
        { title: 'Daily Reports', path: '/admin/reports/daily' },
        { title: 'Monthly Reports', path: '/admin/reports/monthly' },
        { title: 'Annual Reports', path: '/admin/reports/annual' },
        { title: 'Polling Reports', path: '/admin/reports/polling' },
        { title: 'Chatbot Reports', path: '/admin/reports/chatbot' }
      ]
    },
    {
      title: 'Analytics',
      icon: <FaChartBar className="w-5 h-5" />,
      path: '/admin/analytics'
    }
  ];

  return (
    <>
      {/* Tombol hamburger untuk mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar} className="text-white text-2xl bg-indigo-950 p-3 rounded-xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg border-r border-gray-800 z-40 transform transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 flex flex-col items-center">
          <Image preview={false} src="/images/logo.png" alt="logo" width={40} height={70} className="mb-3" />
          <h1 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4 text-gray-100">
            SmartPol Admin
          </h1>
          <nav className="space-y-1 w-full">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-indigo-400 group-hover:text-indigo-300">{item.icon}</span>
                        <span className="font-medium text-gray-200 group-hover:text-white">{item.title}</span>
                      </div>
                      <span className="text-gray-400 group-hover:text-gray-300">
                        {activeDropdown === index ? (
                          <FaAngleUp className="w-4 h-4" />
                        ) : (
                          <FaAngleDown className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                    {activeDropdown === index && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-gray-700 pl-4">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className="block p-2 rounded-md hover:bg-gray-800 transition-all duration-200 text-sm text-gray-300 hover:text-white"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-indigo-400 group-hover:text-indigo-300">{item.icon}</span>
                    <span className="font-medium text-gray-200 group-hover:text-white">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SidebarComponents;
