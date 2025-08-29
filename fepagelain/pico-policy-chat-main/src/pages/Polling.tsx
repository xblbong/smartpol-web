import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Clock, CheckCircle } from "lucide-react";

interface Poll {
  id: number;
  title: string;
  description: string;
  options: { id: number; text: string; votes: number }[];
  totalVotes: number;
  endDate: string;
  status: "active" | "ended";
  category: string;
}

const mockPolls: Poll[] = [
  {
    id: 1,
    title: "Prioritas Pengembangan Infrastruktur Kampus",
    description: "Manakah yang harus diprioritaskan untuk pengembangan infrastruktur kampus tahun ini?",
    options: [
      { id: 1, text: "Renovasi perpustakaan", votes: 152 },
      { id: 2, text: "Pembangunan laboratorium baru", votes: 203 },
      { id: 3, text: "Perbaikan fasilitas olahraga", votes: 89 },
      { id: 4, text: "Peningkatan jaringan internet", votes: 278 }
    ],
    totalVotes: 722,
    endDate: "2024-02-15",
    status: "active",
    category: "Infrastruktur"
  },
  {
    id: 2,
    title: "Kebijakan Jam Operasional Perpustakaan",
    description: "Bagaimana pendapat Anda tentang perpanjangan jam operasional perpustakaan?",
    options: [
      { id: 1, text: "Sangat setuju (24 jam)", votes: 89 },
      { id: 2, text: "Setuju (sampai jam 10 malam)", votes: 156 },
      { id: 3, text: "Netral", votes: 45 },
      { id: 4, text: "Tidak setuju", votes: 23 }
    ],
    totalVotes: 313,
    endDate: "2024-01-30",
    status: "ended",
    category: "Layanan"
  }
];

const Polling = () => {
  const [votedPolls, setVotedPolls] = useState<Set<number>>(new Set());

  const handleVote = (pollId: number, optionId: number) => {
    setVotedPolls(prev => new Set(prev).add(pollId));
    // Here you would typically send the vote to your backend
    console.log(`Voted for option ${optionId} in poll ${pollId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Polling Kebijakan</h1>
        <p className="text-muted-foreground">
          Berpartisipasi dalam pengambilan keputusan melalui polling demokratis
        </p>
      </div>

      <div className="grid gap-6">
        {mockPolls.map((poll) => {
          const hasVoted = votedPolls.has(poll.id);
          const isActive = poll.status === "active";
          
          return (
            <Card key={poll.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{poll.title}</CardTitle>
                    <CardDescription>{poll.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{poll.category}</Badge>
                    <Badge 
                      variant={isActive ? "default" : "secondary"}
                      className={isActive ? "bg-green-500" : ""}
                    >
                      {isActive ? (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Selesai
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {poll.options.map((option) => {
                    const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                    
                    return (
                      <div key={option.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{option.text}</span>
                          {(hasVoted || !isActive) && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {option.votes} suara
                              </span>
                              <span className="text-sm font-medium">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {hasVoted || !isActive ? (
                          <Progress value={percentage} className="h-2" />
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full justify-start hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleVote(poll.id, option.id)}
                          >
                            {option.text}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{poll.totalVotes} total suara</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">
                      Berakhir: {new Date(poll.endDate).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>

                {hasVoted && isActive && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      ✓ Terima kasih! Suara Anda telah berhasil dicatat.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Polling;