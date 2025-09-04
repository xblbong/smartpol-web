import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, List, Avatar, Tag, Space } from 'antd';
import {
  UserOutlined,
  PieChartOutlined,
  FileTextOutlined,
  MessageOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';

const { Title, Text } = Typography;

const Dashboard = () => {
  // Mock data untuk statistik
  const stats = {
    totalUsers: 1250,
    activePolls: 8,
    totalPolicies: 45,
    chatbotInteractions: 3420
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '2 minutes ago',
      avatar: '👤'
    },
    {
      id: 2,
      type: 'poll',
      title: 'Poll created',
      description: 'Infrastructure Development Survey',
      time: '15 minutes ago',
      avatar: '📊'
    },
    {
      id: 3,
      type: 'policy',
      title: 'Policy updated',
      description: 'Environmental Protection Act',
      time: '1 hour ago',
      avatar: '📋'
    },
    {
      id: 4,
      type: 'chatbot',
      title: 'High chatbot activity',
      description: '150+ interactions in the last hour',
      time: '2 hours ago',
      avatar: '🤖'
    }
  ];

  const pollStats = [
    { name: 'Active Polls', value: 8, color: '#52c41a' },
    { name: 'Completed Polls', value: 23, color: '#1890ff' },
    { name: 'Draft Polls', value: 5, color: '#faad14' }
  ];

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <Title level={2} style={{ marginBottom: '24px', color: '#001529' }}>
          🏛️ Admin Dashboard
        </Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: '8px', borderTop: '4px solid #1890ff' }}>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
            <Progress 
              percent={85} 
              size="small" 
              strokeColor="#1890ff" 
              showInfo={false}
              style={{ marginTop: '8px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>+12% from last month</Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: '8px', borderTop: '4px solid #52c41a' }}>
            <Statistic
              title="Active Polls"
              value={stats.activePolls}
              prefix={<PieChartOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
            <Progress 
              percent={60} 
              size="small" 
              strokeColor="#52c41a" 
              showInfo={false}
              style={{ marginTop: '8px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>3 ending this week</Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: '8px', borderTop: '4px solid #faad14' }}>
            <Statistic
              title="Total Policies"
              value={stats.totalPolicies}
              prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
            />
            <Progress 
              percent={75} 
              size="small" 
              strokeColor="#faad14" 
              showInfo={false}
              style={{ marginTop: '8px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>5 pending review</Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: '8px', borderTop: '4px solid #722ed1' }}>
            <Statistic
              title="Chatbot Interactions"
              value={stats.chatbotInteractions}
              prefix={<MessageOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
            />
            <Progress 
              percent={92} 
              size="small" 
              strokeColor="#722ed1" 
              showInfo={false}
              style={{ marginTop: '8px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>+25% from yesterday</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <span>Recent Activities</span>
              </Space>
            }
            style={{ borderRadius: '8px', height: '400px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: '#f0f0f0',
                          color: '#001529',
                          fontSize: '16px'
                        }}
                      >
                        {item.avatar}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong>{item.title}</Text>
                        <Tag 
                          color={
                            item.type === 'user' ? 'blue' :
                            item.type === 'poll' ? 'green' :
                            item.type === 'policy' ? 'orange' : 'purple'
                          }
                          size="small"
                        >
                          {item.type}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Text type="secondary">{item.description}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Poll Statistics */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#52c41a' }} />
                <span>Poll Statistics</span>
              </Space>
            }
            style={{ borderRadius: '8px', height: '400px' }}
          >
            <div style={{ padding: '20px 0' }}>
              {pollStats.map((stat, index) => (
                <div key={index} style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <Text strong>{stat.name}</Text>
                    <Text strong style={{ color: stat.color }}>{stat.value}</Text>
                  </div>
                  <Progress 
                    percent={(stat.value / 36) * 100} 
                    strokeColor={stat.color}
                    trailColor="#f0f0f0"
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              backgroundColor: '#f9f9f9', 
              borderRadius: '6px' 
            }}>
              <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
                Quick Actions
              </Title>
              <Space wrap>
                <Tag icon={<CheckCircleOutlined />} color="success">Create Poll</Tag>
                <Tag icon={<UserOutlined />} color="processing">Add User</Tag>
                <Tag icon={<FileTextOutlined />} color="warning">New Policy</Tag>
                <Tag icon={<RiseOutlined />} color="error">View Reports</Tag>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
      </div>
    </div>
  );
};

export default Dashboard;