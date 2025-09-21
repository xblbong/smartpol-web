import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Modal, Alert, Divider, Upload, Avatar } from 'antd';
import { UserOutlined, MailOutlined, LogoutOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, UploadOutlined, CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import AppSidebar from '../components/layouts/AppSidebar';
import { FaBars } from 'react-icons/fa';

const Settings = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  // Listen for form changes
  useEffect(() => {
    const subscription = form.getFieldsValue();
    if (user) {
      const currentValues = form.getFieldsValue();
      const hasFormChanges = Object.keys(currentValues).some(key => 
        currentValues[key] !== user[key]
      );
      setHasChanges(hasFormChanges);
      setFormData(currentValues);
    }
  }, [form, user]);

  // Real-time form validation
  const handleFormChange = (changedFields, allFields) => {
    const currentValues = form.getFieldsValue();
    setFormData(currentValues);
    
    // Check for changes
    if (user) {
      const hasFormChanges = Object.keys(currentValues).some(key => 
        currentValues[key] !== user[key]
      );
      setHasChanges(hasFormChanges);
    }

    // Real-time validation
    const errors = {};
    allFields.forEach(field => {
      if (field.errors && field.errors.length > 0) {
        errors[field.name[0]] = field.errors[0];
      }
    });
    setValidationErrors(errors);
  };

  const fetchUserData = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.authenticated) {
        const userData = response.user;
        setUser(userData);
        const initialFormData = {
          full_name: userData.full_name,
          email: userData.email,
          username: userData.username,
          nik: userData.nik || ''
        };
        form.setFieldsValue(initialFormData);
        setFormData(initialFormData);
        setAvatarUrl(userData.avatar_url || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Gagal memuat data pengguna');
    }
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      // Additional validation before submit
      if (!values.full_name || values.full_name.trim().length < 2) {
        message.error('Nama lengkap minimal 2 karakter');
        setLoading(false);
        return;
      }
      
      if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        message.error('Format email tidak valid');
        setLoading(false);
        return;
      }

      if (!values.username || values.username.trim().length < 3) {
        message.error('Username minimal 3 karakter');
        setLoading(false);
        return;
      }

      // Include avatar_url in the update
      const updateData = { ...values, avatar_url: avatarUrl };
      const response = await authAPI.updateProfile(updateData);
      if (response.data.success) {
        message.success('Profil berhasil diperbarui');
        const updatedUser = { ...user, ...updateData };
        setUser(updatedUser);
        setHasChanges(false);
        setPreviewMode(false);
        // Refresh form with updated data
        form.setFieldsValue(values);
        setFormData(values);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Gagal memperbarui profil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    if (user) {
      const originalData = {
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        nik: user.nik || ''
      };
      form.setFieldsValue(originalData);
      setFormData(originalData);
      setAvatarUrl(user.avatar_url || '');
      setHasChanges(false);
      setPreviewMode(false);
      setValidationErrors({});
      message.info('Form telah direset ke data asli');
    }
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setAvatarUrl(reader.result);
        setUploadLoading(false);
        setHasChanges(true);
        message.success('Avatar berhasil diupload');
      });
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Hanya file JPG/PNG yang diperbolehkan!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ukuran gambar harus kurang dari 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <CameraOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );



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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  {user?.avatar_url ? (
                    <Avatar size={48} src={user.avatar_url} className="mb-2 mx-auto" />
                  ) : (
                    <Avatar size={48} style={{backgroundColor: '#01077A'}} className="mb-2 mx-auto">
                      {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  )}
                  <p className="text-sm text-gray-500 mb-1">Foto Profil</p>
                  <p className="font-semibold text-xs" style={{color: '#01077A'}}>{user?.avatar_url ? 'Tersedia' : 'Belum diatur'}</p>
                </div>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EditOutlined style={{color: '#FAC62A'}} />
                    <span>Edit Profil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={togglePreviewMode}
                      type={previewMode ? 'primary' : 'default'}
                    >
                      {previewMode ? 'Sembunyikan Preview' : 'Tampilkan Preview'}
                    </Button>
                    {hasChanges && (
                      <Button 
                        size="small"
                        onClick={handleResetForm}
                        danger
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              }
              className="shadow-lg mb-6"
            >
              {/* Change Detection Alert */}
              {hasChanges && (
                <Alert
                  message="Perubahan Terdeteksi"
                  description="Anda memiliki perubahan yang belum disimpan. Klik 'Perbarui Profil' untuk menyimpan atau 'Reset' untuk membatalkan."
                  type="warning"
                  showIcon
                  className="mb-4"
                  icon={<EditOutlined />}
                />
              )}

              {/* Preview Mode */}
              {previewMode && (
                <Card 
                  size="small" 
                  title={
                    <div className="flex items-center gap-2">
                      <EyeOutlined style={{color: '#01077A'}} />
                      <span>Preview Data Baru</span>
                    </div>
                  }
                  className="mb-4 bg-blue-50 border-blue-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      {avatarUrl ? (
                  <Avatar size={32} src={avatarUrl || null} className="mb-1 mx-auto" />
                      ) : (
                        <Avatar size={32} style={{backgroundColor: '#01077A'}} className="mb-1 mx-auto">
                          {formData?.full_name ? formData.full_name.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                      )}
                      <p className="text-xs text-gray-500 mb-1">Foto Profil</p>
                      <p className="font-medium text-xs" style={{color: '#01077A'}}>
                        {avatarUrl ? 'Diperbarui' : 'Belum diatur'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <UserOutlined className="text-lg mb-1" style={{color: '#01077A'}} />
                      <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                      <p className="font-medium text-sm" style={{color: '#01077A'}}>
                        {formData?.full_name || '-'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <MailOutlined className="text-lg mb-1" style={{color: '#01077A'}} />
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="font-medium text-sm" style={{color: '#01077A'}}>
                        {formData?.email || '-'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <UserOutlined className="text-lg mb-1" style={{color: '#01077A'}} />
                      <p className="text-xs text-gray-500 mb-1">Username</p>
                      <p className="font-medium text-sm" style={{color: '#01077A'}}>
                        {formData?.username || '-'}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
                onFieldsChange={handleFormChange}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label="Nama Lengkap"
                    name="full_name"
                    rules={[
                      { required: true, message: 'Nama lengkap wajib diisi' },
                      { min: 2, message: 'Nama lengkap minimal 2 karakter' },
                      { max: 100, message: 'Nama lengkap maksimal 100 karakter' }
                    ]}
                    validateStatus={validationErrors.full_name ? 'error' : ''}
                    help={validationErrors.full_name}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Masukkan nama lengkap"
                      showCount
                      maxLength={100}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Email wajib diisi' },
                      { type: 'email', message: 'Format email tidak valid' },
                      { max: 255, message: 'Email maksimal 255 karakter' }
                    ]}
                    validateStatus={validationErrors.email ? 'error' : ''}
                    help={validationErrors.email}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="Masukkan email"
                      showCount
                      maxLength={255}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Foto Profil"
                    className="md:col-span-2"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar 
                        size={64} 
                        src={avatarUrl || null} 
                        style={{backgroundColor: '#01077A'}}
                      >
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleAvatarUpload}
                        customRequest={({ file, onSuccess }) => {
                          setTimeout(() => {
                            onSuccess("ok");
                          }, 0);
                        }}
                      >
                        {uploadButton}
                      </Upload>
                      {avatarUrl && (
                        <Button 
                          type="link" 
                          danger 
                          onClick={() => {
                            setAvatarUrl('');
                            setHasChanges(true);
                            message.success('Avatar dihapus');
                          }}
                        >
                          Hapus Avatar
                        </Button>
                      )}
                    </div>
                  </Form.Item>
                </div>

                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: 'Username wajib diisi' },
                    { min: 3, message: 'Username minimal 3 karakter' },
                    { max: 50, message: 'Username maksimal 50 karakter' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username hanya boleh mengandung huruf, angka, dan underscore' }
                  ]}
                  validateStatus={validationErrors.username ? 'error' : ''}
                  help={validationErrors.username}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Masukkan username"
                    showCount
                    maxLength={50}
                  />
                </Form.Item>

                <Divider />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      size="large"
                      disabled={!hasChanges || Object.keys(validationErrors).length > 0}
                      style={{backgroundColor: '#01077A', color: '#fff', borderColor: '#01077A'}}
                      icon={<CheckCircleOutlined />}
                    >
                      Perbarui Profil
                    </Button>
                    
                    {hasChanges && (
                      <Button 
                        size="large"
                        onClick={handleResetForm}
                        disabled={loading}
                      >
                        Batal
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {hasChanges ? (
                      <span className="text-orange-600 font-medium">
                        <EditOutlined className="mr-1" />
                        Ada perubahan belum disimpan
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        <CheckCircleOutlined className="mr-1" />
                        Data tersimpan
                      </span>
                    )}
                  </div>
                </div>
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