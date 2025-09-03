import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Alert, Modal } from 'antd';
import { IdcardOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import AppSidebar from '../components/layouts/AppSidebar';
import { FaBars } from 'react-icons/fa';

const NikVerification = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nikVerified, setNikVerified] = useState(false);
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
        setNikVerified(!!userData.nik_verified);
        if (userData.nik) {
          form.setFieldsValue({
            nik: userData.nik
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Gagal memuat data pengguna');
    }
  };

  const handleVerifyNIK = async (values) => {
    const nikValue = values.nik;
    if (!nikValue || nikValue.length !== 16) {
      message.error('NIK harus terdiri dari 16 digit');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyNIK({ nik: nikValue });
      if (response.data.success) {
        message.success('NIK berhasil diverifikasi');
        setNikVerified(true);
        setUser({ ...user, nik: nikValue, nik_verified: true });
      }
    } catch (error) {
      console.error('Error verifying NIK:', error);
      message.error('Gagal memverifikasi NIK');
    } finally {
      setLoading(false);
    }
  };

  const showPrivacyModal = () => {
    Modal.info({
      title: 'Kebijakan Privasi NIK',
      width: 600,
      content: (
        <div className="space-y-4">
          <p><strong>Perlindungan Data NIK Anda</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li>NIK Anda akan dienkripsi dengan standar keamanan tinggi</li>
            <li>Data hanya digunakan untuk verifikasi identitas dan akses fitur polling</li>
            <li>Kami tidak akan membagikan NIK Anda kepada pihak ketiga</li>
            <li>Data disimpan sesuai dengan peraturan perlindungan data yang berlaku</li>
            <li>Anda dapat menghapus data NIK kapan saja melalui pengaturan akun</li>
          </ul>
          <p className="text-sm text-gray-600 mt-4">
            Dengan melanjutkan verifikasi, Anda menyetujui kebijakan privasi ini.
          </p>
        </div>
      ),
      okText: 'Saya Mengerti'
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
          <h1 className="text-lg font-semibold" style={{color: '#01077A'}}>Verifikasi NIK</h1>
          <div className="w-10"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6" style={{color: '#01077A'}}>Verifikasi NIK</h1>
            
            {/* Security Disclaimer */}
            <Alert
              message="Keamanan Data Terjamin"
              description={
                <div>
                  <p className="mb-2">
                    NIK Anda akan disimpan dengan aman dan dilindungi menggunakan enkripsi tingkat tinggi. 
                    Data hanya digunakan untuk verifikasi identitas dalam sistem polling.
                  </p>
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={showPrivacyModal}
                    className="p-0 h-auto"
                  >
                    Baca selengkapnya tentang kebijakan privasi
                  </Button>
                </div>
              }
              type="info"
              icon={<LockOutlined />}
              className="mb-6"
              showIcon
            />

            {/* NIK Verification Card */}
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <SafetyOutlined style={{color: '#FAC62A'}} />
                  <span>Verifikasi Identitas</span>
                  {nikVerified && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Terverifikasi
                    </span>
                  )}
                </div>
              }
              className="shadow-lg"
            >
              {nikVerified ? (
                <div className="text-center py-8">
                  <SafetyOutlined 
                    style={{ fontSize: '48px', color: '#52c41a' }} 
                    className="mb-4"
                  />
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    NIK Anda Sudah Terverifikasi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Anda dapat mengakses semua fitur polling dan kebijakan.
                  </p>
                  <Button 
                    type="primary" 
                    onClick={() => navigate('/polling')}
                    style={{ backgroundColor: '#01077A', borderColor: '#01077A' }}
                  >
                    Akses Polling
                  </Button>
                </div>
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleVerifyNIK}
                >
                  <Form.Item
                    label="Nomor Induk Kependudukan (NIK)"
                    name="nik"
                    rules={[
                      { required: true, message: 'NIK wajib diisi' },
                      { len: 16, message: 'NIK harus terdiri dari 16 digit' },
                      { pattern: /^[0-9]+$/, message: 'NIK hanya boleh berisi angka' }
                    ]}
                  >
                    <Input 
                      prefix={<IdcardOutlined />} 
                      placeholder="Masukkan 16 digit NIK Anda"
                      maxLength={16}
                    />
                  </Form.Item>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Mengapa NIK diperlukan?</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Memastikan hanya warga yang berhak dapat berpartisipasi</li>
                      <li>• Mencegah duplikasi suara dalam polling</li>
                      <li>• Meningkatkan kredibilitas hasil polling</li>
                    </ul>
                  </div>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      block
                      size="large"
                      style={{ backgroundColor: '#01077A', borderColor: '#01077A' }}
                    >
                      Verifikasi NIK
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NikVerification;