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
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#001529' }}>
            📊 Daily Report
          </Title>
          <Space>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              placeholder="Select Date"
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
          Report for {selectedDate.format('dddd, DD MMMM YYYY')}
        </Text>

        {/* Summary Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={reportData.summary?.totalUsers}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                suffix={
                  <div style={{ fontSize: '12px', color: '#52c41a' }}>
                    <RiseOutlined /> +{reportData.summary?.newUsers} new
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={reportData.summary?.activeUsers}
                prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <div style={{ fontSize: '12px' }}>
                    Today
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Poll Votes"
                value={reportData.summary?.pollVotes}
                prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
                suffix={
                  <div style={{ fontSize: '12px' }}>
                    {reportData.summary?.totalPolls} polls
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Chatbot Interactions"
                value={reportData.summary?.chatbotInteractions}
                prefix={<MessageOutlined style={{ color: '#722ed1' }} />}
                suffix={
                  <div style={{ fontSize: '12px' }}>
                    Today
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* User Activity Timeline */}
          <Col xs={24} lg={12}>
            <Card title="User Activity Timeline" style={{ height: '500px' }}>
              <Timeline>
                {reportData.userActivity?.map(activity => (
                  <Timeline.Item
                    key={activity.id}
                    dot={getActivityIcon(activity.type)}
                    color={getActivityColor(activity.type)}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {activity.time} - {activity.action}
                      </div>
                      <div style={{ color: '#666' }}>
                        User: {activity.user}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {activity.details}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>

          {/* System Metrics */}
          <Col xs={24} lg={12}>
            <Card title="System Performance" style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <Text strong>Server Uptime</Text>
                    <div style={{ fontSize: '24px', color: '#52c41a' }}>
                      {reportData.systemMetrics?.serverUptime}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>Response Time</Text>
                    <div style={{ fontSize: '24px', color: '#1890ff' }}>
                      {reportData.systemMetrics?.responseTime}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>Error Rate</Text>
                    <div style={{ fontSize: '24px', color: '#52c41a' }}>
                      {reportData.systemMetrics?.errorRate}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>API Calls</Text>
                    <div style={{ fontSize: '24px', color: '#722ed1' }}>
                      {reportData.systemMetrics?.apiCalls}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Quick Stats */}
            <Card title="Quick Stats">
              <List
                size="small"
                dataSource={[
                  { label: 'New Polls Created', value: reportData.summary?.newPolls },
                  { label: 'Policy Views', value: reportData.summary?.policyViews },
                  { label: 'Database Queries', value: reportData.systemMetrics?.databaseQueries },
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

        {/* Polls Activity */}
        <Card title="Today's Polls Activity" style={{ marginTop: '16px' }}>
          <Table
            columns={pollColumns}
            dataSource={reportData.pollsData}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      </div>
    </div>
  );
};

export default DailyReport;