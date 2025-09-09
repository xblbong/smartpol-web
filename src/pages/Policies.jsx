import React, { useState, useEffect, useCallback } from 'react';
import { Card, Badge, Input, Tabs, Spin, Modal, Statistic, Row, Col, Button, Tooltip, message, Alert } from 'antd';
import AppSidebar from '../components/layouts/AppSidebar';
import { FaBars, FaFileAlt, FaSearch, FaEye, FaTimes, FaSync, FaCheckCircle, FaClock, FaExclamationCircle, FaEdit, FaTimesCircle } from 'react-icons/fa';
import { authAPI, policiesAPI } from '../services/api';





const statusConfig = {
  draft: { label: "Draft", icon: FaEdit, color: "default" },
  submitted: { label: "Diajukan", icon: FaClock, color: "processing" },
  approved: { label: "Disetujui", icon: FaCheckCircle, color: "success" },
  rejected: { label: "Dibatalkan", icon: FaTimesCircle, color: "error" }
};

const Policies = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [policyStats, setPolicyStats] = useState({
    total: 0,
    draft: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchUserData();
    fetchPolicies();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      handleRefresh(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculate statistics whenever policies change
  useEffect(() => {
    const stats = {
      total: policies.length,
      draft: policies.filter(policy => policy.status === 'draft').length,
      approved: policies.filter(policy => policy.status === 'approved').length,
      rejected: policies.filter(policy => policy.status === 'rejected').length
    };
    setPolicyStats(stats);
  }, [policies]);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPolicies = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await policiesAPI.getPolicies();
      setPolicies(response.policies || []);
      setLastUpdated(new Date());
      
      if (isRefresh) {
        message.success('Data kebijakan berhasil diperbarui');
      }
    } catch (error) {
      message.error('Gagal memuat data kebijakan');
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback((silent = false) => {
    fetchPolicies(!silent);
  }, [fetchPolicies]);

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || policy.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handlePolicyClick = (policy) => {
    setSelectedPolicy(policy);
  };

  const handleBackToList = () => {
    setSelectedPolicy(null);
  };

  if (selectedPolicy) {
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
            <h1 className="text-lg font-semibold text-gray-900">Detail Kebijakan</h1>
            <div className="w-9"></div>
          </div>

          {/* Policy Detail Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
              <button
                onClick={handleBackToList}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                ← Kembali ke Daftar Kebijakan
              </button>
              
              <Card className="shadow-md">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2 flex-1">
                      <h1 className="text-2xl font-bold text-gray-900">{selectedPolicy.title}</h1>
                      <p className="text-gray-600">{selectedPolicy.description}</p>
                    </div>
                    <Badge 
                      status={statusConfig[selectedPolicy.status].color}
                      text={statusConfig[selectedPolicy.status].label}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-700">Kategori:</span>
                      <span className="ml-2">{selectedPolicy.category}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Tanggal:</span>
                      <span className="ml-2">{new Date(selectedPolicy.created_at).toLocaleDateString("id-ID", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Isi Kebijakan</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{selectedPolicy.content}</p>
                    </div>
                  </div>
                </div>
              </Card>
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
  }

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
          <h1 className="text-lg font-semibold text-gray-900">Transparansi Kebijakan</h1>
          <div className="w-9"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-blue-800">Transparansi Kebijakan</h1>
                  <p className="text-gray-600">
                    Pantau perkembangan kebijakan dan regulasi dari Pemerintah Kota Malang
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {lastUpdated && (
                    <span className="text-sm text-gray-500">
                      Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
                    </span>
                  )}
                  <Tooltip title="Refresh Data">
                    <Button 
                      icon={<FaSync className={refreshing ? 'animate-spin' : ''} />}
                      onClick={() => handleRefresh(false)}
                      loading={refreshing}
                      type="primary"
                      ghost
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                </div>
              </div>
              
              {/* Statistics Dashboard */}
              <Row gutter={16} className="mb-6">
                <Col xs={12} sm={6}>
                  <Card size="small">
                    <Statistic
                      title="Total Kebijakan"
                      value={policyStats.total}
                      prefix={<FaFileAlt className="text-blue-500" />}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small">
                    <Statistic
                      title="Draft"
                      value={policyStats.draft}
                      prefix={<FaEdit className="text-orange-500" />}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small">
                    <Statistic
                      title="Disetujui"
                      value={policyStats.approved}
                      prefix={<FaCheckCircle className="text-green-500" />}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small">
                    <Statistic
                      title="Ditolak"
                      value={policyStats.rejected}
                      prefix={<FaTimesCircle className="text-red-500" />}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="relative">
              <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari kebijakan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                size="large"
              />
            </div>

            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              type="card"
              items={[
                { key: 'all', label: 'Semua' },
                { key: 'draft', label: 'Draft' },
                { key: 'submitted', label: 'Diajukan' },
                { key: 'approved', label: 'Disetujui' },
                { key: 'rejected', label: 'Dibatalkan' }
              ]}
            />

            {loading ? (
              <div className="text-center py-12">
                <Spin size="large" />
                <p className="mt-4 text-gray-600">Memuat data kebijakan...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPolicies.length === 0 ? (
                <Card className="text-center py-12">
                  <FaFileAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-600">Tidak ada kebijakan ditemukan</h3>
                  <p className="text-gray-500">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                </Card>
              ) : (
                filteredPolicies.map((policy) => {
                  const StatusIcon = statusConfig[policy.status].icon;
                  return (
                    <Card 
                      key={policy.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handlePolicyClick(policy)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">{policy.title}</h3>
                            <p className="text-gray-600">{policy.description}</p>
                          </div>
                          <div className="ml-4">
                            <Badge 
                              status={statusConfig[policy.status].color}
                              text={statusConfig[policy.status].label}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
                          <span>Kategori: {policy.category}</span>
                          <span>Tanggal: {new Date(policy.created_at).toLocaleDateString("id-ID", {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </Card>
                   );
                })
                )}
              </div>
            )}
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

export default Policies;