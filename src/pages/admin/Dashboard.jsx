import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, List, Avatar, Tag, Space } from 'antd';
import {
  FaUser, FaChartPie, FaFileAlt, FaRobot, FaTachometerAlt, FaPlusCircle, FaUserPlus, FaFileSignature, FaChartBar, FaClock
} from 'react-icons/fa';
import SidebarComponents from '../../components/layouts/SidebarComponents';

const { Title, Text } = Typography;

const Dashboard = () => {
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
      icon: <FaUser />,
      color: 'blue'
    },
    {
      id: 2,
      type: 'poll',
      title: 'Poll created',
      description: 'Infrastructure Development Survey',
      time: '15 minutes ago',
      icon: <FaChartPie />,
      color: 'green'
    },
    {
      id: 3,
      type: 'policy',
      title: 'Policy updated',
      description: 'Environmental Protection Act',
      time: '1 hour ago',
      icon: <FaFileAlt />,
      color: 'yellow' // Mengganti ke yellow agar konsisten dengan warna tag
    },
    {
      id: 4,
      type: 'chatbot',
      title: 'High chatbot activity',
      description: '150+ interactions in the last hour',
      time: '2 hours ago',
      icon: <FaRobot />,
      color: 'purple'
    }
  ];

  const pollStats = [
    { name: 'Active Polls', value: 8, color: '#16a34a' }, // green-600
    { name: 'Completed Polls', value: 23, color: '#2563eb' }, // blue-600
    { name: 'Draft Polls', value: 5, color: '#f59e0b' } // amber-500
  ];

  const totalPolls = pollStats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      <SidebarComponents />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Dashboard Header */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg flex items-center justify-between">
          <Title level={2} className="m-0 text-gray-800 flex items-center">
            <FaTachometerAlt className="text-blue-600 text-3xl mr-3" />
            Admin Dashboard
          </Title>
          <div className="hidden sm:block">
            <Text type="secondary" className="text-sm">Welcome back, Admin!</Text>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-xl border-t-8 border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <Statistic
                title={<span className="text-gray-600 text-base font-medium">Total Users</span>}
                value={stats.totalUsers}
                prefix={<FaUser className="text-blue-500 text-3xl opacity-75" />}
              />
              <Progress
                percent={85}
                size="small"
                strokeColor="#3b82f6" // blue-500
                showInfo={false}
                className="mt-4"
              />
              <Text type="secondary" className="text-xs md:text-sm mt-2 block">
                <span className="text-green-500 font-semibold">+12%</span> from last month
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-xl border-t-8 border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <Statistic
                title={<span className="text-gray-600 text-base font-medium">Active Polls</span>}
                value={stats.activePolls}
                prefix={<FaChartPie className="text-green-500 text-3xl opacity-75" />}
              />
              <Progress
                percent={60}
                size="small"
                strokeColor="#22c55e" // green-500
                showInfo={false}
                className="mt-4"
              />
              <Text type="secondary" className="text-xs md:text-sm mt-2 block">
                <span className="text-yellow-500 font-semibold">3</span> ending this week
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-xl border-t-8 border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <Statistic
                title={<span className="text-gray-600 text-base font-medium">Total Policies</span>}
                value={stats.totalPolicies}
                prefix={<FaFileAlt className="text-yellow-500 text-3xl opacity-75" />}
              />
              <Progress
                percent={75}
                size="small"
                strokeColor="#f59e0b" // amber-500
                showInfo={false}
                className="mt-4"
              />
              <Text type="secondary" className="text-xs md:text-sm mt-2 block">
                <span className="text-red-500 font-semibold">5</span> pending review
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-xl border-t-8 border-purple-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <Statistic
                title={<span className="text-gray-600 text-base font-medium">Chatbot Interactions</span>}
                value={stats.chatbotInteractions}
                prefix={<FaRobot className="text-purple-500 text-3xl opacity-75" />}
              />
              <Progress
                percent={92}
                size="small"
                strokeColor="#a855f7" // purple-500
                showInfo={false}
                className="mt-4"
              />
              <Text type="secondary" className="text-xs md:text-sm mt-2 block">
                <span className="text-blue-500 font-semibold">+25%</span> from yesterday
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Recent Activities */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space className="items-center text-xl font-semibold text-gray-800">
                  <FaClock className="text-blue-500 text-2xl" />
                  <span>Recent Activities</span>
                </Space>
              }
              className="rounded-2xl shadow-xl h-full"
              bodyStyle={{ padding: '0 24px' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item className="py-4 border-b border-gray-100 last:border-b-0">
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          className={`bg-${item.color}-100 text-${item.color}-600 text-2xl flex items-center justify-center`}
                          style={{ width: 48, height: 48 }}
                        >
                          {item.icon}
                        </Avatar>
                      }
                      title={
                        <div className="flex items-center space-x-2">
                          <Text strong className="text-base text-gray-800">{item.title}</Text>
                          <Tag
                            color={item.color === 'yellow' ? 'orange' : item.color} // Menggunakan orange untuk yellow agar lebih kontras
                            className="rounded-full px-3 py-0.5 text-xs font-medium uppercase"
                          >
                            {item.type}
                          </Tag>
                        </div>
                      }
                      description={
                        <>
                          <Text type="secondary" className="text-sm text-gray-600">{item.description}</Text>
                          <br />
                          <Text type="secondary" className="text-xs text-gray-500 mt-1 block">{item.time}</Text>
                        </>
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
                <Space className="items-center text-xl font-semibold text-gray-800">
                  <FaChartPie className="text-green-500 text-2xl" />
                  <span>Poll Statistics</span>
                </Space>
              }
              className="rounded-2xl shadow-xl h-full"
            >
              <div className="py-5">
                {pollStats.map((stat, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <Text strong className="text-base text-gray-700">{stat.name}</Text>
                      <Text strong style={{ color: stat.color }} className="text-lg">{stat.value}</Text>
                    </div>
                    <Progress
                      percent={totalPolls > 0 ? (stat.value / totalPolls) * 100 : 0}
                      strokeColor={stat.color}
                      trailColor="#e0e0e0"
                      showInfo={false}
                      strokeLinecap="round"
                      className="h-2"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <Title level={5} className="mb-4 text-gray-800">
                  Quick Actions
                </Title>
                <Space wrap size={[12, 12]}>
                  <Tag
                    icon={<FaPlusCircle className="text-base" />}
                    color="blue"
                    className="py-2 px-4 text-sm rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:text-white"
                  >
                    Create Poll
                  </Tag>
                  <Tag
                    icon={<FaUserPlus className="text-base" />}
                    color="green"
                    className="py-2 px-4 text-sm rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-green-600 hover:text-white"
                  >
                    Add User
                  </Tag>
                  <Tag
                    icon={<FaFileSignature className="text-base" />}
                    color="orange"
                    className="py-2 px-4 text-sm rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-orange-600 hover:text-white"
                  >
                    New Policy
                  </Tag>
                  <Tag
                    icon={<FaChartBar className="text-base" />}
                    color="purple"
                    className="py-2 px-4 text-sm rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-purple-600 hover:text-white"
                  >
                    View Reports
                  </Tag>
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