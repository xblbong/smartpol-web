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
  PieChartOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import SidebarComponents from "../../components/layouts/SidebarComponents";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const MonthlyReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data untuk monthly report
  const mockMonthlyData = {
    summary: {
      totalUsers: 1250,
      newUsers: 185,
      activeUsers: 890,
      userGrowth: 17.2,
      totalPolls: 45,
      newPolls: 12,
      pollVotes: 2340,
      voteGrowth: 23.5,
      chatbotInteractions: 1567,
      interactionGrowth: 15.8,
      policyViews: 3421,
      viewGrowth: 12.3,
    },
    topPolls: [
      {
        id: 1,
        title: "Prioritas Pembangunan Infrastruktur 2024",
        votes: 456,
        participants: 234,
        completion: 89,
        category: "Infrastructure",
        status: "completed",
      },
      {
        id: 2,
        title: "Evaluasi Program Kesehatan Masyarakat",
        votes: 389,
        participants: 198,
        completion: 76,
        category: "Healthcare",
        status: "active",
      },
      {
        id: 3,
        title: "Kebijakan Lingkungan dan Sustainability",
        votes: 345,
        participants: 167,
        completion: 82,
        category: "Environment",
        status: "completed",
      },
      {
        id: 4,
        title: "Anggaran Pendidikan 2024",
        votes: 298,
        participants: 145,
        completion: 65,
        category: "Education",
        status: "active",
      },
      {
        id: 5,
        title: "Program Bantuan Sosial",
        votes: 267,
        participants: 134,
        completion: 71,
        category: "Social",
        status: "completed",
      },
    ],
    userEngagement: [
      {
        week: "Week 1",
        newUsers: 45,
        activeUsers: 234,
        pollVotes: 567,
        chatbotUse: 123,
      },
      {
        week: "Week 2",
        newUsers: 52,
        activeUsers: 267,
        pollVotes: 634,
        chatbotUse: 145,
      },
      {
        week: "Week 3",
        newUsers: 38,
        activeUsers: 298,
        pollVotes: 589,
        chatbotUse: 167,
      },
      {
        week: "Week 4",
        newUsers: 50,
        activeUsers: 312,
        pollVotes: 550,
        chatbotUse: 189,
      },
    ],
    categoryStats: [
      { category: "Infrastructure", polls: 8, votes: 1234, engagement: 85 },
      { category: "Healthcare", polls: 6, votes: 987, engagement: 78 },
      { category: "Education", polls: 7, votes: 876, engagement: 72 },
      { category: "Environment", polls: 5, votes: 654, engagement: 68 },
      { category: "Social", polls: 4, votes: 543, engagement: 65 },
      { category: "Economy", polls: 3, votes: 432, engagement: 62 },
    ],
    demographics: {
      ageGroups: [
        { range: "18-25", count: 234, percentage: 18.7 },
        { range: "26-35", count: 345, percentage: 27.6 },
        { range: "36-45", count: 298, percentage: 23.8 },
        { range: "46-55", count: 234, percentage: 18.7 },
        { range: "56+", count: 139, percentage: 11.1 },
      ],
      regions: [
        { name: "Jakarta", users: 345, percentage: 27.6 },
        { name: "Surabaya", users: 234, percentage: 18.7 },
        { name: "Bandung", users: 198, percentage: 15.8 },
        { name: "Medan", users: 167, percentage: 13.4 },
        { name: "Others", users: 306, percentage: 24.5 },
      ],
    },
  };

  useEffect(() => {
    setReportData(mockMonthlyData);
  }, [selectedMonth]);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    // In real app, fetch data for selected month
  };

  const handleExportReport = () => {
    console.log(
      "Exporting monthly report for:",
      selectedMonth.format("MMMM YYYY")
    );
  };

  const handlePrintReport = () => {
    window.print();
  };

  const topPollsColumns = [
    {
      title: "Poll Title",
      dataIndex: "title",
      key: "title",
      render: (title) => <div style={{ fontWeight: "bold" }}>{title}</div>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
      render: (votes) => (
        <div style={{ fontWeight: "bold", color: "#1890ff" }}>{votes}</div>
      ),
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants",
    },
    {
      title: "Completion",
      dataIndex: "completion",
      key: "completion",
      render: (completion) => <Progress percent={completion} size="small" />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const engagementColumns = [
    {
      title: "Week",
      dataIndex: "week",
      key: "week",
    },
    {
      title: "New Users",
      dataIndex: "newUsers",
      key: "newUsers",
      render: (value) => (
        <div style={{ color: "#52c41a", fontWeight: "bold" }}>{value}</div>
      ),
    },
    {
      title: "Active Users",
      dataIndex: "activeUsers",
      key: "activeUsers",
      render: (value) => (
        <div style={{ color: "#1890ff", fontWeight: "bold" }}>{value}</div>
      ),
    },
    {
      title: "Poll Votes",
      dataIndex: "pollVotes",
      key: "pollVotes",
      render: (value) => (
        <div style={{ color: "#faad14", fontWeight: "bold" }}>{value}</div>
      ),
    },
    {
      title: "Chatbot Use",
      dataIndex: "chatbotUse",
      key: "chatbotUse",
      render: (value) => (
        <div style={{ color: "#722ed1", fontWeight: "bold" }}>{value}</div>
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
        <div style={{ color: "#1890ff", fontWeight: "bold" }}>{votes}</div>
      ),
    },
    {
      title: "Engagement Rate",
      dataIndex: "engagement",
      key: "engagement",
      render: (engagement) => <Progress percent={engagement} size="small" />,
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <LineChartOutlined
                  className="text-xl"
                  style={{ color: "white" }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Laporan Bulanan
                </h1>
                <p className="text-gray-600 mt-1">
                  Analisis komprehensif aktivitas dan tren bulanan
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DatePicker
                value={selectedMonth}
                onChange={handleMonthChange}
                picker="month"
                format="MMMM YYYY"
                placeholder="Pilih Bulan"
                className="h-10 rounded-lg border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
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
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
              >
                <PrinterOutlined className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              📅 Laporan untuk {selectedMonth.format("MMMM YYYY")}
            </p>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-xl" style={{ color: "white" }} />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <RiseOutlined className="w-4 h-4 mr-1" />+
                {reportData.summary?.userGrowth}%
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Pengguna</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary?.totalUsers}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pertumbuhan bulan ini
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-xl" style={{ color: "white" }} />
              </div>
              <div className="text-xs text-gray-500 font-medium">Bulan Ini</div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Pengguna Baru</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary?.newUsers}
              </p>
              <p className="text-xs text-gray-500 mt-1">Registrasi baru</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <BarChartOutlined
                  className="text-xl"
                  style={{ color: "white" }}
                />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <RiseOutlined className="w-4 h-4 mr-1" />+
                {reportData.summary?.voteGrowth}%
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Suara Polling</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary?.pollVotes}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total suara bulan ini
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageOutlined
                  className="text-xl"
                  style={{ color: "white" }}
                />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <RiseOutlined className="w-4 h-4 mr-1" />+
                {reportData.summary?.interactionGrowth}%
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Interaksi Chatbot</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary?.chatbotInteractions}
              </p>
              <p className="text-xs text-gray-500 mt-1">Percakapan bulan ini</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <Tabs defaultActiveKey="1" className="p-6">
            <TabPane tab="📊 Ringkasan" key="1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Performing Polls */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <TrophyOutlined className="text-yellow-500 mr-2" />
                        Polling Terbaik
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Polling dengan performa terbaik bulan ini
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <Table
                        columns={topPollsColumns}
                        dataSource={reportData.topPolls}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        className="border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <RiseOutlined className="text-green-500 mr-2" />
                        Metrik Pertumbuhan
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Persentase pertumbuhan bulan ini
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Pertumbuhan Pengguna
                        </span>
                        <span className="font-bold text-green-600">
                          +{reportData.summary?.userGrowth}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pertumbuhan Suara</span>
                        <span className="font-bold text-blue-600">
                          +{reportData.summary?.voteGrowth}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Pertumbuhan Interaksi
                        </span>
                        <span className="font-bold text-purple-600">
                          +{reportData.summary?.interactionGrowth}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Pertumbuhan Tampilan
                        </span>
                        <span className="font-bold text-orange-600">
                          +{reportData.summary?.viewGrowth}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BarChartOutlined className="text-indigo-500 mr-2" />
                        Performa Kategori
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Tingkat engagement per kategori
                      </p>
                    </div>
                    <div className="space-y-4">
                      {reportData.categoryStats?.slice(0, 4).map((item) => (
                        <div key={item.category}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">
                              {item.category}
                            </span>
                            <span className="font-bold text-gray-900">
                              {item.votes} suara
                            </span>
                          </div>
                          <Progress
                            percent={item.engagement}
                            size="small"
                            strokeColor="#6366f1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tab="📅 Tren Mingguan" key="2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChartOutlined className="text-blue-500 mr-2" />
                      Engagement Mingguan
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Data engagement per minggu dalam bulan ini
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <Table
                      columns={engagementColumns}
                      dataSource={reportData.userEngagement}
                      rowKey="week"
                      pagination={false}
                      size="small"
                      className="border-0"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <TrophyOutlined className="text-purple-500 mr-2" />
                      Performa Kategori Polling
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Tingkat engagement per kategori polling
                    </p>
                  </div>
                  <div className="space-y-4">
                    {reportData.categoryStats?.map((item) => (
                      <div key={item.category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900">
                            {item.category}
                          </span>
                          <span className="text-gray-600">
                            {item.votes} suara
                          </span>
                        </div>
                        <Progress
                          percent={item.engagement}
                          strokeColor={{
                            "0%": "#6366f1",
                            "100%": "#10b981",
                          }}
                          className="mb-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tab="🏷️ Categories" key="3">
              <Card title="Poll Categories Performance">
                <Table
                  columns={categoryColumns}
                  dataSource={reportData.categoryStats}
                  rowKey="category"
                  pagination={false}
                />
              </Card>
            </TabPane>

            <TabPane tab="👥 Demografi" key="4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <UserOutlined className="text-purple-500 mr-2" />
                      Distribusi Usia
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sebaran pengguna berdasarkan kelompok usia
                    </p>
                  </div>
                  <div className="space-y-4">
                    {reportData.demographics?.ageGroups?.map((item) => (
                      <div key={item.range}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">{item.range}</span>
                          <span className="font-bold text-purple-600">
                            {item.percentage}%
                          </span>
                        </div>
                        <Progress
                          percent={item.percentage}
                          strokeColor="#8b5cf6"
                          className="mb-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <GlobalOutlined className="text-orange-500 mr-2" />
                      Distribusi Regional
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sebaran pengguna berdasarkan wilayah
                    </p>
                  </div>
                  <div className="space-y-4">
                    {reportData.demographics?.regions?.map((item) => (
                      <div key={item.region}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">{item.region}</span>
                          <span className="font-bold text-orange-600">
                            {item.users} pengguna ({item.percentage}%)
                          </span>
                        </div>
                        <Progress
                          percent={item.percentage}
                          strokeColor="#f97316"
                          className="mb-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
