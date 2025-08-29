import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Ahmad Rizki",
    role: "Full Stack Developer",
    description: "Lead developer and system architect",
    skills: ["React", "Node.js", "PostgreSQL"],
    github: "ahmadrizki",
    linkedin: "ahmad-rizki",
    email: "ahmad.rizki@ub.ac.id"
  },
  {
    name: "Sari Dewi",
    role: "UI/UX Designer",
    description: "User experience and interface design specialist",
    skills: ["Figma", "Design Systems", "User Research"],
    github: "saridewi",
    linkedin: "sari-dewi",
    email: "sari.dewi@ub.ac.id"
  },
  {
    name: "Budi Santoso",
    role: "AI/ML Engineer",
    description: "Chatbot and natural language processing specialist",
    skills: ["Python", "TensorFlow", "NLP"],
    github: "budisantoso",
    linkedin: "budi-santoso",
    email: "budi.santoso@ub.ac.id"
  },
  {
    name: "Lisa Maharani",
    role: "Project Manager",
    description: "Project coordination and stakeholder management",
    skills: ["Agile", "Scrum", "Stakeholder Management"],
    github: "lisamaharani",
    linkedin: "lisa-maharani",
    email: "lisa.maharani@ub.ac.id"
  }
];

const technologies = [
  "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", 
  "OpenAI GPT", "Supabase", "Vercel", "Figma", "Git"
];

const Credits = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Tim Pengembang</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          SmartPol UB dikembangkan oleh tim mahasiswa Universitas Brawijaya 
          dengan dedikasi untuk meningkatkan transparansi dan partisipasi demokratis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">{member.name}</CardTitle>
              <CardDescription className="text-primary font-semibold">
                {member.role}
              </CardDescription>
              <p className="text-sm text-muted-foreground">{member.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Teknologi yang Digunakan
          </CardTitle>
          <CardDescription>
            Platform dan teknologi yang memberdayakan SmartPol UB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-sm py-1 px-3">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-primary text-primary-foreground animate-fade-in">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Terima Kasih!</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Kepada seluruh civitas akademika Universitas Brawijaya dan stakeholder 
            yang telah mendukung pengembangan platform ini. Bersama-sama kita wujudkan 
            demokrasi digital yang lebih transparan dan partisipatif.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Credits;