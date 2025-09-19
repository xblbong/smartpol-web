import React, { useState } from "react";
import ChatContainer from "../../components/ChatContainer";
import { useChat } from "../../hooks/useChat";
import { Image } from "antd";
import { FaBars } from "react-icons/fa";
import AppSidebarLegislator from "../../components/layouts/AppSidebarLegislator";
import ChatHistoryLegislator from "../../components/ChatHistoryLegislator";
import PromptInputLegislator from "../../components/layouts/PromptInputLegislator";
import ChatContainerLegislator from "../../components/ChatContainerLegislator";

function KepalaDaerahChatbot() {
  const { messages, isTyping, isLoading, currentSessionId, sendMessage, startNewSession, loadChatHistoryLegislator } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleSelectSession = async (sessionId) => {
    await loadChatHistoryLegislator(sessionId);
  };
  
  const handleNewChat = async () => {
    await startNewSession();
  };
  
  const chatBackground = {
    background: `
      radial-gradient(circle at 20% 80%, rgba(1, 7, 122, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(250, 198, 42, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(1, 7, 122, 0.05) 0%, transparent 50%),
      linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)
    `,
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className="flex h-screen bg-gray-50 ">
      <AppSidebarLegislator 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chatHistory={
          <ChatHistoryLegislator
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            currentSessionId={currentSessionId}
          />
        }
      />
      <div className="flex-1 flex flex-col" style={chatBackground}>
        {/* Animated Background Elements - Enhanced */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating circles - More variety */}
          <div className="absolute top-[10%] left-[5%] w-4 h-4 rounded-full animate-float-slow" style={{backgroundColor: 'rgba(1, 7, 122, 0.1)', animationDelay: '0s'}}></div>
          <div className="absolute top-[30%] right-[10%] w-6 h-6 rounded-full animate-float" style={{backgroundColor: 'rgba(250, 198, 42, 0.1)', animationDelay: '2s'}}></div>
          <div className="absolute top-[60%] left-[25%] w-3 h-3 rounded-full animate-pulse-size" style={{backgroundColor: 'rgba(1, 7, 122, 0.08)', animationDelay: '4s'}}></div>
          <div className="absolute top-[80%] right-[30%] w-5 h-5 rounded-full animate-float-slow" style={{backgroundColor: 'rgba(250, 198, 42, 0.08)', animationDelay: '1s'}}></div>
          <div className="absolute top-[15%] left-[65%] w-2 h-2 rounded-full animate-float" style={{backgroundColor: 'rgba(1, 7, 122, 0.12)', animationDelay: '3s'}}></div>
          <div className="absolute top-[45%] left-[5%] w-7 h-7 rounded-full animate-pulse-size" style={{backgroundColor: 'rgba(250, 198, 42, 0.05)', animationDelay: '5s'}}></div>
          <div className="absolute top-[70%] right-[5%] w-4 h-4 rounded-full animate-float" style={{backgroundColor: 'rgba(1, 7, 122, 0.07)', animationDelay: '2.5s'}}></div>
          
          {/* Floating squares - More variety and rotation */}
          <div className="absolute top-[12%] right-[15%] w-3 h-3 rotate-45 animate-float-rotate" style={{backgroundColor: 'rgba(250, 198, 42, 0.06)', animationDelay: '1.5s'}}></div>
          <div className="absolute top-[50%] left-[10%] w-4 h-4 rotate-45 animate-float-rotate-slow" style={{backgroundColor: 'rgba(1, 7, 122, 0.06)', animationDelay: '3.5s'}}></div>
          <div className="absolute top-[75%] right-[20%] w-2 h-2 rotate-45 animate-float" style={{backgroundColor: 'rgba(250, 198, 42, 0.1)', animationDelay: '0.5s'}}></div>
          <div className="absolute top-[25%] left-[40%] w-5 h-5 rotate-45 animate-pulse-size" style={{backgroundColor: 'rgba(1, 7, 122, 0.09)', animationDelay: '4.8s'}}></div>
          
          {/* Floating triangles - More variety and rotation */}
          <div className="absolute top-[35%] left-[50%] w-0 h-0 animate-float-rotate-slow" style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '12px solid rgba(1, 7, 122, 0.08)',
            animationDelay: '2.5s'
          }}></div>
          <div className="absolute top-[55%] right-[10%] w-0 h-0 animate-float-rotate" style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '10px solid rgba(250, 198, 42, 0.08)',
            animationDelay: '4.5s'
          }}></div>
          <div className="absolute top-[85%] left-[15%] w-0 h-0 animate-float-slow" style={{
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '15px solid rgba(1, 7, 122, 0.06)',
            animationDelay: '1.8s'
          }}></div>

          {/* New: Small Hexagons */}
          <div className="absolute top-[20%] left-[80%] w-4 h-4 animate-float-slow" style={{
            backgroundColor: 'rgba(250, 198, 42, 0.07)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animationDelay: '0.7s'
          }}></div>
          <div className="absolute top-[65%] left-[30%] w-3 h-3 animate-float" style={{
            backgroundColor: 'rgba(1, 7, 122, 0.05)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animationDelay: '3.2s'
          }}></div>

          {/* New: Very small particles/dots for a subtle "dust" effect */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-float-tiny"
              style={{
                backgroundColor: `rgba(${i % 2 === 0 ? '1, 7, 122' : '250, 198, 42'}, ${0.03 + Math.random() * 0.04})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b animate-fade-in-down relative z-10" style={{borderBottomColor: '#25a7a7'}}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:animate-pulse"
          >
            <FaBars size={20} style={{color: '#25a7a7'}} />
          </button>
          <h1 className="text-lg font-semibold hover:animate-bounce transition-all duration-300" style={{color: '#25a7a7'}}>PICO AI</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        {/* Header Chat */}
        <div className="bg-white border-b px-6 py-4 shadow-sm animate-fade-in-down relative z-10" style={{borderBottomColor: '#FAC62A', borderBottomWidth: '3px', animationDelay: '0.1s'}}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center relative hover:animate-pulse transition-all duration-300 hover:scale-110" style={{backgroundColor: '#25a7a7'}}>
              <Image
                preview={false}
                src="/images/logo.png"
                alt="PICO AI"
                width={24}
                className="rounded-full animate-zoom-pulse"
              />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold hover:animate-bounce transition-all duration-300" style={{color: '#25a7a7'}}>
                PICO AI
              </h2>
              <p className="text-sm animate-pulse" style={{color: '#FAC62A'}}>
                Asisten Virtual SmartPol - Online
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container flex-1 overflow-auto pb-24 relative z-10" data-tutorial="chat-container">
          <ChatContainerLegislator messages={messages} />
        </div>

        {/* Input Area - Now Fixed */}
        <PromptInputLegislator onSendMessage={sendMessage} isTyping={isTyping} />
      </div>
    </div>
  );
}

export default KepalaDaerahChatbot;