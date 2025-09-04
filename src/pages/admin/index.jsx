import React, { useState } from 'react';
import { Layout, Menu, Card, Typography, Avatar, Dropdown, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  PieChartOutlined,
  FileTextOutlined,
  BarChartOutlined,
  RobotOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import PollingManagement from './PollingManagement';
import PoliciesManagement from './PoliciesManagement';
import ReportPolling from './ReportPolling';
import ReportChatbot from './ReportChatbot';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'User Management',
    },
    {
      key: 'polling',
      icon: <PieChartOutlined />,
      label: 'Polling Management',
    },
    {
      key: 'policies',
      icon: <FileTextOutlined />,
      label: 'Policies Management',
    },
    {
      type: 'divider',
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      children: [
        {
          key: 'polling-report',
          icon: <PieChartOutlined />,
          label: 'Polling Report',
        },
        {
          key: 'chatbot-report',
          icon: <RobotOutlined />,
          label: 'Chatbot Report',
        },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'polling':
        return <PollingManagement />;
      case 'policies':
        return <PoliciesManagement />;
      case 'polling-report':
        return <ReportPolling />;
      case 'chatbot-report':
        return <ReportChatbot />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#001529',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
        width={250}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #303030',
          marginBottom: '16px'
        }}>
          {!collapsed ? (
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              🏛️ SmartPol Admin
            </Title>
          ) : (
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              🏛️
            </Title>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{
            border: 'none',
            fontSize: '14px'
          }}
        />
      </Sider>
      
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
                marginRight: '16px'
              }}
            />
            <Title level={4} style={{ margin: 0, color: '#001529' }}>
              {menuItems.find(item => item.key === selectedKey)?.label || 'Dashboard'}
            </Title>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px' }}
            />
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'background-color 0.3s'
              }}>
                <Avatar 
                  size={32} 
                  icon={<UserOutlined />} 
                  style={{ marginRight: '8px', backgroundColor: '#1890ff' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ fontSize: '14px' }}>Admin User</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Administrator</Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{
          margin: '24px',
          padding: '24px',
          background: '#f5f5f5',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)',
          overflow: 'auto'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;