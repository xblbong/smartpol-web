import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FileText, Clock, CheckCircle, XCircle, Edit } from "lucide-react";

interface Policy {
  id: number;
  title: string;
  description: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  date: string;
  category: string;
}

const mockPolicies: Policy[] = [
  {
    id: 1,
    title: "Peraturan Daerah tentang Pengelolaan Sampah",
    description: "Regulasi untuk pengelolaan sampah yang berkelanjutan di wilayah Brawijaya",
    status: "approved",
    date: "2024-01-15",
    category: "Lingkungan"
  },
  {
    id: 2,
    title: "Kebijakan Bantuan UMKM Digital",
    description: "Program bantuan untuk digitalisasi UMKM di sekitar kampus",
    status: "submitted",
    date: "2024-01-20",
    category: "Ekonomi"
  },
  {
    id: 3,
    title: "Inisiatif Transportasi Kampus Hijau",
    description: "Rencana implementasi transportasi ramah lingkungan",
    status: "draft",
    date: "2024-01-25",
    category: "Transportasi"
  },
  {
    id: 4,
    title: "Regulasi Keamanan Siber Mahasiswa",
    description: "Perlindungan data dan privasi dalam ekosistem digital kampus",
    status: "rejected",
    date: "2024-01-10",
    category: "Teknologi"
  }
];

const statusConfig = {
  draft: { label: "Draft", icon: Edit, color: "bg-muted" },
  submitted: { label: "Diajukan", icon: Clock, color: "bg-yellow-500" },
  approved: { label: "Disetujui", icon: CheckCircle, color: "bg-green-500" },
  rejected: { label: "Dibatalkan", icon: XCircle, color: "bg-red-500" }
};

const Policies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || policy.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Transparansi Kebijakan</h1>
        <p className="text-muted-foreground">
          Pantau perkembangan kebijakan dan regulasi dari Dewan Perwakilan Rakyat
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari kebijakan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="submitted">Diajukan</TabsTrigger>
          <TabsTrigger value="approved">Disetujui</TabsTrigger>
          <TabsTrigger value="rejected">Dibatalkan</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredPolicies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada kebijakan ditemukan</h3>
                <p className="text-muted-foreground text-center">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredPolicies.map((policy) => {
                const StatusIcon = statusConfig[policy.status].icon;
                return (
                  <Card key={policy.id} className="hover:shadow-md transition-shadow animate-fade-in">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{policy.title}</CardTitle>
                          <CardDescription>{policy.description}</CardDescription>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${statusConfig[policy.status].color} text-white`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[policy.status].label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Kategori: {policy.category}</span>
                        <span>Tanggal: {new Date(policy.date).toLocaleDateString("id-ID")}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Policies;