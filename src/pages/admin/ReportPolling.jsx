import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  Select,
  DatePicker,
  Space,
  Tag,
  Progress,
  Button,
  Divider,
  List,
  Avatar,
} from "antd";
import {
  BarChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  UserOutlined,
  CalendarOutlined,
  DownloadOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";


const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportPolling = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pollingSummary, setPollingSummary] = useState({
    totalPolls: 0,
    activePolls: 0,
    completedPolls: 0,
    totalVotes: 0,
    avgParticipation: 0,
    topCategory: "-",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [pollPerformance, setPollPerformance] = useState([]);

  const [categoryStats, setCategoryStats] = useState([]);

  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch polling report data from API
  const fetchPollingReport = async () => {
    try {
      setRefreshing(true);
      
      // Fetch polling summary
      const summaryResponse = await fetch('/api/admin/reports/polling-summary', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (summaryResponse.ok) {
        const summary = await summaryResponse.json();
        setPollingSummary({
          totalPolls: summary.total_polls || 0,
          activePolls: summary.active_polls || 0,
          completedPolls: summary.completed_polls || 0,
          totalVotes: summary.total_votes || 0,
          avgParticipation: summary.total_polls > 0 ? ((summary.total_votes / (summary.total_polls * 100)) * 100).toFixed(1) : 0,
          topCategory: "Pemilihan",
        });
      }
      
      // Fetch poll performance data
      const performanceResponse = await fetch('/api/admin/reports/poll-performance', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (performanceResponse.ok) {
        const performanceData = await performanceResponse.json();
        if (Array.isArray(performanceData)) {
          const formattedPerformance = performanceData.map(poll => ({
            id: poll.id,
            title: poll.title,
            category: poll.category || 'Umum',
            totalVotes: poll.total_votes || 0,
            targetVotes: 1000, // Default target
            participationRate: ((poll.total_votes / 1000) * 100).toFixed(1),
            status: poll.status,
            startDate: poll.start_date ? new Date(poll.start_date).toISOString().split('T')[0] : '',
            endDate: poll.end_date ? new Date(poll.end_date).toISOString().split('T')[0] : '',
            trend: poll.total_votes > 500 ? 'up' : 'down'
          }));
          setPollPerformance(formattedPerformance);
        } else {
          setPollPerformance([]);
        }
      }
      
      // Fetch category statistics
      const categoryResponse = await fetch('/api/admin/reports/category-stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategoryStats(categoryData);
      }
      
      // Fetch recent activities
      const activitiesResponse = await fetch('/api/admin/reports/recent-activities', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        const formattedActivities = Array.isArray(activitiesData) ? activitiesData.map((poll, index) => {
          const timeDiff = new Date() - new Date(poll.updated_at);
          const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
          const timeText = hoursAgo < 1 ? 'Baru saja' : hoursAgo < 24 ? `${hoursAgo} jam lalu` : `${Math.floor(hoursAgo / 24)} hari lalu`;
          
          return {
            id: poll.id,
            action: poll.status === 'completed' ? 'Poll Completed' : poll.status === 'active' ? 'Poll Active' : 'Poll Created',
            title: poll.title,
            timestamp: timeText,
            votes: poll.total_votes || 0,
            type: poll.status === 'completed' ? 'completed' : poll.total_votes > 100 ? 'milestone' : 'created'
          };
        }) : [];
        setRecentActivities(formattedActivities);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching polling report:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchPollingReport();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPollingReport, 30000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      title: "Poll Information",
      key: "pollInfo",
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: "14px", color: "#001529" }}>
            {record.title}
          </Text>
          <br />
          <Tag color="blue" style={{ marginTop: "4px" }}>
            {record.category}
          </Tag>
        </div>
      ),
    },
    {
      title: "Votes Progress",
      key: "votes",
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: "8px" }}>
            <Text strong>{record.totalVotes.toLocaleString()}</Text>
            <Text type="secondary">
              {" "}
              / {record.targetVotes.toLocaleString()}
            </Text>
          </div>
          <Progress
            percent={Math.round((record.totalVotes / record.targetVotes) * 100)}
            size="small"
            status={
              record.totalVotes >= record.targetVotes ? "success" : "active"
            }
          />
        </div>
      ),
    },
    {
      title: "Participation Rate",
      key: "participation",
      render: (_, record) => (
        <div>
          <Text
            strong
            style={{
              color:
                record.participationRate >= 70
                  ? "#52c41a"
                  : record.participationRate >= 50
                  ? "#faad14"
                  : "#ff4d4f",
            }}
          >
            {record.participationRate}%
          </Text>
          <div style={{ marginTop: "4px" }}>
            {record.trend === "up" ? (
              <RiseOutlined style={{ color: "#52c41a", marginRight: "4px" }} />
            ) : (
              <FallOutlined style={{ color: "#ff4d4f", marginRight: "4px" }} />
            )}
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.trend === "up" ? "Trending Up" : "Trending Down"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "completed" ? "green" : "blue"}
          icon={
            status === "completed" ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => (
        <div>
          <div style={{ fontSize: "12px" }}>
            <CalendarOutlined style={{ marginRight: "4px" }} />
            {new Date(record.startDate).toLocaleDateString("id-ID", {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
          </div>
          <div style={{ fontSize: "12px", marginTop: "2px" }}>
            <Text type="secondary">to</Text>
          </div>
          <div style={{ fontSize: "12px" }}>
            <CalendarOutlined style={{ marginRight: "4px" }} />
            {new Date(record.endDate).toLocaleDateString("id-ID", {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="default" size="small" icon={<EyeOutlined />}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "completed":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "milestone":
        return <TrophyOutlined style={{ color: "#faad14" }} />;
      case "created":
        return <PieChartOutlined style={{ color: "#1890ff" }} />;
      case "alert":
        return <ClockCircleOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <BarChartOutlined />;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-lg">
            <BarChartOutlined className="text-2xl" style={{ color: "white" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Polling Reports & Analytics
            </h1>
          </div>
        </div>

        {/* Controls */}
        <Card style={{ marginBottom: "24px" }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Space>
                <Text strong>Period:</Text>
                <Select
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  style={{ width: 120 }}
                >
                  <Option value="week">This Week</Option>
                  <Option value="month">This Month</Option>
                  <Option value="quarter">This Quarter</Option>
                  <Option value="year">This Year</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space>
                <Text strong>Category:</Text>
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: 150 }}
                >
                  <Option value="all">All Categories</Option>
                  <Option value="pemilihan">Pemilihan</Option>
                  <Option value="survey">Survey</Option>
                  <Option value="anggaran">Anggaran</Option>
                  <Option value="kesehatan">Kesehatan</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: "right" }}>
              <Button type="primary" icon={<DownloadOutlined />}>
                Export Report
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Summary Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Total Polls"
                value={pollingSummary.totalPolls}
                prefix={<BarChartOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Active Polls"
                value={pollingSummary.activePolls}
                prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Completed"
                value={pollingSummary.completedPolls}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Total Votes"
                value={pollingSummary.totalVotes}
                prefix={<UserOutlined style={{ color: "#722ed1" }} />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Avg Participation"
                value={pollingSummary.avgParticipation}
                suffix="%"
                prefix={<RiseOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Top Category"
                value={pollingSummary.topCategory}
                prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14", fontSize: "20px" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Poll Performance Table */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span>📈 Poll Performance Analysis</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${refreshing ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      <span className="text-sm text-gray-600">
                        {refreshing ? 'Refreshing...' : 'Terhubung'}
                      </span>
                    </div>
                    {lastUpdated && (
                      <span className="text-xs text-gray-500">
                        Update: {lastUpdated.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              }
            >
              <Table
                columns={columns}
                dataSource={pollPerformance}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                  showQuickJumper: false,
                }}
                scroll={{ x: 800 }}
                size="small"
              />
            </Card>
          </Col>

          {/* Recent Activities */}
          <Col xs={24} lg={8}>
            <Card title="🔔 Recent Activities" style={{ height: "600px" }}>
              <List
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={getActivityIcon(item.type)} style={{background: 'white'}} />}
                      title={
                        <div>
                          <Text strong style={{ fontSize: "13px" }}>
                            {item.action}
                          </Text>
                          <br />
                          <Text style={{ fontSize: "12px", color: "#666" }}>
                            {item.title}
                          </Text>
                        </div>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: "11px" }}>
                            {item.timestamp}
                          </Text>
                          {item.votes > 0 && (
                            <>
                              <br />
                              <Text style={{ fontSize: "11px" }}>
                                {item.votes.toLocaleString()} votes
                              </Text>
                            </>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Category Statistics */}
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col xs={24}>
            <Card title="📊 Performance by Category">
              <Row gutter={[16, 16]}>
                {categoryStats.map((category, index) => (
                  <Col xs={24} sm={12} md={8} lg={4} xl={4} key={index}>
                    <Card size="small" style={{ textAlign: "center" }}>
                      <Title
                        level={4}
                        style={{ margin: "8px 0", color: "#001529" }}
                      >
                        {category.category}
                      </Title>
                      <Divider style={{ margin: "8px 0" }} />
                      <Row gutter={[8, 8]}>
                        <Col span={24}>
                          <Statistic
                            title="Polls"
                            value={category.polls}
                            valueStyle={{ fontSize: "18px", color: "#1890ff" }}
                          />
                        </Col>
                        <Col span={24}>
                          <Statistic
                            title="Total Votes"
                            value={category.votes}
                            valueStyle={{ fontSize: "16px", color: "#52c41a" }}
                          />
                        </Col>
                        <Col span={24}>
                          <div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              Avg Participation
                            </Text>
                            <br />
                            <Text
                              strong
                              style={{
                                color:
                                  category.avgParticipation >= 70
                                    ? "#52c41a"
                                    : category.avgParticipation >= 50
                                    ? "#faad14"
                                    : "#ff4d4f",
                                fontSize: "16px",
                              }}
                            >
                              {category.avgParticipation}%
                            </Text>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
    </div>
  );
};

export default ReportPolling;