import React, { useState } from 'react';
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
  Avatar
} from 'antd';
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
  ClockCircleOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportPolling = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for polling reports
  const pollingSummary = {
    totalPolls: 45,
    activePolls: 12,
    completedPolls: 28,
    totalVotes: 15420,
    avgParticipation: 68.5,
    topCategory: 'Pemilihan'
  };

  const pollPerformance = [
    {
      id: 1,
      title: 'Pemilihan Ketua RT 2024',
      category: 'Pemilihan',
      totalVotes: 2450,
      targetVotes: 3000,
      participationRate: 81.7,
      status: 'completed',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      trend: 'up'
    },
    {
      id: 2,
      title: 'Survey Kepuasan Pelayanan Publik',
      category: 'Survey',
      totalVotes: 1850,
      targetVotes: 2000,
      participationRate: 92.5,
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      trend: 'up'
    },
    {
      id: 3,
      title: 'Polling Anggaran Infrastruktur',
      category: 'Anggaran',
      totalVotes: 1200,
      targetVotes: 2500,
      participationRate: 48.0,
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      trend: 'down'
    },
    {
      id: 4,
      title: 'Evaluasi Program Kesehatan',
      category: 'Kesehatan',
      totalVotes: 980,
      targetVotes: 1500,
      participationRate: 65.3,
      status: 'active',
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      trend: 'up'
    }
  ];

  const categoryStats = [
    { category: 'Pemilihan', polls: 12, votes: 5420, avgParticipation: 78.5 },
    { category: 'Survey', polls: 8, votes: 3200, avgParticipation: 85.2 },
    { category: 'Anggaran', polls: 6, votes: 2800, avgParticipation: 62.1 },
    { category: 'Kesehatan', polls: 5, votes: 2100, avgParticipation: 71.8 },
    { category: 'Pendidikan', polls: 4, votes: 1900, avgParticipation: 68.9 }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Poll Completed',
      title: 'Survey Kepuasan Pelayanan Publik',
      timestamp: '2 hours ago',
      votes: 1850,
      type: 'completed'
    },
    {
      id: 2,
      action: 'High Participation',
      title: 'Pemilihan Ketua RT 2024',
      timestamp: '5 hours ago',
      votes: 2450,
      type: 'milestone'
    },
    {
      id: 3,
      action: 'New Poll Created',
      title: 'Evaluasi Program Kesehatan',
      timestamp: '1 day ago',
      votes: 0,
      type: 'created'
    },
    {
      id: 4,
      action: 'Low Participation Alert',
      title: 'Polling Anggaran Infrastruktur',
      timestamp: '2 days ago',
      votes: 1200,
      type: 'alert'
    }
  ];

  const columns = [
    {
      title: 'Poll Information',
      key: 'pollInfo',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: '14px', color: '#001529' }}>
            {record.title}
          </Text>
          <br />
          <Tag color="blue" style={{ marginTop: '4px' }}>
            {record.category}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Votes Progress',
      key: 'votes',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '8px' }}>
            <Text strong>{record.totalVotes.toLocaleString()}</Text>
            <Text type="secondary"> / {record.targetVotes.toLocaleString()}</Text>
          </div>
          <Progress 
            percent={Math.round((record.totalVotes / record.targetVotes) * 100)}
            size="small"
            status={record.totalVotes >= record.targetVotes ? 'success' : 'active'}
          />
        </div>
      ),
    },
    {
      title: 'Participation Rate',
      key: 'participation',
      render: (_, record) => (
        <div>
          <Text strong style={{ 
            color: record.participationRate >= 70 ? '#52c41a' : 
                   record.participationRate >= 50 ? '#faad14' : '#ff4d4f'
          }}>
            {record.participationRate}%
          </Text>
          <div style={{ marginTop: '4px' }}>
            {record.trend === 'up' ? (
              <RiseOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
            ) : (
              <FallOutlined style={{ color: '#ff4d4f', marginRight: '4px' }} />
            )}
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.trend === 'up' ? 'Trending Up' : 'Trending Down'}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'completed' ? 'green' : 'blue'}
          icon={status === 'completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            <CalendarOutlined style={{ marginRight: '4px' }} />
            {new Date(record.startDate).toLocaleDateString('id-ID')}
          </div>
          <div style={{ fontSize: '12px', marginTop: '2px' }}>
            <Text type="secondary">to</Text>
          </div>
          <div style={{ fontSize: '12px' }}>
            <CalendarOutlined style={{ marginRight: '4px' }} />
            {new Date(record.endDate).toLocaleDateString('id-ID')}
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'completed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'milestone': return <TrophyOutlined style={{ color: '#faad14' }} />;
      case 'created': return <PieChartOutlined style={{ color: '#1890ff' }} />;
      case 'alert': return <ClockCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <BarChartOutlined />;
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <Title level={2} style={{ marginBottom: '24px', color: '#001529' }}>
          📊 Polling Reports & Analytics
        </Title>

      {/* Controls */}
      <Card style={{ marginBottom: '24px' }}>
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
          <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<DownloadOutlined />}>
              Export Report
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="Total Polls"
              value={pollingSummary.totalPolls}
              prefix={<BarChartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="Active Polls"
              value={pollingSummary.activePolls}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="Completed"
              value={pollingSummary.completedPolls}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="Total Votes"
              value={pollingSummary.totalVotes}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="Avg Participation"
              value={pollingSummary.avgParticipation}
              suffix="%"
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="Top Category"
              value={pollingSummary.topCategory}
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Poll Performance Table */}
        <Col xs={24} lg={16}>
          <Card title="📈 Poll Performance Analysis" style={{ height: '600px' }}>
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
          <Card title="🔔 Recent Activities" style={{ height: '600px' }}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={getActivityIcon(item.type)} />}
                    title={
                      <div>
                        <Text strong style={{ fontSize: '13px' }}>
                          {item.action}
                        </Text>
                        <br />
                        <Text style={{ fontSize: '12px', color: '#666' }}>
                          {item.title}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {item.timestamp}
                        </Text>
                        {item.votes > 0 && (
                          <>
                            <br />
                            <Text style={{ fontSize: '11px' }}>
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
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card title="📊 Performance by Category">
            <Row gutter={[16, 16]}>
              {categoryStats.map((category, index) => (
                <Col xs={24} sm={12} md={8} lg={4} xl={4} key={index}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: '8px 0', color: '#001529' }}>
                      {category.category}
                    </Title>
                    <Divider style={{ margin: '8px 0' }} />
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Statistic
                          title="Polls"
                          value={category.polls}
                          valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                        />
                      </Col>
                      <Col span={24}>
                        <Statistic
                          title="Total Votes"
                          value={category.votes}
                          valueStyle={{ fontSize: '16px', color: '#52c41a' }}
                        />
                      </Col>
                      <Col span={24}>
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>Avg Participation</Text>
                          <br />
                          <Text strong style={{ 
                            color: category.avgParticipation >= 70 ? '#52c41a' : 
                                   category.avgParticipation >= 50 ? '#faad14' : '#ff4d4f',
                            fontSize: '16px'
                          }}>
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
    </div>
  );
};

export default ReportPolling;