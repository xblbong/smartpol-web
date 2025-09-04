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
  Alert
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
  TrophyOutlined,
  EyeOutlined,
  TeamOutlined,
  LineChartOutlined,
  CrownOutlined,
  StarOutlined,
  ThunderboltOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';
import dayjs from 'dayjs';

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
      totalEngagement: 87.5
    },
    monthlyTrends: [
      { month: 'Jan', users: 890, polls: 15, votes: 2340, interactions: 1200 },
      { month: 'Feb', users: 1120, polls: 18, votes: 2890, interactions: 1450 },
      { month: 'Mar', users: 1340, polls: 22, votes: 3450, interactions: 1680 },
      { month: 'Apr', users: 1580, polls: 28, votes: 4120, interactions: 1890 },
      { month: 'May', users: 1820, polls: 32, votes: 4680, interactions: 2100 },
      { month: 'Jun', users: 2050, polls: 35, votes: 5230, interactions: 2340 },
      { month: 'Jul', users: 2280, polls: 38, votes: 5780, interactions: 2580 },
      { month: 'Aug', users: 2510, polls: 42, votes: 6340, interactions: 2820 },
      { month: 'Sep', users: 2740, polls: 45, votes: 6890, interactions: 3060 },
      { month: 'Oct', users: 2970, polls: 48, votes: 7450, interactions: 3300 },
      { month: 'Nov', users: 3200, polls: 52, votes: 8010, interactions: 3540 },
      { month: 'Dec', users: 3430, polls: 55, votes: 8570, interactions: 3780 }
    ],
    topPerformers: {
      polls: [
        {
          id: 1,
          title: 'Rencana Pembangunan Jangka Panjang 2024-2029',
          votes: 8945,
          participants: 4567,
          category: 'Infrastructure',
          duration: '6 months',
          impact: 'High'
        },
        {
          id: 2,
          title: 'Reformasi Sistem Kesehatan Nasional',
          votes: 7823,
          participants: 3891,
          category: 'Healthcare',
          duration: '4 months',
          impact: 'High'
        },
        {
          id: 3,
          title: 'Strategi Pendidikan Digital Indonesia',
          votes: 6754,
          participants: 3245,
          category: 'Education',
          duration: '3 months',
          impact: 'Medium'
        },
        {
          id: 4,
          title: 'Kebijakan Energi Terbarukan',
          votes: 5689,
          participants: 2834,
          category: 'Environment',
          duration: '5 months',
          impact: 'High'
        },
        {
          id: 5,
          title: 'Program Pemberdayaan UMKM',
          votes: 4567,
          participants: 2283,
          category: 'Economy',
          duration: '2 months',
          impact: 'Medium'
        }
      ],
      users: [
        { name: 'Dr. Ahmad Wijaya', polls: 45, votes: 1234, engagement: 95 },
        { name: 'Prof. Siti Nurhaliza', polls: 38, votes: 1089, engagement: 92 },
        { name: 'Ir. Budi Santoso', polls: 32, votes: 987, engagement: 88 },
        { name: 'Dra. Dewi Lestari', polls: 28, votes: 876, engagement: 85 },
        { name: 'Dr. Eko Prasetyo', polls: 25, votes: 765, engagement: 82 }
      ]
    },
    categoryAnalysis: [
      { 
        category: 'Infrastructure', 
        polls: 68, 
        votes: 15420, 
        avgParticipation: 227, 
        growth: 45.2,
        satisfaction: 87
      },
      { 
        category: 'Healthcare', 
        polls: 52, 
        votes: 12340, 
        avgParticipation: 237, 
        growth: 38.7,
        satisfaction: 84
      },
      { 
        category: 'Education', 
        polls: 48, 
        votes: 10890, 
        avgParticipation: 227, 
        growth: 42.1,
        satisfaction: 81
      },
      { 
        category: 'Environment', 
        polls: 45, 
        votes: 9876, 
        avgParticipation: 219, 
        growth: 52.3,
        satisfaction: 89
      },
      { 
        category: 'Economy', 
        polls: 38, 
        votes: 8765, 
        avgParticipation: 231, 
        growth: 35.8,
        satisfaction: 78
      },
      { 
        category: 'Social', 
        polls: 35, 
        votes: 7654, 
        avgParticipation: 219, 
        growth: 28.4,
        satisfaction: 82
      }
    ],
    achievements: [
      {
        title: 'Highest User Growth',
        description: 'Achieved 131% user growth compared to previous year',
        icon: <RiseOutlined />,
        color: '#52c41a'
      },
      {
        title: 'Most Engaging Poll',
        description: 'Infrastructure poll reached 8,945 votes',
        icon: <TrophyOutlined />,
        color: '#faad14'
      },
      {
        title: 'Platform Stability',
        description: '99.8% uptime throughout the year',
        icon: <ThunderboltOutlined />,
        color: '#1890ff'
      },
      {
        title: 'Global Recognition',
        description: 'Featured in 5 international digital democracy conferences',
        icon: <GlobalOutlined />,
        color: '#722ed1'
      }
    ],
    quarterlyComparison: [
      { quarter: 'Q1', users: 3350, polls: 63, votes: 8680, satisfaction: 78 },
      { quarter: 'Q2', users: 5450, polls: 95, votes: 14030, satisfaction: 82 },
      { quarter: 'Q3', polls: 125, votes: 20570, satisfaction: 85 },
      { quarter: 'Q4', users: 6620, polls: 135, votes: 23390, satisfaction: 87 }
    ]
  };

  useEffect(() => {
    setReportData(mockAnnualData);
  }, [selectedYear]);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  const handleExportReport = () => {
    console.log('Exporting annual report for:', selectedYear.format('YYYY'));
  };

  const handlePrintReport = () => {
    window.print();
  };

  const topPollsColumns = [
    {
      title: 'Poll Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <div style={{ fontWeight: 'bold', maxWidth: '300px' }}>{title}</div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Total Votes',
      dataIndex: 'votes',
      key: 'votes',
      render: (votes) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{votes.toLocaleString()}</div>
      ),
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants) => (
        <div>{participants.toLocaleString()}</div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Impact',
      dataIndex: 'impact',
      key: 'impact',
      render: (impact) => (
        <Tag color={impact === 'High' ? 'red' : impact === 'Medium' ? 'orange' : 'green'}>
          {impact}
        </Tag>
      ),
    },
  ];

  const monthlyTrendsColumns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'New Users',
      dataIndex: 'users',
      key: 'users',
      render: (value) => (
        <div style={{ color: '#52c41a', fontWeight: 'bold' }}>{value.toLocaleString()}</div>
      ),
    },
    {
      title: 'New Polls',
      dataIndex: 'polls',
      key: 'polls',
      render: (value) => (
        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>{value}</div>
      ),
    },
    {
      title: 'Total Votes',
      dataIndex: 'votes',
      key: 'votes',
      render: (value) => (
        <div style={{ color: '#faad14', fontWeight: 'bold' }}>{value.toLocaleString()}</div>
      ),
    },
    {
      title: 'Interactions',
      dataIndex: 'interactions',
      key: 'interactions',
      render: (value) => (
        <div style={{ color: '#722ed1', fontWeight: 'bold' }}>{value.toLocaleString()}</div>
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
      title: 'Total Polls',
      dataIndex: 'polls',
      key: 'polls',
    },
    {
      title: 'Total Votes',
      dataIndex: 'votes',
      key: 'votes',
      render: (votes) => (
        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>{votes.toLocaleString()}</div>
      ),
    },
    {
      title: 'Avg Participation',
      dataIndex: 'avgParticipation',
      key: 'avgParticipation',
    },
    {
      title: 'Growth Rate',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth) => (
        <div style={{ color: '#52c41a', fontWeight: 'bold' }}>+{growth}%</div>
      ),
    },
    {
      title: 'Satisfaction',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      render: (satisfaction) => (
        <Progress percent={satisfaction} size="small" />
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#001529' }}>
            📊 Annual Report
          </Title>
          <Space>
            <DatePicker
              value={selectedYear}
              onChange={handleYearChange}
              picker="year"
              format="YYYY"
              placeholder="Select Year"
            />
            <Button icon={<DownloadOutlined />} onClick={handleExportReport}>
              Export
            </Button>
            <Button icon={<PrinterOutlined />} onClick={handlePrintReport}>
              Print
            </Button>
          </Space>
        </div>

        <Text type="secondary" style={{ fontSize: '16px', marginBottom: '24px', display: 'block' }}>
          Comprehensive Annual Report for {selectedYear.format('YYYY')}
        </Text>

        {/* Executive Summary */}
        <Alert
          message="Executive Summary"
          description={`This year marked exceptional growth with ${reportData.summary?.userGrowth}% increase in user base, ${reportData.summary?.newPolls} new polls created, and ${reportData.summary?.pollVotes?.toLocaleString()} total votes cast. Platform engagement reached ${reportData.summary?.totalEngagement}% with significant improvements in user satisfaction across all categories.`}
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        {/* Key Metrics */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={reportData.summary?.totalUsers}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                suffix={
                  <div style={{ fontSize: '12px', color: '#52c41a' }}>
                    <RiseOutlined /> +{reportData.summary?.userGrowth}%
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Total Polls"
                value={reportData.summary?.totalPolls}
                prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
                suffix={
                  <div style={{ fontSize: '12px' }}>
                    {reportData.summary?.newPolls} new
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Total Votes"
                value={reportData.summary?.pollVotes}
                prefix={<ThunderboltOutlined style={{ color: '#722ed1' }} />}
                suffix={
                  <div style={{ fontSize: '12px', color: '#52c41a' }}>
                    <RiseOutlined /> +{reportData.summary?.voteGrowth}%
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Chatbot Interactions"
                value={reportData.summary?.chatbotInteractions}
                prefix={<MessageOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <div style={{ fontSize: '12px', color: '#52c41a' }}>
                    <RiseOutlined /> +{reportData.summary?.interactionGrowth}%
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Achievements */}
        <Card title="🏆 Key Achievements" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            {reportData.achievements?.map((achievement, index) => (
              <Col xs={12} lg={6} key={index}>
                <Card size="small" style={{ textAlign: 'center', height: '120px' }}>
                  <div style={{ fontSize: '24px', color: achievement.color, marginBottom: '8px' }}>
                    {achievement.icon}
                  </div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {achievement.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {achievement.description}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        <Tabs defaultActiveKey="1">
          <TabPane tab="📈 Trends & Growth" key="1">
            <Card title="Monthly Growth Trends" style={{ marginBottom: '16px' }}>
              <Table
                columns={monthlyTrendsColumns}
                dataSource={reportData.monthlyTrends}
                rowKey="month"
                pagination={false}
                size="small"
                scroll={{ x: true }}
              />
            </Card>
          </TabPane>

          <TabPane tab="🏆 Top Performers" key="2">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card title="🥇 Top Performing Polls" style={{ marginBottom: '16px' }}>
                  <Table
                    columns={topPollsColumns}
                    dataSource={reportData.topPerformers?.polls}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="⭐ Top Contributors">
                  <List
                    dataSource={reportData.topPerformers?.users}
                    renderItem={(user, index) => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%', 
                              backgroundColor: index < 3 ? '#faad14' : '#d9d9d9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '8px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: 'white'
                            }}>
                              {index + 1}
                            </div>
                            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginLeft: '32px' }}>
                            {user.polls} polls • {user.votes} votes
                          </div>
                          <div style={{ marginLeft: '32px', marginTop: '4px' }}>
                            <Progress percent={user.engagement} size="small" />
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="🏷️ Category Analysis" key="3">
            <Card title="Category Performance Analysis">
              <Table
                columns={categoryColumns}
                dataSource={reportData.categoryAnalysis}
                rowKey="category"
                pagination={false}
              />
            </Card>
          </TabPane>

          <TabPane tab="📊 Quarterly Summary" key="4">
            <Row gutter={[16, 16]}>
              {reportData.quarterlyComparison?.map((quarter, index) => (
                <Col xs={12} lg={6} key={quarter.quarter}>
                  <Card title={quarter.quarter} style={{ textAlign: 'center' }}>
                    <Statistic
                      title="New Users"
                      value={quarter.users}
                      prefix={<UserOutlined />}
                      valueStyle={{ fontSize: '18px' }}
                    />
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>Polls: <strong>{quarter.polls}</strong></span>
                      <span>Votes: <strong>{quarter.votes?.toLocaleString()}</strong></span>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">Satisfaction</Text>
                      <Progress percent={quarter.satisfaction} size="small" />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AnnualReport;