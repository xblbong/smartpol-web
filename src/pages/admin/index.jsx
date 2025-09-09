import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown, Modal, message } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  PieChartOutlined,
  FileTextOutlined,
  BarChartOutlined,
  RobotOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import PollingManagement from './PollingManagement';
import PoliciesManagement from './PoliciesManagement';
import ReportPolling from './ReportPolling';
import ReportChatbot from './ReportChatbot';
import Analytics from './Analytics';
import Roles from './Roles';
import DailyReport from './DailyReport';
import MonthlyReport from './MonthlyReport';
import AnnualReport from './AnnualReport';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const navigate = useNavigate();

  const handleLogout = async () => {
    Modal.confirm({
      title: 'Konfirmasi Logout Admin',
      content: 'Apakah Anda yakin ingin keluar dari panel admin?',
      okText: 'Ya, Keluar',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          // Call admin logout API
          await authAPI.adminLogout();
          
          message.success('Berhasil logout dari panel admin');
          
          // Redirect to admin login page
          navigate('/admin-login');
          
        } catch (error) {
          console.error('Error during admin logout:', error);
          
          // Even if API call fails, clear local data and redirect
          localStorage.removeItem('admin');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          sessionStorage.clear();
          
          message.success('Berhasil logout dari panel admin');
          navigate('/admin-login');
        }
      }
    });
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      type: 'divider',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'User Management',
    },
    {
      key: 'roles',
      icon: <SettingOutlined />,
      label: 'Roles & Permissions',
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
          key: 'daily-report',
          icon: <BarChartOutlined />,
          label: 'Daily Report',
        },
        {
          key: 'monthly-report',
          icon: <BarChartOutlined />,
          label: 'Monthly Report',
        },
        {
          key: 'annual-report',
          icon: <BarChartOutlined />,
          label: 'Annual Report',
        },
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
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const userMenuProps = {
    items: userMenuItems,
    onClick: handleMenuClick
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'roles':
        return <Roles />;
      case 'polling':
        return <PollingManagement />;
      case 'policies':
        return <PoliciesManagement />;
      case 'daily-report':
        return <DailyReport />;
      case 'monthly-report':
        return <MonthlyReport />;
      case 'annual-report':
        return <AnnualReport />;
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
      {/* Mobile overlay when sidebar is open */}
      {isMobile && !collapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 999
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          background: '#001529',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          position: isMobile ? 'fixed' : 'relative',
          height: isMobile ? '100vh' : 'auto',
          zIndex: isMobile ? 1000 : 'auto'
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
          padding: isMobile ? '0 16px' : '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1,
          marginLeft: isMobile && !collapsed ? 250 : 0,
          transition: 'margin-left 0.2s'
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
              menu={userMenuProps}
              placement="bottomRight"
              arrow
              trigger={['click']}
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
                {!isMobile && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ fontSize: '14px' }}>Admin User</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Administrator</Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{
          margin: isMobile ? '16px' : '24px',
          padding: isMobile ? '16px' : '24px',
          background: '#f5f5f5',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)',
          overflow: 'auto',
          marginLeft: isMobile && !collapsed ? 250 : (isMobile ? '16px' : '24px'),
          transition: 'margin-left 0.2s'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;