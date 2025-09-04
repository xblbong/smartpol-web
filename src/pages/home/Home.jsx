import React, { useState } from "react";
import AppSidebar from "../../components/layouts/AppSidebar";
import PromptInput from "../../components/layouts/PromptInput";
import ChatContainer from "../../components/ChatContainer";
import ChatHistory from "../../components/ChatHistory";
import { useChat } from "../../hooks/useChat";
import { Image } from "antd";
import { FaBars } from "react-icons/fa";

function Home() {
  const { messages, isTyping, isLoading, currentSessionId, sendMessage, startNewSession, loadChatHistory } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleSelectSession = async (sessionId) => {
    await loadChatHistory(sessionId);
  };
  
  const handleNewChat = () => {
    startNewSession();
  };
  
  const chatBackground = {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8fafc' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
    backgroundColor: "#f8fafc",
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chatHistory={
          <ChatHistory 
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
          />
        }
      />
      <div className="flex-1 flex flex-col" style={chatBackground}>
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b" style={{borderBottomColor: '#01077A'}}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <FaBars size={20} style={{color: '#01077A'}} />
          </button>
          <h1 className="text-lg font-semibold" style={{color: '#01077A'}}>PICO AI</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        {/* Header Chat */}
        <div className="bg-white border-b px-6 py-4 shadow-sm" style={{borderBottomColor: '#FAC62A', borderBottomWidth: '3px'}}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#01077A'}}>
              <Image
                preview={false}
                src="/images/logo.png"
                alt="PICO AI"
                width={24}
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{color: '#01077A'}}>
                PICO AI
              </h2>
              <p className="text-sm" style={{color: '#FAC62A'}}>
                Asisten Virtual SmartPol - Online
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container" data-tutorial="chat-container">
          <ChatContainer messages={messages} />
        </div>

        {/* Input Area */}
        <PromptInput onSendMessage={sendMessage} isTyping={isTyping} />
      </div>
    </div>
  );
}

export default Home;
