import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';

const ChatBubble = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{backgroundColor: '#01077A'}}>
            <FaUser className="text-xs" />
          </div>
        ) : (
          <img 
            src="/images/logo.png" 
            alt="Bot Avatar" 
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
      </div>
      
      {/* Message Bubble */}
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
        isUser 
          ? 'text-white rounded-br-md' 
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
      }`} style={isUser ? {backgroundColor: '#01077A'} : {}}>
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;