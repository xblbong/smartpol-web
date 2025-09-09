import React, { useState, useEffect } from "react";
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
  Divider,
  Tabs,
  Alert,
  Tooltip,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  UserOutlined,
  MessageOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ReloadOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  TeamOutlined,
  CalendarOutlined,
  ExportOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Analytics = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data untuk analytics
  const mockAnalyticsData = {
    overview: {
      totalUsers: 15420,
      activeUsers: 8750,
      newUsers: 1250,
      userRetention: 78.5,
      totalPolls: 342,
      activePolls: 89,
      completedPolls: 253,
      pollEngagement: 85.2,
      totalVotes: 45670,
      avgVotesPerPoll: 133.5,
      voteGrowth: 23.4,
      chatbotSessions: 12340,
      avgSessionDuration: 4.2,
      satisfactionScore: 87.3,
    },
    realTimeMetrics: {
      onlineUsers: 234,
      activePolls: 12,
      votesLastHour: 89,
      chatbotQueries: 45,
      serverLoad: 67,
      responseTime: 1.2,
    },
    userBehavior: {
      topPages: [
        { page: "/polls", visits: 12450, avgTime: "3:45", bounceRate: 23.4 },
        { page: "/dashboard", visits: 8970, avgTime: "2:30", bounceRate: 18.7 },
        { page: "/policies", visits: 6780, avgTime: "4:12", bounceRate: 31.2 },
        { page: "/chatbot", visits: 5430, avgTime: "5:20", bounceRate: 15.6 },
        { page: "/reports", visits: 3210, avgTime: "6:15", bounceRate: 28.9 },
      ],
      deviceTypes: [
        { device: "Mobile", users: 8750, percentage: 56.7 },
        { device: "Desktop", users: 5420, percentage: 35.2 },
        { device: "Tablet", users: 1250, percentage: 8.1 },
      ],
      browsers: [
        { browser: "Chrome", users: 9870, percentage: 64.0 },
        { browser: "Firefox", users: 2340, percentage: 15.2 },
        { browser: "Safari", users: 1890, percentage: 12.3 },
        { browser: "Edge", users: 1320, percentage: 8.5 },
      ],
    },
    pollAnalytics: {
      categoryPerformance: [
        {
          category: "Infrastructure",
          polls: 68,
          votes: 15420,
          engagement: 89.2,
          satisfaction: 87,
        },
        {
          category: "Healthcare",
          polls: 52,
          votes: 12340,
          engagement: 85.7,
          satisfaction: 84,
        },
        {
          category: "Education",
          polls: 48,
          votes: 10890,
          engagement: 82.3,
          satisfaction: 81,
        },
        {
          category: "Environment",
          polls: 45,
          votes: 9876,
          engagement: 91.5,
          satisfaction: 89,
        },
        {
          category: "Economy",
          polls: 38,
          votes: 8765,
          engagement: 78.9,
          satisfaction: 78,
        },
        {
          category: "Social",
          polls: 35,
          votes: 7654,
          engagement: 80.1,
          satisfaction: 82,
        },
      ],
      votingPatterns: [
        { hour: "00:00", votes: 45 },
        { hour: "02:00", votes: 23 },
        { hour: "04:00", votes: 12 },
        { hour: "06:00", votes: 34 },
        { hour: "08:00", votes: 156 },
        { hour: "10:00", votes: 234 },
        { hour: "12:00", votes: 298 },
        { hour: "14:00", votes: 267 },
        { hour: "16:00", votes: 189 },
        { hour: "18:00", votes: 345 },
        { hour: "20:00", votes: 278 },
        { hour: "22:00", votes: 167 },
      ],
      topKeywords: [
        { keyword: "infrastruktur", count: 1234, trend: "up" },
        { keyword: "kesehatan", count: 987, trend: "up" },
        { keyword: "pendidikan", count: 876, trend: "down" },
        { keyword: "lingkungan", count: 765, trend: "up" },
        { keyword: "ekonomi", count: 654, trend: "stable" },
        { keyword: "sosial", count: 543, trend: "up" },
      ],
    },
    chatbotAnalytics: {
      topQuestions: [
        {
          question: "Bagaimana cara voting?",
          count: 456,
          category: "Tutorial",
        },
        { question: "Apa itu polling?", count: 389, category: "General" },
        {
          question: "Cara melihat hasil polling?",
          count: 345,
          category: "Tutorial",
        },
        { question: "Kebijakan privasi data", count: 298, category: "Privacy" },
        {
          question: "Cara menghubungi admin?",
          count: 267,
          category: "Support",
        },
      ],
      satisfactionRatings: [
        { rating: "5 Stars", count: 3456, percentage: 67.8 },
        { rating: "4 Stars", count: 1234, percentage: 24.2 },
        { rating: "3 Stars", count: 298, percentage: 5.8 },
        { rating: "2 Stars", count: 89, percentage: 1.7 },
        { rating: "1 Star", count: 23, percentage: 0.5 },
      ],
      responseTime: {
        avg: 1.2,
        fastest: 0.3,
        slowest: 4.5,
        under1s: 78.5,
        under3s: 94.2,
      },
    },
    performanceMetrics: {
      systemHealth: {
        uptime: 99.8,
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        diskUsage: 34.5,
        networkLatency: 23.4,
      },
      apiMetrics: {
        totalRequests: 234567,
        successRate: 99.2,
        avgResponseTime: 245,
        errorRate: 0.8,
        peakRPS: 1234,
      },
    },
  };

  useEffect(() => {
    setAnalyticsData(mockAnalyticsData);
  }, [dateRange, selectedMetric]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleMetricChange = (value) => {
    setSelectedMetric(value);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExportData = () => {
    console.log("Exporting analytics data...");
  };

  const topPagesColumns = [
    {
      title: "Page",
      dataIndex: "page",
      key: "page",
      render: (page) => <div style={{ fontWeight: "bold" }}>{page}</div>,
    },
    {
      title: "Visits",
      dataIndex: "visits",
      key: "visits",
      render: (visits) => (
        <div style={{ color: "#1890ff", fontWeight: "bold" }}>
          {visits.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Avg Time",
      dataIndex: "avgTime",
      key: "avgTime",
    },
    {
      title: "Bounce Rate",
      dataIndex: "bounceRate",
      key: "bounceRate",
      render: (rate) => (
        <div style={{ color: rate > 25 ? "#ff4d4f" : "#52c41a" }}>{rate}%</div>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <div style={{ fontWeight: "bold" }}>{category}</div>
      ),
    },
    {
      title: "Polls",
      dataIndex: "polls",
      key: "polls",
    },
    {
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
      render: (votes) => (
        <div style={{ color: "#1890ff", fontWeight: "bold" }}>
          {votes.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Engagement",
      dataIndex: "engagement",
      key: "engagement",
      render: (engagement) => <Progress percent={engagement} size="small" />,
    },
    {
      title: "Satisfaction",
      dataIndex: "satisfaction",
      key: "satisfaction",
      render: (satisfaction) => (
        <Progress percent={satisfaction} size="small" strokeColor="#52c41a" />
      ),
    },
  ];

  return (
    <div className="p-6 overflow-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center mb-4 lg:mb-0">
              <div className="bg-opacity-20 rounded-lg p-3 mr-4" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
                <BarChartOutlined
                  className="text-2xl"
                  style={{ color: "white" }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Dashboard Analitik
                </h1>
                <p className="text-blue-100">
                  Pantau performa dan metrik sistem secara real-time
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
                className="bg-white border-0 shadow-sm"
              />
              <Select
                value={selectedMetric}
                onChange={handleMetricChange}
                className="w-32"
                size="middle"
              >
                <Option value="all">Semua Metrik</Option>
                <Option value="users">Pengguna</Option>
                <Option value="polls">Polling</Option>
                <Option value="chatbot">Chatbot</Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30"
              >
                Refresh
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportData}
                className="bg-white text-blue-600 border-0 font-medium hover:bg-blue-50"
              >
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold">Status Real-time</h3>
                <p className="text-green-100 text-sm">
                  Data diperbarui setiap detik
                </p>
              </div>
            </div>
            <div className="flex space-x-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {analyticsData.realTimeMetrics?.onlineUsers}
                </div>
                <div className="text-xs text-green-100">Pengguna Online</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {analyticsData.realTimeMetrics?.activePolls}
                </div>
                <div className="text-xs text-green-100">Polling Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {analyticsData.realTimeMetrics?.votesLastHour}
                </div>
                <div className="text-xs text-green-100">Suara/Jam</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <UserOutlined className="text-xl" style={{color: "blue"}} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview?.totalUsers?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Pengguna</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="text-green-600 font-medium">
                {analyticsData.overview?.userRetention}% retensi
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <BarChartOutlined className="text-xl" style={{color: "orange"}} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview?.pollEngagement}%
                </div>
                <div className="text-sm text-gray-600">Engagement Polling</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${analyticsData.overview?.pollEngagement}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <ThunderboltOutlined className="text-xl"  style={{color: "purple"}} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview?.totalVotes?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Suara</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <RiseOutlined className="mr-1"  style={{color: "green"}} />
              <span className="text-green-600 font-medium">
                +{analyticsData.overview?.voteGrowth}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <HeartOutlined className="text-xl" style={{color: "green"}} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview?.satisfactionScore}%
                </div>
                <div className="text-sm text-gray-600">Skor Kepuasan</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${analyticsData.overview?.satisfactionScore}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <Tabs 
            defaultActiveKey="1" 
            className="p-6"
            items={[
              {
                key: "1",
                label: "📈 Analitik Pengguna",
                children: (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <EyeOutlined className="text-blue-500 mr-2" />
                        Performa Halaman Teratas
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Halaman dengan kunjungan tertinggi
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <Table
                        columns={topPagesColumns}
                        dataSource={analyticsData.userBehavior?.topPages}
                        rowKey="page"
                        pagination={false}
                        size="small"
                        className="border-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <GlobalOutlined className="mr-2" style={{color: "green"}} />
                        Distribusi Perangkat
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Jenis perangkat yang digunakan
                      </p>
                    </div>
                    <div className="space-y-4">
                      {analyticsData.userBehavior?.deviceTypes?.map(
                        (item, index) => (
                          <div key={index} className="bg-white rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">
                                {item.device}
                              </span>
                              <span className="font-bold text-blue-600">
                                {item.users.toLocaleString()}
                              </span>
                            </div>
                            <Progress
                              percent={item.percentage}
                              size="small"
                              strokeColor="#3b82f6"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <GlobalOutlined className="mr-2" style={{color: "purple"}} />
                        Penggunaan Browse
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Browser yang paling banyak digunakan
                      </p>
                    </div>
                    <div className="space-y-3">
                      {analyticsData.userBehavior?.browsers?.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-white rounded-lg p-3"
                          >
                            <span className="font-medium text-gray-900">
                              {item.browser}
                            </span>
                            <span className="font-bold text-purple-600">
                              {item.percentage}%
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
                )
              },
              {
                key: "2",
                label: "🗳️ Analitik Polling",
                children: (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BarChartOutlined className="text-blue-500 mr-2" />
                        Analisis Performa Kategori
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Performa polling berdasarkan kategori kebijakan
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <Table
                        columns={categoryColumns}
                        dataSource={
                          analyticsData.pollAnalytics?.categoryPerformance
                        }
                        rowKey="category"
                        pagination={false}
                        size="small"
                        className="border-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <TrophyOutlined className="text-yellow-500 mr-2" />
                        Kata Kunci Populer
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Topik yang paling banyak dibahas
                      </p>
                    </div>
                    <div className="space-y-3">
                      {analyticsData.pollAnalytics?.topKeywords?.map(
                        (item, index) => (
                          <div key={index} className="bg-white rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">
                                {item.keyword}
                              </span>
                              <div className="flex items-center">
                                <span className="font-bold text-blue-600 mr-2">
                                  {item.count}
                                </span>
                                {item.trend === "up" && (
                                  <RiseOutlined className="text-green-500" />
                                )}
                                {item.trend === "down" && (
                                  <FallOutlined className="text-red-500" />
                                )}
                                {item.trend === "stable" && (
                                  <div className="w-2 h-0.5 bg-yellow-400 rounded"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <ClockCircleOutlined className="text-purple-500 mr-2" />
                        Pola Voting
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Jam puncak: 12:00, 18:00
                      </p>
                    </div>
                    <div className="space-y-3">
                      {analyticsData.pollAnalytics?.votingPatterns
                        ?.filter((_, index) => index % 2 === 0)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-white rounded-lg p-3"
                          >
                            <span className="font-medium text-gray-900">
                              {item.hour}
                            </span>
                            <span className="font-bold text-purple-600">
                              {item.votes} suara
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
                )
              },
              {
                key: "3",
                label: "🤖 Analitik Chatbot",
                children: (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <MessageOutlined className="text-blue-500 mr-2" />
                          Pertanyaan Populer
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Pertanyaan yang paling sering ditanyakan
                        </p>
                      </div>
                      <div className="space-y-3">
                        {analyticsData.chatbotAnalytics?.topQuestions?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">
                                  {item.question}
                                </span>
                                <span className="font-bold text-blue-600">
                                  {item.count}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Tag size="small" color="blue">
                                  {item.category}
                                </Tag>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <HeartOutlined className="text-green-500 mr-2" />
                          Kepuasan Pengguna
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Rating dan feedback dari pengguna
                        </p>
                      </div>
                      <div className="space-y-3">
                        {analyticsData.chatbotAnalytics?.satisfactionRatings?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">
                                  {item.rating}
                                </span>
                                <span className="font-bold text-green-600">
                                  {item.count} ({item.percentage}%)
                                </span>
                              </div>
                              <Progress
                                percent={item.percentage}
                                size="small"
                                strokeColor="#52c41a"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mt-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <ThunderboltOutlined className="text-purple-500 mr-2" />
                          Metrik Waktu Respons
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Performa kecepatan chatbot
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {analyticsData.chatbotAnalytics?.responseTime?.avg}s
                          </div>
                          <div className="text-sm text-gray-600">Rata-rata</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {
                              analyticsData.chatbotAnalytics?.responseTime
                                ?.under1s
                            }
                            %
                          </div>
                          <div className="text-sm text-gray-600">1 detik</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                )
              },
              {
                key: "4",
                label: "⚡ Performa",
                children: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <ThunderboltOutlined className="text-blue-500 mr-2" />
                        Kesehatan Sistem
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Status performa sistem secara real-time
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            analyticsData.performanceMetrics?.systemHealth
                              ?.uptime
                          }
                          %
                        </div>
                        <div className="text-sm text-gray-600">Uptime</div>
                        <Progress
                          percent={
                            analyticsData.performanceMetrics?.systemHealth
                              ?.uptime
                          }
                          size="small"
                          strokeColor="#10b981"
                          className="mt-2"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {
                            analyticsData.performanceMetrics?.systemHealth
                              ?.cpuUsage
                          }
                          %
                        </div>
                        <div className="text-sm text-gray-600">CPU Usage</div>
                        <Progress
                          percent={
                            analyticsData.performanceMetrics?.systemHealth
                              ?.cpuUsage
                          }
                          size="small"
                          strokeColor="#3b82f6"
                          className="mt-2"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {
                            analyticsData.performanceMetrics?.systemHealth
                              ?.memoryUsage
                          }
                          %
                        </div>
                        <div className="text-sm text-gray-600">Memory</div>
                        <Progress
                          percent={
                            analyticsData.performanceMetrics?.systemHealth
                              ?.memoryUsage
                          }
                          size="small"
                          strokeColor="#f59e0b"
                          className="mt-2"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {
                            analyticsData.performanceMetrics?.systemHealth
                              ?.diskUsage
                          }
                          %
                        </div>
                        <div className="text-sm text-gray-600">Disk Usage</div>
                        <Progress
                          percent={
                            analyticsData.performanceMetrics?.systemHealth
                              ?.diskUsage
                          }
                          size="small"
                          strokeColor="#8b5cf6"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <LineChartOutlined className="text-green-500 mr-2" />
                        Performa API
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Metrik performa API dan response time
                      </p>
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          label: "Total Requests",
                          value:
                            analyticsData.performanceMetrics?.apiMetrics?.totalRequests?.toLocaleString(),
                          color: "text-blue-600",
                        },
                        {
                          label: "Success Rate",
                          value: `${analyticsData.performanceMetrics?.apiMetrics?.successRate}%`,
                          color: "text-green-600",
                        },
                        {
                          label: "Avg Response Time",
                          value: `${analyticsData.performanceMetrics?.apiMetrics?.avgResponseTime}ms`,
                          color: "text-yellow-600",
                        },
                        {
                          label: "Error Rate",
                          value: `${analyticsData.performanceMetrics?.apiMetrics?.errorRate}%`,
                          color: "text-red-600",
                        },
                        {
                          label: "Peak RPS",
                          value:
                            analyticsData.performanceMetrics?.apiMetrics?.peakRPS?.toLocaleString(),
                          color: "text-purple-600",
                        },
                      ].map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">
                              {item.label}
                            </span>
                            <span className={`font-bold ${item.color}`}>
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
                )
              }
            ]}
          />
        </div>
    </div>
  );
};

export default Analytics;