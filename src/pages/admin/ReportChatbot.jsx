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
  List,
  Avatar,
  Divider,
  Timeline,
  Rate,
  Spin,
} from "antd";
import {
  RobotOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  WarningOutlined,
  BarChartOutlined,
} from "@ant-design/icons";


const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportChatbot = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [loading, setLoading] = useState(true);
  const [chatbotSummary, setChatbotSummary] = useState({
    totalInteractions: 0,
    activeUsers: 0,
    avgResponseTime: 0,
    satisfactionRate: 0,
    resolutionRate: 0,
    popularTopic: "",
  });

  const [interactionStats, setInteractionStats] = useState([]);

  const [recentConversations, setRecentConversations] = useState([]);

  const [performanceMetrics, setPerformanceMetrics] = useState([]);

  const [commonIssues, setCommonIssues] = useState([]);

  // Fetch chatbot report data from API
  const fetchChatbotReport = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports/chatbot', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update summary data
        setChatbotSummary({
          totalInteractions: data.summary?.total_interactions || 0,
          activeUsers: data.summary?.active_users || 0,
          avgResponseTime: data.summary?.avg_response_time || 0,
          satisfactionRate: data.summary?.satisfaction_rate || 0,
          resolutionRate: data.summary?.resolution_rate || 0,
          popularTopic: data.summary?.popular_topic || 'N/A',
        });

        // Update interaction stats
        setInteractionStats(data.interaction_stats || []);
        
        // Update recent conversations
        setRecentConversations(data.recent_conversations || []);
        
        // Update performance metrics
        setPerformanceMetrics(data.performance_metrics || []);
        
        // Update common issues
        setCommonIssues(data.common_issues || []);
      } else {
        console.error('Failed to fetch chatbot report data');
      }
    } catch (error) {
      console.error('Error fetching chatbot report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbotReport();
  }, [selectedPeriod, selectedMetric]);

  const columns = [
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      render: (topic) => (
        <Text strong style={{ color: "#001529" }}>
          {topic}
        </Text>
      ),
    },
    {
      title: "Interactions",
      dataIndex: "interactions",
      key: "interactions",
      render: (interactions, record) => (
        <div>
          <Text strong>{interactions.toLocaleString()}</Text>
          <div style={{ marginTop: "4px" }}>
            {record.trend === "up" ? (
              <RiseOutlined style={{ color: "#52c41a", marginRight: "4px" }} />
            ) : (
              <FallOutlined style={{ color: "#ff4d4f", marginRight: "4px" }} />
            )}
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.trend === "up" ? "Increasing" : "Decreasing"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Avg Response Time",
      dataIndex: "avgResponseTime",
      key: "avgResponseTime",
      render: (time) => (
        <Text
          style={{
            color:
              time <= 1.0 ? "#52c41a" : time <= 1.5 ? "#faad14" : "#ff4d4f",
          }}
        >
          {time}s
        </Text>
      ),
    },
    {
      title: "Satisfaction",
      dataIndex: "satisfactionRate",
      key: "satisfactionRate",
      render: (rate) => (
        <div>
          <Rate disabled value={rate} style={{ fontSize: "14px" }} />
          <br />
          <Text style={{ fontSize: "12px" }}>{rate}/5.0</Text>
        </div>
      ),
    },
    {
      title: "Resolution Rate",
      dataIndex: "resolutionRate",
      key: "resolutionRate",
      render: (rate) => (
        <div>
          <Text
            strong
            style={{
              color:
                rate >= 80 ? "#52c41a" : rate >= 70 ? "#faad14" : "#ff4d4f",
            }}
          >
            {rate}%
          </Text>
          <br />
          <Progress
            percent={rate}
            size="small"
            showInfo={false}
            strokeColor={
              rate >= 80 ? "#52c41a" : rate >= 70 ? "#faad14" : "#ff4d4f"
            }
          />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Button type="default" size="small" icon={<EyeOutlined />}>
          View Details
        </Button>
      ),
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "escalated":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "pending":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      default:
        return <QuestionCircleOutlined />;
    }
  };

  const getIssueIcon = (impact) => {
    switch (impact) {
      case "high":
        return <WarningOutlined style={{ color: "#ff4d4f" }} />;
      case "medium":
        return <ExclamationCircleOutlined style={{ color: "#faad14" }} />;
      case "low":
        return <BulbOutlined style={{ color: "#52c41a" }} />;
      default:
        return <QuestionCircleOutlined />;
    }
  };

  const getMetricStatus = (status) => {
    switch (status) {
      case "good":
        return { color: "#52c41a", text: "Good" };
      case "warning":
        return { color: "#faad14", text: "Needs Attention" };
      case "poor":
        return { color: "#ff4d4f", text: "Poor" };
      default:
        return { color: "#666", text: "Unknown" };
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100">
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading chatbot report data...">
            <div style={{ minHeight: '200px' }} />
          </Spin>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg">
            <BarChartOutlined className="text-2xl" style={{ color: "white" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Chatbot Analytics & Reports
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
                <Text strong>Metric:</Text>
                <Select
                  value={selectedMetric}
                  onChange={setSelectedMetric}
                  style={{ width: 150 }}
                >
                  <Option value="all">All Metrics</Option>
                  <Option value="interactions">Interactions</Option>
                  <Option value="satisfaction">Satisfaction</Option>
                  <Option value="performance">Performance</Option>
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
                title="Total Interactions"
                value={chatbotSummary.totalInteractions}
                prefix={<MessageOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Active Users"
                value={chatbotSummary.activeUsers}
                prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Avg Response Time"
                value={chatbotSummary.avgResponseTime}
                suffix="s"
                prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Satisfaction Rate"
                value={chatbotSummary.satisfactionRate}
                suffix="/5.0"
                prefix={<StarOutlined style={{ color: "#722ed1" }} />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Resolution Rate"
                value={chatbotSummary.resolutionRate}
                suffix="%"
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Popular Topic"
                value={chatbotSummary.popularTopic}
                prefix={<RobotOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff", fontSize: "16px" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Interaction Statistics Table */}
          <Col xs={24} xl={16}>
            <Card
              title="📊 Topic Performance Analysis"
              style={{ height: "500px" }}
            >
              <Table
                columns={columns}
                dataSource={interactionStats}
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

          {/* Recent Conversations */}
          <Col xs={24} xl={8}>
            <Card title="💬 Recent Conversations" style={{ height: "500px" }}>
              <List
                dataSource={recentConversations}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={getStatusIcon(item.status)}
                          style={{ background: "white" }}
                        />
                      }
                      title={
                        <div>
                          <Text strong style={{ fontSize: "13px" }}>
                            {item.user}
                          </Text>
                          <br />
                          <Text style={{ fontSize: "12px", color: "#666" }}>
                            {item.topic}
                          </Text>
                        </div>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: "11px" }}>
                            {item.timestamp} • {item.duration}
                          </Text>
                          <br />
                          <Rate
                            disabled
                            value={item.satisfaction}
                            style={{ fontSize: "10px" }}
                          />
                          <Tag
                            size="small"
                            color={item.status === "resolved" ? "green" : "red"}
                            style={{ marginLeft: "8px" }}
                          >
                            {item.status}
                          </Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          {/* Performance Metrics */}
          <Col xs={24} lg={12}>
            <Card title="📈 Performance Metrics">
              <Row gutter={[16, 16]}>
                {performanceMetrics.map((metric, index) => {
                  const status = getMetricStatus(metric.status);
                  return (
                    <Col xs={24} sm={12} key={index}>
                      <Card size="small">
                        <div style={{ textAlign: "center" }}>
                          <Text strong style={{ fontSize: "14px" }}>
                            {metric.metric}
                          </Text>
                          <br />
                          <Text
                            style={{
                              fontSize: "24px",
                              color: status.color,
                              fontWeight: "bold",
                            }}
                          >
                            {metric.value}
                            {metric.metric.includes("Time")
                              ? "s"
                              : metric.metric.includes("Satisfaction")
                              ? "/5"
                              : "%"}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Target: {metric.target}
                            {metric.metric.includes("Time")
                              ? "s"
                              : metric.metric.includes("Satisfaction")
                              ? "/5"
                              : "%"}
                          </Text>
                          <br />
                          <Tag
                            color={status.color}
                            style={{ marginTop: "4px" }}
                          >
                            {status.text}
                          </Tag>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </Col>

          {/* Common Issues */}
          <Col xs={24} lg={12}>
            <Card title="⚠️ Common Issues & Improvements">
              <List
                dataSource={commonIssues}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={getIssueIcon(item.impact)}
                          style={{ background: "white" }}
                        />
                      }
                      title={
                        <div>
                          <Text strong style={{ fontSize: "13px" }}>
                            {item.issue}
                          </Text>
                          <br />
                          <Space style={{ marginTop: "4px" }}>
                            <Tag
                              color={
                                item.impact === "high"
                                  ? "red"
                                  : item.impact === "medium"
                                  ? "orange"
                                  : "green"
                              }
                            >
                              {item.impact.toUpperCase()} IMPACT
                            </Tag>
                            <Tag color="blue">{item.frequency} occurrences</Tag>
                            <Tag
                              color={
                                item.status === "resolved"
                                  ? "green"
                                  : item.status === "in_progress"
                                  ? "orange"
                                  : "blue"
                              }
                            >
                              {item.status.replace("_", " ").toUpperCase()}
                            </Tag>
                          </Space>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
    </div>
  );
};

export default ReportChatbot;