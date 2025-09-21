import React, { useState, useEffect, useCallback } from 'react';
import { Card, Progress, Button, Badge, message, Spin, Tabs, Alert, Tooltip } from 'antd';
import AppSidebar from '../components/layouts/AppSidebar';
import { FaBars, FaChartBar, FaUsers, FaClock, FaCheckCircle, FaFileAlt, FaVoteYea, FaSync, FaArrowRight, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { authAPI, pollingAPI } from '../services/api';

const Polling = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [votedPolls, setVotedPolls] = useState(new Set());
  const [userVotes, setUserVotes] = useState(new Map());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('polling');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pollStats, setPollStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalVotes: 0
  });
  const [showCompletedPolls, setShowCompletedPolls] = useState(false);

  // Dummy data
  const dummyPolls = [
    {
      id: 1,
      title: "Pendapat tentang Pembangunan Jembatan Penyeberangan",
      description: "Bagaimana pendapat Anda tentang rencana pembangunan jembatan penyeberangan di kawasan pusat kota?",
      category: "Infrastruktur",
      status: "active",
      type: "polling",
      totalVotes: 245,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      options: [
        { id: 1, text: "Sangat Setuju", votes: 89 },
        { id: 2, text: "Setuju", votes: 76 },
        { id: 3, text: "Netral", votes: 45 },
        { id: 4, text: "Tidak Setuju", votes: 23 },
        { id: 5, text: "Sangat Tidak Setuju", votes: 12 }
      ]
    },
    {
      id: 2,
      title: "Evaluasi Pelayanan Publik di Kantor Kelurahan",
      description: "Bagaimana penilaian Anda terhadap kualitas pelayanan di kantor kelurahan?",
      category: "Pelayanan",
      status: "active",
      type: "polling",
      totalVotes: 189,
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      options: [
        { id: 6, text: "Sangat Puas", votes: 67 },
        { id: 7, text: "Puas", votes: 58 },
        { id: 8, text: "Cukup Puas", votes: 42 },
        { id: 9, text: "Kurang Puas", votes: 15 },
        { id: 10, text: "Tidak Puas", votes: 7 }
      ]
    },
    {
      id: 3,
      title: "Prioritas Program Pemberdayaan Masyarakat",
      description: "Program pemberdayaan masyarakat mana yang menurut Anda paling prioritas untuk tahun depan?",
      category: "Sosial",
      status: "active",
      type: "polling",
      totalVotes: 156,
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      options: [
        { id: 11, text: "Pelatihan Keterampilan", votes: 45 },
        { id: 12, text: "Bantuan Modal Usaha", votes: 38 },
        { id: 13, text: "Pendidikan Non-Formal", votes: 32 },
        { id: 14, text: "Kesehatan Masyarakat", votes: 28 },
        { id: 15, text: "Lingkungan Hidup", votes: 13 }
      ]
    },
    {
      id: 4,
      title: "Kepuasan terhadap Kebersihan Lingkungan",
      description: "Bagaimana tingkat kepuasan Anda terhadap kebersihan lingkungan di wilayah tempat tinggal?",
      category: "Lingkungan",
      status: "completed",
      type: "polling",
      totalVotes: 312,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      options: [
        { id: 16, text: "Sangat Puas", votes: 98 },
        { id: 17, text: "Puas", votes: 87 },
        { id: 18, text: "Cukup Puas", votes: 76 },
        { id: 19, text: "Kurang Puas", votes: 35 },
        { id: 20, text: "Tidak Puas", votes: 16 }
      ]
    }
  ];

  useEffect(() => {
    fetchUserData();
    fetchPolls();
    const interval = setInterval(() => handleRefresh(true), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stats = {
      total: polls.length,
      active: polls.filter(poll => poll.status === 'active').length,
      completed: polls.filter(poll => poll.status === 'completed').length,
      totalVotes: polls.reduce((sum, poll) => sum + (poll.totalVotes || 0), 0)
    };
    setPollStats(stats);
  }, [polls]);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPolls = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setPollsLoading(true);
      
      const response = await fetch('/api/polling', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch polls');
      }
      
      setPolls(data.polls);
      
      // Update voted polls based on backend data
      const votedPollIds = new Set();
      const userVotesMap = new Map();
      
      data.polls.forEach(poll => {
        if (poll.has_voted) {
          votedPollIds.add(poll.id);
          if (poll.voted_option_id) {
            userVotesMap.set(poll.id, poll.voted_option_id);
          }
        }
      });
      
      setVotedPolls(votedPollIds);
      setUserVotes(userVotesMap);
      
      setLastUpdated(new Date());
      if (isRefresh) message.success('Data polling berhasil diperbarui');
    } catch (error) {
      console.error('Error fetching polls:', error);
      message.error('Gagal memuat data polling');
      // Fallback to dummy data if API fails
      setPolls(dummyPolls);
    } finally {
      setPollsLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback((silent = false) => {
    fetchPolls(!silent);
  }, [fetchPolls]);

  const getFilteredPolls = () => {
    let filteredPolls = polls.filter(poll => poll.type === activeTab);
    
    // Only hide voted polls if they are active (not completed)
    // For completed polls, show them regardless of voting status when showCompletedPolls is true
    if (!showCompletedPolls) {
      // Hide completed polls
      filteredPolls = filteredPolls.filter(poll => poll.status !== 'completed');
      // Hide active polls that user has already voted on
      filteredPolls = filteredPolls.filter(poll => !votedPolls.has(poll.id));
    } else {
      // When showing completed polls, show all polls (both active and completed)
      // For active polls, still hide the ones user has voted on
      filteredPolls = filteredPolls.filter(poll => {
        if (poll.status === 'completed') {
          return true; // Always show completed polls
        }
        return !votedPolls.has(poll.id); // Hide active polls that user has voted on
      });
    }
    
    return filteredPolls;
   };

  const handleVote = async (pollId, optionId) => {
    if (!user) {
      message.error('Anda harus login terlebih dahulu');
      return;
    }
    if (!user.nik_verified) {
      message.error('Anda harus verifikasi NIK terlebih dahulu');
      return;
    }
    if (votedPolls.has(pollId)) {
      message.warning('Anda sudah memberikan suara!');
      return;
    }

    setLoading(true);
    try {
      // Call actual API for voting
      const response = await fetch(`/api/polling/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ option_id: optionId })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'You have already voted on this poll') {
          message.warning('Anda sudah memberikan suara pada polling ini!');
          setVotedPolls(prev => new Set(prev).add(pollId));
        } else {
          message.error(data.error || 'Gagal mencatat suara');
        }
        return;
      }

      setVotedPolls(prev => new Set(prev).add(pollId));
      setUserVotes(prev => new Map(prev).set(pollId, optionId));

      message.success('Suara Anda berhasil dicatat!', 3);

      // Refresh polls data to get updated vote counts
      fetchPolls();
    } catch (error) {
      console.error('Error voting:', error);
      message.error('Gagal mencatat suara. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <FaBars className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {activeTab === 'polling' ? (
              <span className="flex items-center  gap-2">
                <FaVoteYea /> Polling Kebijakan
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaChartBar /> Survey Publik
              </span>
            )}
          </h1>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent">
                    Polling & Survey Publik
                  </h1>
                  <p className="text-gray-600 mt-1">Berikan suara Anda untuk membangun kebijakan yang lebih baik</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {lastUpdated && (
                    <span className="text-xs sm:text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm">
                      <FaSync className="inline mr-1" /> Terakhir: {lastUpdated.toLocaleTimeString('id-ID')}
                    </span>
                  )}
                  <Button
                    type={showCompletedPolls ? "primary" : "default"}
                    onClick={() => setShowCompletedPolls(!showCompletedPolls)}
                    size="small"
                    className="rounded-full"
                  >
                    {showCompletedPolls ? "Sembunyikan Selesai" : "Tampilkan Selesai"}
                  </Button>
                  <Tooltip title="Refresh Data">
                    <Button
                      icon={<FaSync className={`transition-transform ${refreshing ? 'animate-spin' : ''}`} />}
                      onClick={() => handleRefresh(false)}
                      loading={refreshing}
                      type="dashed"
                      className="rounded-full"
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { title: "Total Polling", value: pollStats.total, icon: <FaFileAlt className="text-blue-500 w-5 h-5" />, bg: "from-blue-50 to-blue-100" },
                  { title: "Aktif", value: pollStats.active, icon: <FaClock className="text-green-500 w-5 h-5" />, bg: "from-green-50 to-green-100" },
                  { title: "Selesai", value: pollStats.completed, icon: <FaCheckCircle className="text-gray-500 w-5 h-5" />, bg: "from-gray-50 to-gray-100" },
                  { title: "Total Suara", value: pollStats.totalVotes, icon: <FaVoteYea className="text-purple-500 w-5 h-5" />, bg: "from-purple-50 to-purple-100" }
                ].map((stat, idx) => (
                  <Card key={idx} size="small" className={`rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r ${stat.bg}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-800">{stat.value}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-full shadow-sm">
                        {stat.icon}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* User Alert */}
              {user && !user.nik_verified && (
                <Alert
                  message={<span className="font-semibold flex items-center gap-2"><FaExclamationTriangle /> Verifikasi NIK Diperlukan</span>}
                  description="Verifikasi NIK Anda terlebih dahulu untuk berpartisipasi dalam polling."
                  type="warning"
                  showIcon
                  className="rounded-lg"
                />
              )}
            </div>

            {/* Tabs */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="polling-tabs"
              items={[
                {
                  key: 'polling',
                  label: (
                    <span className="flex items-center gap-2 font-medium">
                      <FaVoteYea className="w-4 h-4" />
                      Polling Kebijakan
                    </span>
                  ),
                  children: (
                    <div className="space-y-6">
                      {pollsLoading ? (
                        <div className="text-center py-16">
                          <Spin size="large" tip="Memuat polling..." />
                        </div>
                      ) : (
                        <>
                          {getFilteredPolls().map((poll) => {
                            const hasVoted = votedPolls.has(poll.id);
                            const userVote = userVotes.get(poll.id);
                            const isActive = poll.status === "active";
                            const canVote = user && user.nik_verified && isActive && !hasVoted;

                            return (
                              <div
                                key={poll.id}
                                className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-0 ${hasVoted ? 'bg-gradient-to-r from-green-50 to-emerald-50 ring-1 ring-green-200' : 'bg-white'
                                  }`}
                              >
                                <div className="p-5 sm:p-6">
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                                    <div className="space-y-2 flex-1">
                                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{poll.title}</h3>
                                      <p className="text-gray-600 text-sm sm:text-base">{poll.description}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge color="purple" className="px-2.5 py-1 rounded-md">{poll.category}</Badge>
                                      <Badge
                                        color={isActive ? "green" : "default"}
                                        className="px-2.5 py-1 rounded-md"
                                      >
                                        {isActive ? (
                                          <>
                                            <FaClock className="inline w-3 h-3 mr-1" />
                                            Aktif
                                          </>
                                        ) : (
                                          <>
                                            <FaCheckCircle className="inline w-3 h-3 mr-1" />
                                            Selesai
                                          </>
                                        )}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    {poll.options.map((option) => {
                                      const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                                      const isUserChoice = userVote === option.id;
                                      const isVotedOrInactive = hasVoted || !isActive;

                                      return (
                                        <div key={option.id} className="space-y-2">
                                          {isVotedOrInactive ? (
                                            <>
                                              <div className="flex items-center justify-between">
                                                <span className={`font-medium ${isUserChoice ? 'text-green-700' : 'text-gray-800'}`}>
                                                  {option.text}
                                                  {isUserChoice && (
                                                    <span className="ml-2 inline-flex items-center gap-1 text-green-600 font-semibold">
                                                      <FaCheck className="w-3 h-3" /> Pilihan Anda
                                                    </span>
                                                  )}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs text-gray-500">{option.votes || 0} suara</span>
                                                  <span className="text-sm font-semibold text-gray-700">{percentage.toFixed(1)}%</span>
                                                </div>
                                              </div>
                                              <Progress
                                                percent={percentage}
                                                size="small"
                                                strokeColor={poll.status === 'completed' ? (isUserChoice ? "#10b981" : "#059669") : (isUserChoice ? "#10b981" : "#8b5cf6")}
                                                className={`transition-all duration-500 ${isUserChoice ? 'animate-pulse' : ''}`}
                                                showInfo={false}
                                              />
                                            </>
                                          ) : canVote ? (
                                            <Button
                                              block
                                              className={`text-left px-4 py-3 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isUserChoice
                                                  ? 'border-green-500 bg-green-50 text-green-800 font-bold shadow-md'
                                                  : 'border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-700'
                                                }`}
                                              loading={loading && isUserChoice}
                                              onClick={() => handleVote(poll.id, option.id)}
                                            >
                                              <div className="flex items-center justify-between">
                                                <span>{option.text}</span>
                                                {isUserChoice && <FaCheck className="w-4 h-4 text-green-600" />}
                                              </div>
                                            </Button>
                                          ) : (
                                            <div className="w-full p-3 bg-gray-100 rounded-lg border text-center text-gray-500">
                                              {!user ? <span className="flex items-center justify-center gap-2"><FaExclamationTriangle /> Login dulu ya</span> : !user.nik_verified ? <span className="flex items-center justify-center gap-2"><FaCheckCircle /> Verifikasi NIK dulu</span> : option.text}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 mt-5 border-t border-gray-100 gap-3">
                                    <div className="flex items-center gap-2 text-gray-500">
                                      <FaUsers className="w-4 h-4" />
                                      <span className="text-sm">{poll.totalVotes || 0} responden</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                      <FaChartBar className="w-4 h-4" />
                                      <span className="text-sm">
                                        Berakhir: {new Date(poll.endDate).toLocaleDateString("id-ID", {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  </div>

                                  {hasVoted && isActive && (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-5 animate-fade-in">
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <FaCheck className="text-white w-4 h-4" />
                                        </div>
                                        <div>
                                          <p className="text-green-800 font-medium text-sm">
                                            Terima kasih! Suara Anda telah kami catat 🎉
                                          </p>
                                          <p className="text-green-600 text-xs mt-1">
                                            Partisipasi Anda sangat berarti untuk kemajuan bersama.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div >
                            );
                          })}

                          {!pollsLoading && getFilteredPolls().length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaVoteYea className="w-10 h-10 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {showCompletedPolls ? 'Belum ada polling yang diisi' : 'Tidak ada polling aktif'}
                              </h3>
                              <p className="text-gray-500 max-w-md mx-auto">
                                {showCompletedPolls
                                  ? 'Anda belum mengisi polling apapun. Cek kembali polling aktif!'
                                  : 'Silakan cek kembali nanti atau lihat polling yang sudah selesai.'
                                }
                              </p>
                              {!showCompletedPolls && (
                                <Button
                                  type="link"
                                  onClick={() => setShowCompletedPolls(true)}
                                  className="mt-4"
                                >
                                  Lihat polling yang sudah diisi <FaArrowRight className="inline ml-1" />
                                </Button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                },
                {
                  key: 'survey',
                  label: (
                    <span className="flex items-center gap-2 font-medium">
                      <FaChartBar className="w-4 h-4" />
                      Survey Publik
                    </span>
                  ),
                  children: (
                    <div className="space-y-6">
                      <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaChartBar className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Belum ada Survey Publik tersedia
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Mohon maaf, saat ini belum ada survey yang tersedia untuk Anda ikuti.
                          Silakan cek kembali nanti untuk informasi terbaru.
                        </p>
                      </div>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div >
  );
};

export default Polling;