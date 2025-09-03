import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Modal } from 'antd';
import { UserOutlined, MailOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import AppSidebar from '../components/layouts/AppSidebar';
import { FaBars } from 'react-icons/fa';

const Settings = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.data.authenticated) {
        const userData = response.data.user;
        setUser(userData);
        form.setFieldsValue({
          full_name: userData.full_name,
          email: userData.email,
          username: userData.username,
          nik: userData.nik || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Gagal memuat data pengguna');
    }
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(values);
      if (response.data.success) {
        message.success('Profil berhasil diperbarui');
        setUser({ ...user, ...values });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };



  const handleLogout = () => {
    Modal.confirm({
      title: 'Konfirmasi Logout',
      content: 'Apakah Anda yakin ingin keluar dari aplikasi?',
      okText: 'Ya, Keluar',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          await authAPI.logout();
          message.success('Berhasil logout');
          navigate('/login');
        } catch (error) {
          console.error('Error during logout:', error);
          message.error('Gagal logout');
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b" style={{borderBottomColor: '#01077A'}}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <FaBars size={20} style={{color: '#01077A'}} />
          </button>
          <h1 className="text-lg font-semibold" style={{color: '#01077A'}}>Settings</h1>
          <div className="w-10"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6" style={{color: '#01077A'}}>Pengaturan Akun</h1>
            
            {/* User Info Display */}
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <UserOutlined style={{color: '#FAC62A'}} />
                  <span>Informasi Akun</span>
                </div>
              }
              className="shadow-lg mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <UserOutlined className="text-2xl mb-2" style={{color: '#01077A'}} />
                  <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                  <p className="font-semibold" style={{color: '#01077A'}}>{user?.full_name || '-'}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <MailOutlined className="text-2xl mb-2" style={{color: '#01077A'}} />
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold" style={{color: '#01077A'}}>{user?.email || '-'}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <UserOutlined className="text-2xl mb-2" style={{color: '#01077A'}} />
                  <p className="text-sm text-gray-500 mb-1">Username</p>
                  <p className="font-semibold" style={{color: '#01077A'}}>{user?.username || '-'}</p>
                </div>
              </div>
            </Card>

            {/* Edit Profile Card */}
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <EditOutlined style={{color: '#FAC62A'}} />
                  <span>Edit Profil</span>
                </div>
              }
              className="shadow-lg mb-6"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label="Nama Lengkap"
                    name="full_name"
                    rules={[{ required: true, message: 'Nama lengkap wajib diisi' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Masukkan nama lengkap" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Email wajib diisi' },
                      { type: 'email', message: 'Format email tidak valid' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Masukkan email" />
                  </Form.Item>
                </div>

                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Username wajib diisi' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Masukkan username" />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    size="large"
                    style={{backgroundColor: '#01077A', borderColor: '#01077A'}}
                  >
                    <EditOutlined /> Perbarui Profil
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Logout Section */}
            <Card className="mt-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold" style={{color: '#01077A'}}>Keluar dari Akun</h3>
                  <p className="text-gray-600">Keluar dari aplikasi dan kembali ke halaman login</p>
                </div>
                <Button 
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  size="large"
                >
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;