import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Tag } from 'antd';
import AppSidebar from '../components/layouts/AppSidebar';
import { FaBars, FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaStar, FaUsers, FaCode } from 'react-icons/fa';
import { authAPI } from '../services/api';

const teamMembers = [
  {
    id: 1,
    name: "Ahmad Rizki",
    role: "Full Stack Developer",
    description: "Bertanggung jawab atas pengembangan frontend dan backend aplikasi SmartPol",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    skills: ["React", "Node.js", "Python", "PostgreSQL"],
    github: "https://github.com/ahmadrizki",
    linkedin: "https://linkedin.com/in/ahmadrizki",
    email: "ahmad.rizki@smartpol.id"
  },
  {
    id: 2,
    name: "Sari Dewi",
    role: "UI/UX Designer",
    description: "Merancang antarmuka pengguna yang intuitif dan pengalaman pengguna yang optimal",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    github: "https://github.com/saridewi",
    linkedin: "https://linkedin.com/in/saridewi",
    email: "sari.dewi@smartpol.id"
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Data Analyst",
    description: "Menganalisis data polling dan memberikan insights untuk pengambilan keputusan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    skills: ["Python", "SQL", "Data Visualization", "Machine Learning"],
    github: "https://github.com/budisantoso",
    linkedin: "https://linkedin.com/in/budisantoso",
    email: "budi.santoso@smartpol.id"
  },
  {
    id: 4,
    name: "Maya Putri",
    role: "Project Manager",
    description: "Mengelola timeline proyek dan koordinasi antar tim pengembangan",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    skills: ["Agile", "Scrum", "Project Planning", "Team Leadership"],
    github: "https://github.com/mayaputri",
    linkedin: "https://linkedin.com/in/mayaputri",
    email: "maya.putri@smartpol.id"
  }
];

const technologies = [
  { name: "React", color: "blue" },
  { name: "Node.js", color: "green" },
  { name: "Python", color: "yellow" },
  { name: "PostgreSQL", color: "cyan" },
  { name: "Flask", color: "red" },
  { name: "Ant Design", color: "purple" },
  { name: "Tailwind CSS", color: "blue" },
  { name: "JWT", color: "orange" },
  { name: "Bcrypt", color: "gray" },
  { name: "Vite", color: "magenta" }
];

const Credits = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleContactClick = (type, value) => {
    switch (type) {
      case 'github':
      case 'linkedin':
        window.open(value, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${value}`;
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <FaBars className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Tentang Tim</h1>
          <div className="w-9"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FaHeart className="h-8 w-8 text-red-500" />
                <h1 className="text-4xl font-bold text-blue-800">Tentang Tim SmartPol</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Kami adalah tim yang berdedikasi untuk menciptakan platform transparansi politik 
                yang memungkinkan partisipasi aktif masyarakat dalam proses demokrasi.
              </p>
            </div>

            {/* Team Members Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <FaUsers className="h-6 w-6" />
                  Tim Pengembang
                </h2>
                <p className="text-gray-600">Orang-orang hebat di balik SmartPol</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar 
                          size={80} 
                          src={member.avatar} 
                          alt={member.name}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-blue-600 font-medium">{member.role}</p>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Keahlian:</p>
                              <div className="flex flex-wrap gap-1">
                                {member.skills.map((skill, index) => (
                                  <Tag key={index} color="blue" className="text-xs">
                                    {skill}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                type="text" 
                                size="small"
                                icon={<FaGithub className="h-4 w-4" />}
                                onClick={() => handleContactClick('github', member.github)}
                                className="flex items-center"
                              />
                              <Button 
                                type="text" 
                                size="small"
                                icon={<FaLinkedin className="h-4 w-4" />}
                                onClick={() => handleContactClick('linkedin', member.linkedin)}
                                className="flex items-center"
                              />
                              <Button 
                                type="text" 
                                size="small"
                                icon={<FaEnvelope className="h-4 w-4" />}
                                onClick={() => handleContactClick('email', member.email)}
                                className="flex items-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Technologies Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <FaCode className="h-6 w-6" />
                  Teknologi yang Digunakan
                </h2>
                <p className="text-gray-600">Stack teknologi modern untuk performa optimal</p>
              </div>
              
              <Card className="p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  {technologies.map((tech, index) => (
                    <Tag key={index} color={tech.color} className="text-sm py-1 px-3">
                      {tech.name}
                    </Tag>
                  ))}
                </div>
              </Card>
            </div>

            {/* Appreciation Section */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="p-8 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <FaStar className="h-8 w-8 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Terima Kasih</h2>
                  </div>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Kepada seluruh stakeholder, Pemerintah Kota Malang, DPRD Kota Malang, 
                    dan masyarakat yang telah mendukung pengembangan platform SmartPol.
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <strong>Visi:</strong> Menciptakan transparansi dan partisipasi aktif dalam demokrasi
                    </p>
                    <p className="text-gray-600">
                      <strong>Misi:</strong> Membangun jembatan komunikasi antara pemerintah dan masyarakat
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Section */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Hubungi Kami</h3>
              <p className="text-gray-600">
                Ada pertanyaan atau saran? Jangan ragu untuk menghubungi tim kami.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  type="primary" 
                  icon={<FaEnvelope className="h-4 w-4" />}
                  onClick={() => handleContactClick('email', 'info@smartpol.id')}
                >
                  info@smartpol.id
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Credits;