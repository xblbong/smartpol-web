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
} from "antd";
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
  TrophyOutlined,
  EyeOutlined,
  TeamOutlined,
  LineChartOutlined,
  CrownOutlined,
  StarOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import SidebarComponents from "../../components/layouts/SidebarComponents";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const AnnualReport = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data untuk annual report
  const mockAnnualData = {
    summary: {
      totalUsers: 15420,
      newUsers: 8750,
      activeUsers: 12340,
      userGrowth: 131.2,
      totalPolls: 342,
      newPolls: 198,
      pollVotes: 45670,
      voteGrowth: 89.3,
      chatbotInteractions: 23450,
      interactionGrowth: 156.7,
      policyViews: 67890,
      viewGrowth: 78.4,
      totalEngagement: 87.5,
    },
    monthlyTrends: [
      { month: "Jan", users: 890, polls: 15, votes: 2340, interactions: 1200 },
      { month: "Feb", users: 1120, polls: 18, votes: 2890, interactions: 1450 },
      { month: "Mar", users: 1340, polls: 22, votes: 3450, interactions: 1680 },
      { month: "Apr", users: 1580, polls: 28, votes: 4120, interactions: 1890 },
      { month: "May", users: 1820, polls: 32, votes: 4680, interactions: 2100 },
      { month: "Jun", users: 2050, polls: 35, votes: 5230, interactions: 2340 },
      { month: "Jul", users: 2280, polls: 38, votes: 5780, interactions: 2580 },
      { month: "Aug", users: 2510, polls: 42, votes: 6340, interactions: 2820 },
      { month: "Sep", users: 2740, polls: 45, votes: 6890, interactions: 3060 },
      { month: "Oct", users: 2970, polls: 48, votes: 7450, interactions: 3300 },
      { month: "Nov", users: 3200, polls: 52, votes: 8010, interactions: 3540 },
      { month: "Dec", users: 3430, polls: 55, votes: 8570, interactions: 3780 },
    ],
    topPerformers: {
      polls: [
        {
          id: 1,
          title: "Rencana Pembangunan Jangka Panjang 2024-2029",
          votes: 8945,
          participants: 4567,
          category: "Infrastructure",
          duration: "6 months",
          impact: "High",
        },
        {
          id: 2,
          title: "Reformasi Sistem Kesehatan Nasional",
          votes: 7823,
          participants: 3891,
          category: "Healthcare",
          duration: "4 months",
          impact: "High",
        },
        {
          id: 3,
          title: "Strategi Pendidikan Digital Indonesia",
          votes: 6754,
          participants: 3245,
          category: "Education",
          duration: "3 months",
          impact: "Medium",
        },
        {
          id: 4,
          title: "Kebijakan Energi Terbarukan",
          votes: 5689,
          participants: 2834,
          category: "Environment",
          duration: "5 months",
          impact: "High",
        },
        {
          id: 5,
          title: "Program Pemberdayaan UMKM",
          votes: 4567,
          participants: 2283,
          category: "Economy",
          duration: "2 months",
          impact: "Medium",
        },
      ],
      users: [
        { name: "Dr. Ahmad Wijaya", polls: 45, votes: 1234, engagement: 95 },
        {
          name: "Prof. Siti Nurhaliza",
          polls: 38,
          votes: 1089,
          engagement: 92,
        },
        { name: "Ir. Budi Santoso", polls: 32, votes: 987, engagement: 88 },
        { name: "Dra. Dewi Lestari", polls: 28, votes: 876, engagement: 85 },
        { name: "Dr. Eko Prasetyo", polls: 25, votes: 765, engagement: 82 },
      ],
    },
    categoryAnalysis: [
      {
        category: "Infrastructure",
        polls: 68,
        votes: 15420,
        avgParticipation: 227,
        growth: 45.2,
        satisfaction: 87,
      },
      {
        category: "Healthcare",
        polls: 52,
        votes: 12340,
        avgParticipation: 237,
        growth: 38.7,
        satisfaction: 84,
      },
      {
        category: "Education",
        polls: 48,
        votes: 10890,
        avgParticipation: 227,
        growth: 42.1,
        satisfaction: 81,
      },
      {
        category: "Environment",
        polls: 45,
        votes: 9876,
        avgParticipation: 219,
        growth: 52.3,
        satisfaction: 89,
      },
      {
        category: "Economy",
        polls: 38,
        votes: 8765,
        avgParticipation: 231,
        growth: 35.8,
        satisfaction: 78,
      },
      {
        category: "Social",
        polls: 35,
        votes: 7654,
        avgParticipation: 219,
        growth: 28.4,
        satisfaction: 82,
      },
    ],
    achievements: [
      {
        title: "Highest User Growth",
        description: "Achieved 131% user growth compared to previous year",
        icon: <RiseOutlined />,
        color: "#52c41a",
      },
      {
        title: "Most Engaging Poll",
        description: "Infrastructure poll reached 8,945 votes",
        icon: <TrophyOutlined />,
        color: "#faad14",
      },
      {
        title: "Platform Stability",
        description: "99.8% uptime throughout the year",
        icon: <ThunderboltOutlined />,
        color: "#1890ff",
      },
      {
        title: "Global Recognition",
        description:
          "Featured in 5 international digital democracy conferences",
        icon: <GlobalOutlined />,
        color: "#722ed1",
      },
    ],
    quarterlyComparison: [
      { quarter: "Q1", users: 3350, polls: 63, votes: 8680, satisfaction: 78 },
      { quarter: "Q2", users: 5450, polls: 95, votes: 14030, satisfaction: 82 },
      { quarter: "Q3", polls: 125, votes: 20570, satisfaction: 85 },
      {
        quarter: "Q4",
        users: 6620,
        polls: 135,
        votes: 23390,
        satisfaction: 87,
      },
    ],
  };

  useEffect(() => {
    setReportData(mockAnnualData);
  }, [selectedYear]);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  const handleExportReport = () => {
    console.log("Exporting annual report for:", selectedYear.format("YYYY"));
  };

  const handlePrintReport = () => {
    window.print();
  };

  const topPollsColumns = [
    {
      title: "Poll Title",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <div style={{ fontWeight: "bold", maxWidth: "300px" }}>{title}</div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Total Votes",
      dataIndex: "votes",
      key: "votes",
      render: (votes) => (
        <div style={{ fontWeight: "bold", color: "#1890ff" }}>
          {votes.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants",
      render: (participants) => <div>{participants.toLocaleString()}</div>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Impact",
      dataIndex: "impact",
      key: "impact",
      render: (impact) => (
        <Tag
          color={
            impact === "High" ? "red" : impact === "Medium" ? "orange" : "green"
          }
        >
          {impact}
        </Tag>
      ),
    },
  ];

  const monthlyTrendsColumns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "New Users",
      dataIndex: "users",
      key: "users",
      render: (value) => (
        <div style={{ color: "#52c41a", fontWeight: "bold" }}>
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: "New Polls",
      dataIndex: "polls",
      key: "polls",
      render: (value) => (
        <div style={{ color: "#1890ff", fontWeight: "bold" }}>{value}</div>
      ),
    },
    {
      title: "Total Votes",
      dataIndex: "votes",
      key: "votes",
      render: (value) => (
        <div style={{ color: "#faad14", fontWeight: "bold" }}>
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Interactions",
      dataIndex: "interactions",
      key: "interactions",
      render: (value) => (
        <div style={{ color: "#722ed1", fontWeight: "bold" }}>
          {value.toLocaleString()}
        </div>
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
      title: "Total Polls",
      dataIndex: "polls",
      key: "polls",
    },
    {
      title: "Total Votes",
      dataIndex: "votes",
      key: "votes",
      render: (votes) => (
        <div style={{ color: "#1890ff", fontWeight: "bold" }}>
          {votes.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Avg Participation",
      dataIndex: "avgParticipation",
      key: "avgParticipation",
    },
    {
      title: "Growth Rate",
      dataIndex: "growth",
      key: "growth",
      render: (growth) => (
        <div style={{ color: "#52c41a", fontWeight: "bold" }}>+{growth}%</div>
      ),
    },
    {
      title: "Satisfaction",
      dataIndex: "satisfaction",
      key: "satisfaction",
      render: (satisfaction) => (
        <Progress percent={satisfaction} size="small" />
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-lg">
                <BarChartOutlined
                  className="text-2xl"
                  style={{ color: "white" }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Laporan Tahunan
                </h1>
                <p className="text-gray-600">
                  Laporan komprehensif untuk tahun {selectedYear.format("YYYY")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DatePicker
                value={selectedYear}
                onChange={handleYearChange}
                picker="year"
                format="YYYY"
                placeholder="Pilih Tahun"
                className="h-10 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <DownloadOutlined />
                <span>Export</span>
              </button>
              <button
                onClick={handlePrintReport}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <PrinterOutlined />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <FileTextOutlined
                className="text-lg"
                style={{ color: "white" }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Ringkasan Eksekutif
              </h3>
              <p className="text-blue-800 leading-relaxed">
                Tahun ini menandai pertumbuhan yang luar biasa dengan
                peningkatan {reportData.summary?.userGrowth}% dalam basis
                pengguna,
                {reportData.summary?.newPolls} polling baru dibuat, dan{" "}
                {reportData.summary?.pollVotes?.toLocaleString()} total suara
                diberikan. Engagement platform mencapai{" "}
                {reportData.summary?.totalEngagement}% dengan peningkatan
                signifikan dalam kepuasan pengguna di semua kategori.
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pengguna</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary?.totalUsers?.toLocaleString()}
                </p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <RiseOutlined className="mr-1" />+
                  {reportData.summary?.userGrowth}%
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserOutlined className="text-xl" style={{ color: "blue" }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Polling</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary?.totalPolls}
                </p>
                <div className="text-gray-500 text-sm mt-1">
                  {reportData.summary?.newPolls} baru
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <BarChartOutlined
                  className=" text-xl"
                  style={{ color: "orange" }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Suara</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary?.pollVotes?.toLocaleString()}
                </p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <RiseOutlined className="mr-1" />+
                  {reportData.summary?.voteGrowth}%
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ThunderboltOutlined
                  className="text-xl"
                  style={{ color: "purple" }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Interaksi Chatbot</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary?.chatbotInteractions?.toLocaleString()}
                </p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <RiseOutlined className="mr-1" />+
                  {reportData.summary?.interactionGrowth}%
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MessageOutlined
                  className="text-xl"
                  style={{ color: "green" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrophyOutlined className="mr-2" style={{ color: "orange" }} />
              Pencapaian Utama
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Highlight prestasi terbaik tahun ini
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportData.achievements?.map((achievement, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors duration-200"
              >
                <div
                  className="text-3xl mb-3"
                  style={{ color: achievement.color }}
                >
                  {achievement.icon}
                </div>
                <div className="font-semibold text-gray-900 mb-2">
                  {achievement.title}
                </div>
                <div className="text-sm text-gray-600">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white px-6 rounded-xl border border-gray-200 shadow-sm">
          <Tabs defaultActiveKey="1" className="p-6">
            <TabPane tab="📈 Tren & Pertumbuhan" key="1">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <LineChartOutlined
                      className="mr-2"
                      style={{ color: "blue" }}
                    />
                    Tren Pertumbuhan Bulanan
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Data pertumbuhan per bulan sepanjang tahun
                  </p>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <Table
                    columns={monthlyTrendsColumns}
                    dataSource={reportData.monthlyTrends}
                    rowKey="month"
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                    className="border-0"
                  />
                </div>
              </div>
            </TabPane>

            <TabPane tab="🏆 Performa Terbaik" key="2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <TrophyOutlined className="text-yellow-500 mr-2" />
                        Polling Terbaik
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Polling dengan performa terbaik tahun ini
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <Table
                        columns={topPollsColumns}
                        dataSource={reportData.topPerformers?.polls}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: true }}
                        className="border-0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <StarOutlined className="text-purple-500 mr-2" />
                        Kontributor Terbaik
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Pengguna dengan kontribusi tertinggi
                      </p>
                    </div>
                    <div className="space-y-4">
                      {reportData.topPerformers?.users?.map((user, index) => (
                        <div key={index} className="bg-white rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm f style={{color: 'white'}}ont-bold mr-3 ${
                                index < 3 ? "bg-yellow-500" : "bg-gray-400"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="font-semibold text-gray-900">
                              {user.name}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {user.polls} polling • {user.votes} suara
                          </div>
                          <Progress
                            percent={user.engagement}
                            size="small"
                            strokeColor="#8b5cf6"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tab="📊 Analisis Kategori" key="3">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChartOutlined className="text-green-500 mr-2" />
                    Performa Kategori
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Analisis performa berdasarkan kategori polling
                  </p>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <Table
                    columns={categoryColumns}
                    dataSource={reportData.categoryAnalysis}
                    rowKey="category"
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                    className="border-0"
                  />
                </div>
              </div>
            </TabPane>

            <TabPane tab="📅 Ringkasan Kuartalan" key="4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportData.quarterlyComparison?.map((quarter, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        {quarter.quarter}
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {quarter.users?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Pengguna Baru
                          </div>
                        </div>

                        <div>
                          <div className="text-xl font-bold text-green-600">
                            {quarter.polls}
                          </div>
                          <div className="text-sm text-gray-600">
                            Polling Dibuat
                          </div>
                        </div>

                        <div>
                          <div className="text-xl font-bold text-purple-600">
                            {quarter.votes?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Suara
                          </div>
                        </div>

                        <div>
                          <Progress
                            percent={quarter.satisfaction}
                            size="small"
                            strokeColor="#8b5cf6"
                            format={(percent) => `${percent}%`}
                          />
                          <div className="text-sm text-gray-600 mt-2">
                            Kepuasan
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnnualReport;
