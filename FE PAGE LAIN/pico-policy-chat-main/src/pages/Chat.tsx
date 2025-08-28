import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessageSquare, FileText, BarChart3 } from "lucide-react";
import picoMascot from "@/assets/pico-mascot.png";

const Chat = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="h-screen">
        <ChatInterface />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={picoMascot} 
                alt="Pico Assistant" 
                className="w-32 h-32 object-contain animate-bounce-gentle"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary-glow/30 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            SmartPol UB
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Platform interaksi digital dengan Dewan Perwakilan Rakyat melalui 
            chatbot Pico untuk transparansi kebijakan dan partisipasi demokratis
          </p>
        </div>

        {/* Chat Interface Card - Centered */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="overflow-hidden shadow-xl border-2 border-primary/20">
            <div className="bg-primary/5 p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={picoMascot} 
                    alt="Pico" 
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-primary">Chat dengan Pico</h3>
                    <p className="text-sm text-muted-foreground">Mulai percakapan dengan asisten virtual</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowChat(true)}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Mulai Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 bg-card">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <img 
                    src={picoMascot} 
                    alt="Pico" 
                    className="w-8 h-8 object-contain mt-1"
                  />
                  <div className="bg-bot-message border rounded-2xl px-4 py-3 flex-1">
                    <p className="text-sm">
                      Halo! Saya Pico, asisten virtual SmartPol UB. Saya siap membantu Anda dengan:
                    </p>
                    <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                      <li>• Membuat pengaduan atau keluhan</li>
                      <li>• Menanyakan informasi kebijakan</li>
                      <li>• Navigasi ke fitur platform lainnya</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-muted/30 rounded-2xl px-4 py-2 max-w-xs">
                    <p className="text-sm text-muted-foreground italic">
                      Klik "Mulai Chat" untuk memulai percakapan...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Transparansi Kebijakan</h4>
                <p className="text-sm text-muted-foreground">Lihat status kebijakan terkini</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Polling Kebijakan</h4>
                <p className="text-sm text-muted-foreground">Berpartisipasi dalam voting</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Riwayat Chat</h4>
                <p className="text-sm text-muted-foreground">Akses percakapan sebelumnya</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;