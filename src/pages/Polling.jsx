import React, { useState, useEffect } from 'react';
import { Card, Progress, Button, Badge, message, Spin, Tabs } from 'antd';
import AppSidebar from '../components/layouts/AppSidebar';
import { FaBars, FaChartBar, FaUsers, FaClock, FaCheckCircle, FaFileAlt, FaVoteYea } from 'react-icons/fa';
import { authAPI, pollingAPI } from '../services/api';

const { TabPane } = Tabs;



const Polling = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [votedPolls, setVotedPolls] = useState(new Set());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('polling');

  useEffect(() => {
    fetchUserData();
    fetchPolls();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPolls = async () => {
    try {
      setPollsLoading(true);
      const response = await pollingAPI.getPolls();
      setPolls(response.polls || []);
    } catch (error) {
      message.error('Gagal memuat data polling');
      console.error('Error fetching polls:', error);
    } finally {
      setPollsLoading(false);
    }
  };

  const getFilteredPolls = () => {
    return polls.filter(poll => poll.type === activeTab);
  };

  const handleVote = async (pollId, optionId) => {
    if (!user) {
      message.error('Anda harus login terlebih dahulu');
      return;
    }

    if (!user.nik_verified) {
      message.error('Anda harus verifikasi NIK terlebih dahulu untuk dapat melakukan polling');
      return;
    }

    if (votedPolls.has(pollId)) {
      message.warning('Anda sudah memberikan suara untuk polling ini!');
      return;
    }

    setLoading(true);
    try {
      await pollingAPI.vote(pollId, optionId);
      setVotedPolls(prev => new Set(prev).add(pollId));
      message.success('Suara Anda berhasil dicatat!');
      // Refresh data polling untuk mendapatkan hasil terbaru
      fetchPolls();
    } catch (error) {
      message.error(error.message || 'Gagal mencatat suara. Silakan coba lagi.');
      console.error('Error submitting vote:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-lg font-semibold text-gray-900">{activeTab === 'polling' ? 'Polling Kebijakan' : 'Survey Publik'}</h1>
          <div className="w-9"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-blue-800">Polling & Survey</h1>
              <p className="text-gray-600">
                Berpartisipasi dalam pengambilan keputusan dan memberikan pendapat melalui polling dan survey
              </p>
              {user && !user.nik_verified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    ⚠️ Anda perlu verifikasi NIK terlebih dahulu untuk dapat berpartisipasi dalam polling dan survey.
                  </p>
                </div>
              )}
            </div>

            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              className="polling-tabs"
            >
              <TabPane 
                 tab={
                   <span className="flex items-center gap-2">
                     <FaVoteYea className="w-4 h-4" />
                     Polling Kebijakan
                   </span>
                 } 
                 key="polling"
               >
                 <div className="space-y-4">
                   <p className="text-gray-600">
                     Berpartisipasi dalam pengambilan keputusan kebijakan publik
                   </p>
                   {pollsLoading ? (
                     <div className="text-center py-12">
                       <Spin size="large" />
                       <p className="mt-4 text-gray-600">Memuat data polling...</p>
                     </div>
                   ) : (
                     <div className="space-y-6">
                       {getFilteredPolls().map((poll) => {
                          const hasVoted = votedPolls.has(poll.id);
                          const isActive = poll.status === "active";
                          const canVote = user && user.nik_verified && isActive && !hasVoted;
                          
                          return (
                            <Card key={poll.id} className="shadow-md hover:shadow-lg transition-shadow">
                              <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="space-y-2 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">{poll.title}</h3>
                                    <p className="text-gray-600">{poll.description}</p>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    <Badge color="purple">{poll.category}</Badge>
                                    <Badge 
                                      color={isActive ? "green" : "default"}
                                    >
                                      {isActive ? (
                                        <>
                                          <FaClock className="w-3 h-3 mr-1" />
                                          Aktif
                                        </>
                                      ) : (
                                        <>
                                          <FaCheckCircle className="w-3 h-3 mr-1" />
                                          Selesai
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  {poll.options.map((option) => {
                                    const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                                    
                                    return (
                                      <div key={option.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium">{option.text}</span>
                                          {(hasVoted || !isActive) && (
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-gray-500">
                                                {option.votes} responden
                                              </span>
                                              <span className="text-sm font-medium">
                                                {percentage.toFixed(1)}%
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {hasVoted || !isActive ? (
                                          <Progress 
                                            percent={percentage} 
                                            size="small" 
                                            strokeColor="#7c3aed"
                                          />
                                        ) : canVote ? (
                                          <Button
                                            type="default"
                                            className="w-full text-left"
                                            loading={loading}
                                            onClick={() => handleVote(poll.id, option.id)}
                                          >
                                            {option.text}
                                          </Button>
                                        ) : (
                                          <div className="w-full p-3 bg-gray-100 rounded border text-gray-500 text-center">
                                            {!user ? 'Login untuk mengisi survey' : !user.nik_verified ? 'Verifikasi NIK untuk mengisi survey' : option.text}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t mt-4">
                                  <div className="flex items-center gap-2 text-gray-500">
                                    <FaUsers className="w-4 h-4" />
                                    <span className="text-sm">{poll.totalVotes} total responden</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-500">
                                    <FaChartBar className="w-4 h-4" />
                                    <span className="text-sm">
                                      Berakhir: {new Date(poll.endDate).toLocaleDateString("id-ID")}
                                    </span>
                                  </div>
                                </div>

                                {hasVoted && isActive && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                                    <p className="text-sm text-green-800">
                                      ✓ Terima kasih! Respon Anda telah berhasil dicatat.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </TabPane>
              </Tabs>
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

export default Polling;