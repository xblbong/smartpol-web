import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Eye,
  Download,
  Settings
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Pengguna",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Chat Aktif",
      value: "89",
      change: "+5%",
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      title: "Kebijakan Diajukan",
      value: "23",
      change: "+8%",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Partisipasi Polling",
      value: "67%",
      change: "+15%",
      icon: BarChart3,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    { id: 1, type: "chat", user: "Ahmad S.", action: "Membuat pengaduan baru", time: "5 menit lalu" },
    { id: 2, type: "policy", user: "Admin", action: "Menambah kebijakan baru", time: "15 menit lalu" },
    { id: 3, type: "poll", user: "Sari D.", action: "Berpartisipasi dalam polling", time: "30 menit lalu" },
    { id: 4, type: "chat", user: "Budi T.", action: "Menyelesaikan sesi chat", time: "1 jam lalu" },
  ];

  const chatAnalytics = [
    { category: "Pengaduan Layanan", count: 45, percentage: 35 },
    { category: "Pertanyaan Kebijakan", count: 32, percentage: 25 },
    { category: "Konsultasi UMKM", count: 28, percentage: 22 },
    { category: "Informasi Umum", count: 23, percentage: 18 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Admin</h1>
          <p className="text-muted-foreground">Kelola dan pantau aktivitas SmartPol UB</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chats">Chat Management</TabsTrigger>
          <TabsTrigger value="policies">Kebijakan</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="animate-fade-in">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> dari bulan lalu
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activities */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Pantau aktivitas real-time pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.user}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats" className="space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Analisis Percakapan</CardTitle>
              <CardDescription>Kategori dan tren percakapan dengan Pico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chatAnalytics.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.count} percakapan</span>
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Manajemen Kebijakan</CardTitle>
              <CardDescription>Kelola dan moderasi kebijakan yang diajukan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fitur dalam Pengembangan</h3>
                <p className="text-muted-foreground">
                  Manajemen kebijakan akan tersedia dalam versi mendatang
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Manajemen Pengguna</CardTitle>
              <CardDescription>Kelola akun dan hak akses pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fitur dalam Pengembangan</h3>
                <p className="text-muted-foreground">
                  Manajemen pengguna akan tersedia dalam versi mendatang
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;