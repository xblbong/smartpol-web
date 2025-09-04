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
  Tabs
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
  LineChartOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';
import dayjs from 'dayjs';

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
      viewGrowth: 12.3
    },
    topPolls: [
      {
        id: 1,
        title: 'Prioritas Pembangunan Infrastruktur 2024',
        votes: 456,
        participants: 234,
        completion: 89,
        category: 'Infrastructure',
        status: 'completed'
      },
      {
        id: 2,
        title: 'Evaluasi Program Kesehatan Masyarakat',
        votes: 389,
        participants: 198,
        completion: 76,
        category: 'Healthcare',
        status: 'active'
      },
      {
        id: 3,
        title: 'Kebijakan Lingkungan dan Sustainability',
        votes: 345,
        participants: 167,
        completion: 82,
        category: 'Environment',
        status: 'completed'
      },
      {
        id: 4,
        title: 'Anggaran Pendidikan 2024',
        votes: 298,
        participants: 145,
        completion: 65,
        category: 'Education',
        status: 'active'
      },
      {
        id: 5,
        title: 'Program Bantuan Sosial',
        votes: 267,
        participants: 134,
        completion: 71,
        category: 'Social',
        status: 'completed'
      }
    ],
    userEngagement: [
      {
        week: 'Week 1',
        newUsers: 45,
        activeUsers: 234,
        pollVotes: 567,
        chatbotUse: 123
      },
      {
        week: 'Week 2',
        newUsers: 52,
        activeUsers: 267,
        pollVotes: 634,
        chatbotUse: 145
      },
      {
        week: 'Week 3',
        newUsers: 38,
        activeUsers: 298,
        pollVotes: 589,
        chatbotUse: 167
      },
      {
        week: 'Week 4',
        newUsers: 50,
        activeUsers: 312,
        pollVotes: 550,
        chatbotUse: 189
      }
    ],
    categoryStats: [
      { category: 'Infrastructure', polls: 8, votes: 1234, engagement: 85 },
      { category: 'Healthcare', polls: 6, votes: 987, engagement: 78 },
      { category: 'Education', polls: 7, votes: 876, engagement: 72 },
      { category: 'Environment', polls: 5, votes: 654, engagement: 68 },
      { category: 'Social', polls: 4, votes: 543, engagement: 65 },
      { category: 'Economy', polls: 3, votes: 432, engagement: 62 }
    ],
    demographics: {
      ageGroups: [
        { range: '18-25', count: 234, percentage: 18.7 },
        { range: '26-35', count: 345, percentage: 27.6 },
        { range: '36-45', count: 298, percentage: 23.8 },
        { range: '46-55', count: 234, percentage: 18.7 },
        { range: '56+', count: 139, percentage: 11.1 }
      ],
      regions: [
        { name: 'Jakarta', users: 345, percentage: 27.6 },
        { name: 'Surabaya', users: 234, percentage: 18.7 },
        { name: 'Bandung', users: 198, percentage: 15.8 },
        { name: 'Medan', users: 167, percentage: 13.4 },
        { name: 'Others', users: 306, percentage: 24.5 }
      ]
    }
  };

  useEffect(() => {
    setReportData(mockMonthlyData);
  }, [selectedMonth]);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    // In real app, fetch data for selected month
  };

  const handleExportReport = () => {
    console.log('Exporting monthly report for:', selectedMonth.format('MMMM YYYY'));
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
        <div style={{ fontWeight: 'bold' }}>{title}</div>
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
      title: 'Votes',
      dataIndex: 'votes',
      key: 'votes',
      render: (votes) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{votes}</div>
      ),
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: 'Completion',
      dataIndex: 'completion',
      key: 'completion',
      render: (completion) => (
        <Progress percent={completion} size="small" />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const engagementColumns = [
    {
      title: 'Week',
      dataIndex: 'week',
      key: 'week',
    },
    {
      title: 'New Users',
      dataIndex: 'newUsers',
      key: 'newUsers',
      render: (value) => (
        <div style={{ color: '#52c41a', fontWeight: 'bold' }}>{value}</div>
      ),
    },
    {
      title: 'Active Users',
      dataIndex: 'activeUsers',
      key: 'activeUsers',
      render: (value) => (
        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>{value}</div>
      ),
    },
    {
      title: 'Poll Votes',
      dataIndex: 'pollVotes',
      key: 'pollVotes',
      render: (value) => (
        <div style={{ color: '#faad14', fontWeight: 'bold' }}>{value}</div>
      ),
    },
    {
      title: 'Chatbot Use',
      dataIndex: 'chatbotUse',
      key: 'chatbotUse',
      render: (value) => (
        <div style={{ color: '#722ed1', fontWeight: 'bold' }}>{value}</div>
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
        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>{votes}</div>
      ),
    },
    {
      title: 'Engagement Rate',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (engagement) => (
        <Progress percent={engagement} size="small" />
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#001529' }}>
            📈 Monthly Report
          </Title>
          <Space>
            <DatePicker
              value={selectedMonth}
              onChange={handleMonthChange}
              picker="month"
              format="MMMM YYYY"
              placeholder="Select Month"
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
          Report for {selectedMonth.format('MMMM YYYY')}
        </Text>

        {/* Summary Statistics */}
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
                title="New Users"
                value={reportData.summary?.newUsers}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <div style={{ fontSize: '12px' }}>
                    This month
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Poll Votes"
                value={reportData.summary?.pollVotes}
                prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
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
                prefix={<MessageOutlined style={{ color: '#722ed1' }} />}
                suffix={
                  <div style={{ fontSize: '12px', color: '#52c41a' }}>
                    <RiseOutlined /> +{reportData.summary?.interactionGrowth}%
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        <Tabs defaultActiveKey="1">
          <TabPane tab="📊 Overview" key="1">
            <Row gutter={[16, 16]}>
              {/* Top Performing Polls */}
              <Col xs={24} lg={16}>
                <Card title="🏆 Top Performing Polls" style={{ marginBottom: '16px' }}>
                  <Table
                    columns={topPollsColumns}
                    dataSource={reportData.topPolls}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>

              {/* Quick Stats */}
              <Col xs={24} lg={8}>
                <Card title="📈 Growth Metrics" style={{ marginBottom: '16px' }}>
                  <List
                    size="small"
                    dataSource={[
                      { 
                        label: 'User Growth', 
                        value: `+${reportData.summary?.userGrowth}%`,
                        color: '#52c41a'
                      },
                      { 
                        label: 'Vote Growth', 
                        value: `+${reportData.summary?.voteGrowth}%`,
                        color: '#1890ff'
                      },
                      { 
                        label: 'Interaction Growth', 
                        value: `+${reportData.summary?.interactionGrowth}%`,
                        color: '#722ed1'
                      },
                      { 
                        label: 'Policy View Growth', 
                        value: `+${reportData.summary?.viewGrowth}%`,
                        color: '#fa541c'
                      },
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{item.label}</span>
                          <span style={{ fontWeight: 'bold', color: item.color }}>{item.value}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>

                <Card title="📋 Category Performance">
                  <List
                    size="small"
                    dataSource={reportData.categoryStats?.slice(0, 4)}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>{item.category}</span>
                            <span style={{ fontWeight: 'bold' }}>{item.votes} votes</span>
                          </div>
                          <Progress percent={item.engagement} size="small" />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="📅 Weekly Trends" key="2">
            <Card title="Weekly User Engagement">
              <Table
                columns={engagementColumns}
                dataSource={reportData.userEngagement}
                rowKey="week"
                pagination={false}
              />
            </Card>
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

          <TabPane tab="👥 Demographics" key="4">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Age Distribution">
                  <List
                    dataSource={reportData.demographics?.ageGroups}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>{item.range} years</span>
                            <span style={{ fontWeight: 'bold' }}>{item.count} ({item.percentage}%)</span>
                          </div>
                          <Progress percent={item.percentage} size="small" />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Regional Distribution">
                  <List
                    dataSource={reportData.demographics?.regions}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>{item.name}</span>
                            <span style={{ fontWeight: 'bold' }}>{item.users} ({item.percentage}%)</span>
                          </div>
                          <Progress percent={item.percentage} size="small" />
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

export default MonthlyReport;