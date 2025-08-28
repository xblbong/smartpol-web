import { useState, useRef, useEffect } from "react";
import { Send, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import picoMascot from "@/assets/pico-mascot.png";
// import picoFull from "@/assets/pico-full.png";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Halo! Saya Pico, asisten virtual SmartPol UB. Saya siap membantu Anda dengan pertanyaan kebijakan, pengaduan, atau navigasi ke fitur lainnya. Ada yang bisa saya bantu hari ini?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);
      setInputValue("");
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: `Terima kasih atas pesan Anda: "${inputValue}". Saya sedang memproses permintaan Anda. Untuk pengaduan resmi, silakan berikan detail lebih lanjut mengenai masalah yang Anda hadapi.`,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Chat Header */}
      <div className="border-b bg-card p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={picoMascot} alt="Pico" />
          <AvatarFallback>PI</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-lg">Pico</h2>
          <p className="text-sm text-muted-foreground">Asisten Virtual SmartPol UB</p>
        </div>
      </div>

      {/* Welcome Section with Pico */}
      {messages.length === 1 && (
        <div className="flex flex-col items-center justify-center py-12 bg-gradient-subtle">
          <div className="relative mb-8">
            <div className="relative w-64 h-64 mx-auto">
              <img 
                src={picoMascot} 
                alt="Pico Assistant" 
                className="w-full h-full object-contain animate-bounce-gentle"
              />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary-glow/30 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            </div>
          </div>
          <div className="text-center max-w-lg mx-auto px-4">
            <h3 className="text-3xl font-bold text-primary mb-4">Halo! Saya Pico</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Asisten virtual SmartPol UB siap membantu Anda dengan pertanyaan kebijakan, 
              pengaduan, atau navigasi platform. Mari mulai percakapan!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                💬 Buat Pengaduan
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                📋 Lihat Kebijakan
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                🗳️ Ikut Polling
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {message.sender === "bot" && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={picoMascot} alt="Pico" />
                    <AvatarFallback>PI</AvatarFallback>
                  </Avatar>
                  <div className="bg-bot-message text-bot-foreground border rounded-2xl px-4 py-3 max-w-[70%]">
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
              
              {message.sender === "user" && (
                <div className="bg-user-message text-user-foreground rounded-2xl px-4 py-3 max-w-[70%]">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={picoMascot} alt="Pico" />
                  <AvatarFallback>PI</AvatarFallback>
                </Avatar>
                <div className="bg-bot-message text-bot-foreground border rounded-2xl px-4 py-3 max-w-[70%]">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce-gentle"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce-gentle" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce-gentle" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-xs ml-2 text-muted-foreground">Pico sedang mengetik...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda di sini..."
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-10 w-10 bg-gradient-primary hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}