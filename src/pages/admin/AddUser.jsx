import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  message,
  Upload,
  Avatar,
  Space,
  Divider
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SidebarComponents from '../../components/layouts/SidebarComponents';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AddUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form values:', values);
      message.success('User berhasil ditambahkan!');
      form.resetFields();
      setAvatarUrl(null);
      
      // Redirect to all users page after success
      setTimeout(() => {
        navigate('/admin/users/all');
      }, 1500);
    } catch (error) {
      message.error('Gagal menambahkan user. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setAvatarUrl(info.file.response?.url || URL.createObjectURL(info.file.originFileObj));
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin/users/all')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeftOutlined className="mr-2" />
            Kembali ke Semua Pengguna
          </button>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <UserOutlined className="text-white text-xl" style={{color: 'white'}} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Pengguna Baru</h1>
              <p className="text-gray-600 mt-1">Lengkapi informasi untuk menambahkan pengguna baru</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <UserOutlined style={{color: 'blue'}} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Informasi Pengguna</h3>
              </div>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Nama Lengkap</span>}
                      name="name"
                      rules={[
                        { required: true, message: 'Silakan masukkan nama lengkap!' },
                        { min: 2, message: 'Nama harus minimal 2 karakter!' }
                      ]}
                    >
                      <div className="relative">
                        <UserOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Alamat Email</span>}
                      name="email"
                      rules={[
                        { required: true, message: 'Silakan masukkan alamat email!' },
                        { type: 'email', message: 'Silakan masukkan email yang valid!' }
                      ]}
                    >
                      <div className="relative">
                        <MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Masukkan alamat email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Nomor Telepon</span>}
                      name="phone"
                      rules={[
                        { required: true, message: 'Silakan masukkan nomor telepon!' },
                        { pattern: /^[0-9+\-\s()]+$/, message: 'Silakan masukkan nomor telepon yang valid!' }
                      ]}
                    >
                      <div className="relative">
                        <PhoneOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Masukkan nomor telepon"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Peran</span>}
                      name="role"
                      rules={[{ required: true, message: 'Silakan pilih peran!' }]}
                    >
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200">
                        <option value="">Pilih peran pengguna</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="konsituen">Konsituen</option>
                      </select>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Status</span>}
                      name="status"
                      rules={[{ required: true, message: 'Silakan pilih status!' }]}
                      initialValue="active"
                    >
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200">
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                        <option value="pending">Menunggu</option>
                      </select>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Kata Sandi</span>}
                      name="password"
                      rules={[
                        { required: true, message: 'Silakan masukkan kata sandi!' },
                        { min: 6, message: 'Kata sandi harus minimal 6 karakter!' }
                      ]}
                    >
                      <div className="relative">
                        <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input.Password 
                          placeholder="Masukkan kata sandi"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </Form.Item>
                  </div>
                  <div className="md:col-span-2">
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Alamat</span>}
                      name="address"
                    >
                      <textarea 
                        rows={3}
                        placeholder="Masukkan alamat (opsional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                      />
                    </Form.Item>
                  </div>
                  <div className="md:col-span-2">
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Catatan</span>}
                      name="notes"
                    >
                      <textarea 
                        rows={3}
                        placeholder="Catatan tambahan (opsional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <Form.Item className="mb-0">
                    <div className="flex gap-3">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SaveOutlined className="mr-2" />
                        {loading ? 'Menambahkan Pengguna...' : 'Tambah Pengguna'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => form.resetFields()}
                        className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                      >
                        Reset Form
                      </button>
                    </div>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <UserOutlined style={{color: 'green'}} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Foto Profil</h3>
              </div>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar 
                    size={120} 
                    icon={<UserOutlined />} 
                    src={avatarUrl}
                    className="border-4 border-gray-100 shadow-lg"
                  />
                  {!avatarUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-full border-4 border-gray-100">
                      <UserOutlined className="text-4xl text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <Upload
                    name="avatar"
                    listType="picture"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleAvatarChange}
                    customRequest={({ file, onSuccess }) => {
                      // Simulate upload
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 1000);
                    }}
                  >
                    <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center mx-auto font-medium">
                      <UploadOutlined className="mr-2" />
                      Upload Foto
                    </button>
                  </Upload>
                  <p className="text-xs text-gray-500 mt-2">
                    File JPG/PNG saja, maksimal 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-yellow-600 text-sm font-bold">💡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tips Cepat</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pastikan alamat email unik untuk setiap pengguna
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Gunakan kata sandi yang kuat (minimal 6 karakter)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Nomor telepon sebaiknya menyertakan kode negara
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Admin memiliki akses penuh ke sistem
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Moderator dapat mengelola konten
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Konsituen adalah pengguna biasa
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;