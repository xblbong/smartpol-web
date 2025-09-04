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
  Divider,
  Tabs,
  Alert,
  Tooltip
} from 'antd';
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
  CalendarOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const Analytics = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [selectedMetric, setSelectedMetric] = useState('all');
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
      satisfactionScore: 87.3
    },
    realTimeMetrics: {
      onlineUsers: 234,
      activePolls: 12,
      votesLastHour: 89,
      chatbotQueries: 45,
      serverLoad: 67,
      responseTime: 1.2
    },
    userBehavior: {
      topPages: [
        { page: '/polls', visits: 12450, avgTime: '3:45', bounceRate: 23.4 },
        { page: '/dashboard', visits: 8970, avgTime: '2:30', bounceRate: 18.7 },
        { page: '/policies', visits: 6780, avgTime: '4:12', bounceRate: 31.2 },
        { page: '/chatbot', visits: 5430, avgTime: '5:20', bounceRate: 15.6 },
        { page: '/reports', visits: 3210, avgTime: '6:15', bounceRate: 28.9 }
      ],
      deviceTypes: [
        { device: 'Mobile', users: 8750, percentage: 56.7 },
        { device: 'Desktop', users: 5420, percentage: 35.2 },
        { device: 'Tablet', users: 1250, percentage: 8.1 }
      ],
      browsers: [
        { browser: 'Chrome', users: 9870, percentage: 64.0 },
        { browser: 'Firefox', users: 2340, percentage: 15.2 },
        { browser: 'Safari', users: 1890, percentage: 12.3 },
        { browser: 'Edge', users: 1320, percentage: 8.5 }
      ]
    },
    pollAnalytics: {
      categoryPerformance: [
        { category: 'Infrastructure', polls: 68, votes: 15420, engagement: 89.2, satisfaction: 87 },
        { category: 'Healthcare', polls: 52, votes: 12340, engagement: 85.7, satisfaction: 84 },
        { category: 'Education', polls: 48, votes: 10890, engagement: 82.3, satisfaction: 81 },
        { category: 'Environment', polls: 45, votes: 9876, engagement: 91.5, satisfaction: 89 },
        { category: 'Economy', polls: 38, votes: 8765, engagement: 78.9, satisfaction: 78 },
        { category: 'Social', polls: 35, votes: 7654, engagement: 80.1, satisfaction: 82 }
      ],
      votingPatterns: [
        { hour: '00:00', votes: 45 },
        { hour: '02:00', votes: 23 },
        { hour: '04:00', votes: 12 },
        { hour: '06:00', votes: 34 },
        { hour: '08:00', votes: 156 },
        { hour: '10:00', votes: 234 },
        { hour: '12:00', votes: 298 },
        { hour: '14:00', votes: 267 },
        { hour: '16:00', votes: 189 },
        { hour: '18:00', votes: 345 },
        { hour: '20:00', votes: 278 },
        { hour: '22:00', votes: 167 }
      ],
      topKeywords: [
        { keyword: 'infrastruktur', count: 1234, trend: 'up' },
        { keyword: 'kesehatan', count: 987, trend: 'up' },
        { keyword: 'pendidikan', count: 876, trend: 'down' },
        { keyword: 'lingkungan', count: 765, trend: 'up' },
        { keyword: 'ekonomi', count: 654, trend: 'stable' },
        { keyword: 'sosial', count: 543, trend: 'up' }
      ]
    },
    chatbotAnalytics: {
      topQuestions: [
        { question: 'Bagaimana cara voting?', count: 456, category: 'Tutorial' },
        { question: 'Apa itu polling?', count: 389, category: 'General' },
        { question: 'Cara melihat hasil polling?', count: 345, category: 'Tutorial' },
        { question: 'Kebijakan privasi data', count: 298, category: 'Privacy' },
        { question: 'Cara menghubungi admin?', count: 267, category: 'Support' }
      ],
      satisfactionRatings: [
        { rating: '5 Stars', count: 3456, percentage: 67.8 },
        { rating: '4 Stars', count: 1234, percentage: 24.2 },
        { rating: '3 Stars', count: 298, percentage: 5.8 },
        { rating: '2 Stars', count: 89, percentage: 1.7 },
        { rating: '1 Star', count: 23, percentage: 0.5 }
      ],
      responseTime: {
        avg: 1.2,
        fastest: 0.3,
        slowest: 4.5,
        under1s: 78.5,
        under3s: 94.2
      }
    },
    performanceMetrics: {
      systemHealth: {
        uptime: 99.8,
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        diskUsage: 34.5,
        networkLatency: 23.4
      },
      apiMetrics: {
        totalRequests: 234567,
        successRate: 99.2,
        avgResponseTime: 245,
        errorRate: 0.8,
        peakRPS: 1234
      }
    }
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
    console.log('Exporting analytics data...');
  };

  const topPagesColumns = [
    {
      title: 'Page',
      dataIndex: 'page',
      key: 'page',
      render: (page) => (
        <div style={{ fontWeight: 'bold' }}>{page}</div>
      ),
    },
    {
      title: 'Visits',
      dataIndex: 'visits',
      key: 'visits',
      render: (visits) => (
        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>{visits.toLocaleString()}</div>
      ),
    },
    {
      title: 'Avg Time',
      dataIndex: 'avgTime',
      key: 'avgTime',
    },
    {
      title: 'Bounce Rate',
      dataIndex: 'bounceRate',
      key: 'bounceRate',
      render: (rate) => (
        <div style={{ color: rate > 25 ? '#ff4d4f' : '#52c41a' }}>{rate}%</div>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <div style={{ fontWeight: 'bold' }}>{category}</div>
      ),
    },
    {
      title: 'Polls',
      dataIndex: 'polls',
      key: 'polls',
    },
    {
      title: 'Votes',
      dataIndex: 'votes',
      key: 'votes',
      render: (votes) => (
        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>{votes.toLocaleString()}</div>
      ),
    },
    {
      title: 'Engagement',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (engagement) => (
        <Progress percent={engagement} size="small" />
      ),
    },
    {
      title: 'Satisfaction',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      render: (satisfaction) => (
        <Progress percent={satisfaction} size="small" strokeColor="#52c41a" />
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#001529' }}>
            📊 Analytics Dashboard
          </Title>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
            />
            <Select
              value={selectedMetric}
              onChange={handleMetricChange}
              style={{ width: 120 }}
            >
              <Option value="all">All Metrics</Option>
              <Option value="users">Users</Option>
              <Option value="polls">Polls</Option>
              <Option value="chatbot">Chatbot</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
              Refresh
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportData}>
              Export
            </Button>
          </Space>
        </div>

        {/* Real-time Metrics */}
        <Alert
          message="Real-time Status"
          description={`${analyticsData.realTimeMetrics?.onlineUsers} users online • ${analyticsData.realTimeMetrics?.activePolls} active polls • ${analyticsData.realTimeMetrics?.votesLastHour} votes in last hour`}
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        {/* Key Performance Indicators */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={analyticsData.overview?.totalUsers}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                suffix={
                  <Tooltip title="User Retention Rate">
                    <div style={{ fontSize: '12px', color: '#52c41a' }}>
                      {analyticsData.overview?.userRetention}% retention
                    </div>
                  </Tooltip>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Poll Engagement"
                value={analyticsData.overview?.pollEngagement}
                prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Total Votes"
                value={analyticsData.overview?.totalVotes}
                prefix={<ThunderboltOutlined style={{ color: '#722ed1' }} />}
                suffix={
                  <div style={{ fontSize: '12px', color: '#52c41a' }}>
                    <RiseOutlined /> +{analyticsData.overview?.voteGrowth}%
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Satisfaction Score"
                value={analyticsData.overview?.satisfactionScore}
                prefix={<HeartOutlined style={{ color: '#52c41a' }} />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        <Tabs defaultActiveKey="1">
          <TabPane tab="📈 User Analytics" key="1">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card title="Top Pages Performance" style={{ marginBottom: '16px' }}>
                  <Table
                    columns={topPagesColumns}
                    dataSource={analyticsData.userBehavior?.topPages}
                    rowKey="page"
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Device Distribution" style={{ marginBottom: '16px' }}>
                  <List
                    dataSource={analyticsData.userBehavior?.deviceTypes}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>{item.device}</span>
                            <span style={{ fontWeight: 'bold' }}>{item.users.toLocaleString()}</span>
                          </div>
                          <Progress percent={item.percentage} size="small" />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
                <Card title="Browser Usage">
                  <List
                    size="small"
                    dataSource={analyticsData.userBehavior?.browsers}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{item.browser}</span>
                          <span style={{ fontWeight: 'bold' }}>{item.percentage}%</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="🗳️ Poll Analytics" key="2">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card title="Category Performance Analysis">
                  <Table
                    columns={categoryColumns}
                    dataSource={analyticsData.pollAnalytics?.categoryPerformance}
                    rowKey="category"
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Top Keywords" style={{ marginBottom: '16px' }}>
                  <List
                    size="small"
                    dataSource={analyticsData.pollAnalytics?.topKeywords}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>{item.keyword}</span>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{item.count}</span>
                            {item.trend === 'up' && <RiseOutlined style={{ color: '#52c41a' }} />}
                            {item.trend === 'down' && <FallOutlined style={{ color: '#ff4d4f' }} />}
                            {item.trend === 'stable' && <div style={{ width: '8px', height: '2px', backgroundColor: '#faad14' }} />}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
                <Card title="Voting Patterns">
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Peak hours: 12:00 PM, 6:00 PM</div>
                  <List
                    size="small"
                    dataSource={analyticsData.pollAnalytics?.votingPatterns?.filter((_, index) => index % 2 === 0)}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{item.hour}</span>
                          <span style={{ fontWeight: 'bold' }}>{item.votes} votes</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="🤖 Chatbot Analytics" key="3">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Top Questions" style={{ marginBottom: '16px' }}>
                  <List
                    dataSource={analyticsData.chatbotAnalytics?.topQuestions}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>{item.question}</span>
                            <span style={{ color: '#1890ff' }}>{item.count}</span>
                          </div>
                          <Tag size="small" color="blue">{item.category}</Tag>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="User Satisfaction" style={{ marginBottom: '16px' }}>
                  <List
                    dataSource={analyticsData.chatbotAnalytics?.satisfactionRatings}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>{item.rating}</span>
                            <span style={{ fontWeight: 'bold' }}>{item.count} ({item.percentage}%)</span>
                          </div>
                          <Progress percent={item.percentage} size="small" strokeColor="#52c41a" />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
                <Card title="Response Time Metrics">
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Statistic
                        title="Average"
                        value={analyticsData.chatbotAnalytics?.responseTime?.avg}
                        suffix="s"
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Under 1s"
                        value={analyticsData.chatbotAnalytics?.responseTime?.under1s}
                        suffix="%"
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="⚡ Performance" key="4">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="System Health">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                          {analyticsData.performanceMetrics?.systemHealth?.uptime}%
                        </div>
                        <div style={{ color: '#666' }}>Uptime</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                          {analyticsData.performanceMetrics?.systemHealth?.cpuUsage}%
                        </div>
                        <div style={{ color: '#666' }}>CPU Usage</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                          {analyticsData.performanceMetrics?.systemHealth?.memoryUsage}%
                        </div>
                        <div style={{ color: '#666' }}>Memory</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                          {analyticsData.performanceMetrics?.systemHealth?.diskUsage}%
                        </div>
                        <div style={{ color: '#666' }}>Disk Usage</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="API Performance">
                  <List
                    size="small"
                    dataSource={[
                      { label: 'Total Requests', value: analyticsData.performanceMetrics?.apiMetrics?.totalRequests?.toLocaleString() },
                      { label: 'Success Rate', value: `${analyticsData.performanceMetrics?.apiMetrics?.successRate}%` },
                      { label: 'Avg Response Time', value: `${analyticsData.performanceMetrics?.apiMetrics?.avgResponseTime}ms` },
                      { label: 'Error Rate', value: `${analyticsData.performanceMetrics?.apiMetrics?.errorRate}%` },
                      { label: 'Peak RPS', value: analyticsData.performanceMetrics?.apiMetrics?.peakRPS?.toLocaleString() }
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{item.label}</span>
                          <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;