import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  DatePicker,
  Space,
  Tag,
  Button,
  Select,
  Progress,
  List,
  Avatar,
  Divider,
  Timeline
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  MessageOutlined,
  BarChartOutlined,
  FileTextOutlined,
  DownloadOutlined,
  PrinterOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data untuk daily report
  const mockDailyData = {
    summary: {
      totalUsers: 1250,
      newUsers: 15,
      activeUsers: 320,
      totalPolls: 8,
      newPolls: 2,
      pollVotes: 145,
      chatbotInteractions: 89,
      policyViews: 67
    },
    userActivity: [
      {
        id: 1,
        time: '09:15',
        user: 'Ahmad Wijaya',
        action: 'Created new poll',
        details: 'Poll: "Pendapat tentang APBD 2024"',
        type: 'poll'
      },
      {
        id: 2,
        time: '10:30',
        user: 'Siti Nurhaliza',
        action: 'Registered as new user',
        details: 'Role: Konsituen',
        type: 'user'
      },
      {
        id: 3,
        time: '11:45',
        user: 'Budi Santoso',
        action: 'Voted in poll',
        details: 'Poll: "Prioritas Pembangunan"',
        type: 'vote'
      },
      {
        id: 4,
        time: '13:20',
        user: 'Dewi Lestari',
        action: 'Used chatbot',
        details: 'Asked about healthcare policies',
        type: 'chatbot'
      },
      {
        id: 5,
        time: '14:15',
        user: 'Eko Prasetyo',
        action: 'Viewed policy',
        details: 'Policy: "Kebijakan Lingkungan"',
        type: 'policy'
      }
    ],
    pollsData: [
      {
        id: 1,
        title: 'Pendapat tentang APBD 2024',
        votes: 45,
        status: 'active',
        created: '09:15',
        creator: 'Ahmad Wijaya'
      },
      {
        id: 2,
        title: 'Prioritas Pembangunan Infrastruktur',
        votes: 67,
        status: 'active',
        created: '11:30',
        creator: 'Admin System'
      },
      {
        id: 3,
        title: 'Evaluasi Program Kesehatan',
        votes: 33,
        status: 'completed',
        created: '08:00',
        creator: 'Dewi Lestari'
      }
    ],
    systemMetrics: {
      serverUptime: '99.9%',
      responseTime: '1.2s',
      errorRate: '0.1%',
      databaseQueries: 1547,
      apiCalls: 892
    }
  };

  useEffect(() => {
    setReportData(mockDailyData);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // In real app, fetch data for selected date
  };

  const handleExportReport = () => {
    // Implement export functionality
    console.log('Exporting daily report for:', selectedDate.format('YYYY-MM-DD'));
  };

  const handlePrintReport = () => {
    // Implement print functionality
    window.print();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'poll': return <BarChartOutlined style={{ color: '#1890ff' }} />;
      case 'user': return <UserOutlined style={{ color: '#52c41a' }} />;
      case 'vote': return <CheckCircleOutlined style={{ color: '#faad14' }} />;
      case 'chatbot': return <MessageOutlined style={{ color: '#722ed1' }} />;
      case 'policy': return <FileTextOutlined style={{ color: '#fa541c' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'poll': return '#1890ff';
      case 'user': return '#52c41a';
      case 'vote': return '#faad14';
      case 'chatbot': return '#722ed1';
      case 'policy': return '#fa541c';
      default: return '#666';
    }
  };

  const pollColumns = [
    {
      title: 'Poll Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <div style={{ fontWeight: 'bold' }}>{title}</div>
      ),
    },
    {
      title: 'Votes',
      dataIndex: 'votes',
      key: 'votes',
      render: (votes) => (
        <Tag color="blue">{votes} votes</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CalendarOutlined className="text-xl" style={{color: 'white'}} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Laporan Harian</h1>
                <p className="text-gray-600 mt-1">Ringkasan aktivitas dan metrik hari ini</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                placeholder="Pilih Tanggal"
                className="h-10 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <button
                onClick={handleExportReport}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <DownloadOutlined className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={handlePrintReport}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                <PrinterOutlined className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-indigo-800 font-medium">
              📅 Laporan untuk {selectedDate.format('dddd, DD MMMM YYYY')}
            </p>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-xl" style={{color: 'white'}} />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <RiseOutlined className="w-4 h-4 mr-1" />
                +{reportData.summary?.newUsers}
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Pengguna</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary?.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">+{reportData.summary?.newUsers} pengguna baru</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-xl" style={{color: 'white'}} />
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Hari Ini
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Pengguna Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary?.activeUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Sedang online</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <BarChartOutlined className="text-xl" style={{color: 'white'}} />
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {reportData.summary?.totalPolls} polling
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Suara Polling</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary?.pollVotes}</p>
              <p className="text-xs text-gray-500 mt-1">Total suara hari ini</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageOutlined className="text-xl" style={{color: 'white'}} />
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Hari Ini
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Interaksi Chatbot</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary?.chatbotInteractions}</p>
              <p className="text-xs text-gray-500 mt-1">Percakapan aktif</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Activity Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Timeline Aktivitas Pengguna</h3>
              <p className="text-sm text-gray-600 mt-1">Aktivitas terbaru dari pengguna sistem</p>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <Timeline>
                {reportData.userActivity?.map(activity => (
                  <Timeline.Item
                    key={activity.id}
                    dot={getActivityIcon(activity.type)}
                    color={getActivityColor(activity.type)}
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900">
                        {activity.time} - {activity.action}
                      </div>
                      <div className="text-gray-600 text-sm">
                        Pengguna: {activity.user}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.details}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>

          <div className="space-y-6">
            {/* System Performance */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Performa Sistem</h3>
                <p className="text-sm text-gray-600 mt-1">Metrik performa server dan aplikasi</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Server Uptime</p>
                    <p className="text-2xl font-bold text-green-600">
                      {reportData.systemMetrics?.serverUptime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Response Time</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {reportData.systemMetrics?.responseTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Error Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {reportData.systemMetrics?.errorRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">API Calls</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {reportData.systemMetrics?.apiCalls}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Statistik Cepat</h3>
                <p className="text-sm text-gray-600 mt-1">Ringkasan aktivitas hari ini</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Polling Baru Dibuat</span>
                    <span className="font-bold text-gray-900">{reportData.summary?.newPolls}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tampilan Kebijakan</span>
                    <span className="font-bold text-gray-900">{reportData.summary?.policyViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Query Database</span>
                    <span className="font-bold text-gray-900">{reportData.systemMetrics?.databaseQueries}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Polls Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Aktivitas Polling Hari Ini</h3>
            <p className="text-sm text-gray-600 mt-1">Daftar polling yang aktif dan statistiknya</p>
          </div>
          <div className="overflow-hidden">
            <Table
              columns={pollColumns}
              dataSource={reportData.pollsData}
              rowKey="id"
              pagination={false}
              size="small"
              className="border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;