// ReusableNavbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LeftSidebarNavigation = ({ 
  pageTitle = "Profile",
  showBackButton = true,
  customNavigationOptions = null 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Default navigation options
  const defaultOptions = [
    { id: 1, label: "Profile Settings", value: "profile", icon: "👤" },
    { id: 2, label: "Account Settings", value: "account", icon: "⚙️" },
    { id: 3, label: "Privacy & Security", value: "privacy", icon: "🔒" },
    { id: 4, label: "Notifications", value: "notifications", icon: "🔔" },
    { id: 5, label: "Billing & Payments", value: "billing", icon: "💳" },
    { id: 6, label: "Help & Support", value: "help", icon: "❓" },
    { id: 7, label: "Appearance", value: "appearance", icon: "🎨" },
    { id: 8, label: "Language", value: "language", icon: "🌐" }
  ];

  const navigationOptions = customNavigationOptions || defaultOptions;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (value, label) => {
    console.log("Navigating to:", value);
    alert(`Navigating to: ${label}`);
    // You can add actual navigation logic here
    // navigate(`/${value}`);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 768) {
        if (!event.target.closest('.sidebar') && !event.target.closest('.settings-button')) {
          closeSidebar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          {/* Back Button */}
          {showBackButton && (
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => navigate(-1)} 
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Page Title - Centered */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1 text-center">
            {pageTitle}
          </h1>
          
          {/* Settings Button */}
          <button
            onClick={toggleSidebar}
            className="settings-button p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open settings"
          >
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        sidebar fixed top-0 left-0 h-full bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-80 md:w-64
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
            <button
              onClick={closeSidebar}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Navigate to different sections</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationOptions.map((option) => (
              <li key={option.id}>
                <button
                  onClick={() => handleNavigation(option.value, option.label)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600">
                    {option.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-500">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebarNavigation;