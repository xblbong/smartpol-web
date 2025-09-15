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


const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileSize = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(isMobileSize);
      if (isMobileSize) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
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
      type: 'divider',
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

      case 'users':
        return <UserManagement />;

      case 'polling':
        return <PollingManagement />;
      case 'policies':
        return <PoliciesManagement />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout className="admin-layout">
      {/* Mobile overlay when sidebar is open */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 z-50"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.50)',
            backdropFilter: 'blur(8px)',           
            WebkitBackdropFilter: 'blur(8px)',
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
        className={`admin-sidebar ${isMobile ? 'fixed z-50' : 'relative'} ${!collapsed ? 'open' : ''}`}
        style={{
          background: '#001529',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        }}
        width={250}
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          } else {
            setCollapsed(false);
          }
        }}
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
          className="h-full overflow-y-auto"
          style={{
            border: 'none',
            fontSize: '14px',
            height: 'calc(100vh - 80px)',
            overflowY: 'auto'
          }}
        />
      </Sider>
      
      <Layout className="flex-1 flex flex-col">
        <Header className={`bg-white shadow-sm z-10 transition-all duration-300 ${
          isMobile && !collapsed ? 'ml-64' : ''
        }`} style={{
          padding: isMobile ? '0 16px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
              color: '#fff'              }}
            />
            <Title level={4} style={{ margin: 0, color: '#001529' }}>
              {menuItems.find(item => item.key === selectedKey)?.label || 'Dashboard'}
            </Title>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px', color: '#fff' }}
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
                    <Text strong style={{ fontSize: '14px', color: '#fff' }}>Admin User</Text>
                    <Text type="secondary" style={{ fontSize: '12px', color: '#dedede' }}>Administrator</Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className={`admin-content ${isMobile && !collapsed ? 'sidebar-open' : ''}`} style={{
          margin: isMobile ? '16px' : '24px',
          padding: isMobile ? '16px' : '24px',
          background: '#f5f5f5',
          borderRadius: '8px',
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;