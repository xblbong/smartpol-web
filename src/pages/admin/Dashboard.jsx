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
    { name: 'Active Polls', value: 8, color: '#10b981' },
    { name: 'Completed Polls', value: 23, color: '#6366f1' },
    { name: 'Draft Polls', value: 5, color: '#f59e0b' }
  ];

  const totalPolls = pollStats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <SidebarComponents />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100">
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <Title level={2} className="m-0 text-gray-800 flex items-center">
            <FaTachometerAlt className="text-indigo-600 text-3xl mr-3" />
            Admin Dashboard
          </Title>
          <div className="hidden sm:block">
            <Text type="secondary" className="text-sm text-gray-600">Welcome back, Admin!</Text>
          </div>
        </div>

        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 bg-white">
              <div className="border-l-4 border-indigo-500 pl-4">
                <Statistic
                  title={<span className="text-gray-600 text-base font-medium">Total Users</span>}
                  value={stats.totalUsers}
                  prefix={<FaUser className="text-indigo-500 text-2xl mr-2" />}
                />
                <Progress
                  percent={85}
                  size="small"
                  strokeColor="#6366f1"
                  showInfo={false}
                  className="mt-4"
                />
                <Text type="secondary" className="text-xs md:text-sm mt-2 block text-gray-500">
                  <span className="text-green-600 font-semibold">+12%</span> from last month
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 bg-white">
              <div className="border-l-4 border-green-500 pl-4">
                <Statistic
                  title={<span className="text-gray-600 text-base font-medium">Active Polls</span>}
                  value={stats.activePolls}
                  prefix={<FaChartPie className="text-green-500 text-2xl mr-2" />}
                />
                <Progress
                  percent={60}
                  size="small"
                  strokeColor="#10b981"
                  showInfo={false}
                  className="mt-4"
                />
                <Text type="secondary" className="text-xs md:text-sm mt-2 block text-gray-500">
                  <span className="text-yellow-600 font-semibold">3</span> ending this week
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 bg-white">
              <div className="border-l-4 border-yellow-500 pl-4">
                <Statistic
                  title={<span className="text-gray-600 text-base font-medium">Total Policies</span>}
                  value={stats.totalPolicies}
                  prefix={<FaFileAlt className="text-yellow-500 text-2xl mr-2" />}
                />
                <Progress
                  percent={75}
                  size="small"
                  strokeColor="#f59e0b"
                  showInfo={false}
                  className="mt-4"
                />
                <Text type="secondary" className="text-xs md:text-sm mt-2 block text-gray-500">
                  <span className="text-red-600 font-semibold">5</span> pending review
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 bg-white">
              <div className="border-l-4 border-purple-500 pl-4">
                <Statistic
                  title={<span className="text-gray-600 text-base font-medium">Chatbot Interactions</span>}
                  value={stats.chatbotInteractions}
                  prefix={<FaRobot className="text-purple-500 text-2xl mr-2" />}
                />
                <Progress
                  percent={92}
                  size="small"
                  strokeColor="#8b5cf6"
                  showInfo={false}
                  className="mt-4"
                />
                <Text type="secondary" className="text-xs md:text-sm mt-2 block text-gray-500">
                  <span className="text-blue-600 font-semibold">+25%</span> from yesterday
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space className="items-center text-xl font-semibold text-gray-800">
                  <FaClock className="text-indigo-600 text-2xl" />
                  <span>Recent Activities</span>
                </Space>
              }
              className="rounded-xl shadow-sm border border-gray-200 h-full bg-white"
              bodyStyle={{ padding: '0 24px' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item className="py-4 border-b border-gray-100 last:border-b-0">
                    <List.Item.Meta
                      avatar={
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.color === 'blue' ? 'bg-indigo-100 text-indigo-600' :
                          item.color === 'green' ? 'bg-green-100 text-green-600' :
                          item.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                          item.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {item.icon}
                        </div>
                      }
                      title={
                        <div className="flex items-center space-x-2">
                          <Text strong className="text-base text-gray-800">{item.title}</Text>
                          <Tag
                            className={`rounded-full px-3 py-0.5 text-xs font-medium uppercase border-0 ${
                              item.color === 'blue' ? 'bg-indigo-100 text-indigo-700' :
                              item.color === 'green' ? 'bg-green-100 text-green-700' :
                              item.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                              item.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
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

          <Col xs={24} lg={12}>
            <Card
              title={
                <Space className="items-center text-xl font-semibold text-gray-800">
                  <FaChartPie className="text-indigo-600 text-2xl" />
                  <span>Poll Statistics</span>
                </Space>
              }
              className="rounded-xl shadow-sm border border-gray-200 h-full bg-white"
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

              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <Title level={5} className="mb-4 text-gray-800">
                  Quick Actions
                </Title>
                <Space wrap size={[12, 12]}>
                  <button className="flex items-center gap-2 py-2 px-4 text-sm rounded-lg cursor-pointer transition-all duration-200 bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200">
                    <FaPlusCircle className="text-base" />
                    Create Poll
                  </button>
                  <button className="flex items-center gap-2 py-2 px-4 text-sm rounded-lg cursor-pointer transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-600 hover:text-white border border-green-200">
                    <FaUserPlus className="text-base" />
                    Add User
                  </button>
                  <button className="flex items-center gap-2 py-2 px-4 text-sm rounded-lg cursor-pointer transition-all duration-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-600 hover:text-white border border-yellow-200">
                    <FaFileSignature className="text-base" />
                    New Policy
                  </button>
                  <button className="flex items-center gap-2 py-2 px-4 text-sm rounded-lg cursor-pointer transition-all duration-200 bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200">
                    <FaChartBar className="text-base" />
                    View Reports
                  </button>
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