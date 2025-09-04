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
  FaFileAlt
} from 'react-icons/fa';

const SidebarComponents = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
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
    },
    {
      title: 'Settings',
      icon: <FaCog className="w-5 h-5" />,
      path: '/settings'
    }
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav>
          {menuItems.map((item, index) => (
            <div key={index} className="mb-2">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                    {activeDropdown === index ? (
                      <FaAngleUp className="w-4 h-4" />
                    ) : (
                      <FaAngleDown className="w-4 h-4" />
                    )}
                  </button>
                  {activeDropdown === index && (
                    <div className="ml-8 mt-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
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
                  className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SidebarComponents;
