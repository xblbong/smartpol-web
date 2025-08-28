import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MessageCircle,
  FileText,
  BarChart3,
  Users,
  Settings,
  History,
  Plus,
  Home
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
// import smartpolLogo from "@/assets/smartpol-logo.png";

const navigation = [
  { title: "Chat dengan Pico", url: "/", icon: MessageCircle },
  { title: "Transparansi Kebijakan", url: "/policies", icon: FileText },
  { title: "Polling Kebijakan", url: "/polling", icon: BarChart3 },
  { title: "Credits", url: "/credits", icon: Users },
  { title: "Admin", url: "/admin", icon: Settings },
];

const mockChatHistory = [
  { id: 1, title: "Pertanyaan tentang UU Cipta Kerja", time: "2 jam lalu" },
  { id: 2, title: "Keluhan layanan publik", time: "1 hari lalu" },
  { id: 3, title: "Konsultasi UMKM", time: "3 hari lalu" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={collapsed ? "w-16" : "w-80"} collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className={`${collapsed ? "w-8 h-8" : "w-10 h-10"} bg-primary rounded-lg flex items-center justify-center transition-all`}>
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-primary">SmartPol UB</h1>
              <p className="text-xs text-muted-foreground">Asisten Kebijakan Digital</p>
            </div>
          )}
        </div>
        <SidebarTrigger className="self-end" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Riwayat Chat</SidebarGroupLabel>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {mockChatHistory.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild>
                      <button className="flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-accent text-left w-full">
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate">{chat.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}