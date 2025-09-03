import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import { authAPI } from "../../services/api";
import HeaderForm from "../../components/HeaderForm";

const AdminLogin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const loginData = {
        username: values.username,
        password: values.password,
        isAdmin: true // Flag untuk login admin
      };
      
      const response = await authAPI.adminLogin(loginData);
      
      message.success('Login admin berhasil!');
      console.log('Admin logged in:', response.user);
      
      // Simpan data admin ke localStorage
      localStorage.setItem('admin', JSON.stringify(response.user));
      localStorage.setItem('adminToken', response.token);
      
      // Redirect ke halaman admin
      navigate('/admin');
      
    } catch (error) {
      console.error('Admin login error:', error);
      message.error(error.error || 'Username atau password admin salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col justify-center items-center p-4">
        <HeaderForm />
        <Card className="w-full max-w-md shadow-2xl">
          <div className="text-center mb-6">
            <UserOutlined className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              Login Administrator
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Akses khusus untuk administrator sistem
            </p>
          </div>

          <Form
            form={form}
            name="adminLogin"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              label="Username Admin"
              name="username"
              rules={[
                { required: true, message: "Username admin wajib diisi!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Masukkan username admin"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password Admin"
              name="password"
              rules={[
                { required: true, message: "Password admin wajib diisi!" }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Masukkan password admin"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full"
                style={{
                  backgroundColor: '#1e40af',
                  borderColor: '#1e40af',
                  height: '48px'
                }}
              >
                <SafetyOutlined />
                {loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Button
              type="link"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-500"
            >
              Kembali ke Login User
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Footer */}
      <Footer className="text-center bg-transparent text-xs text-white">
          © 2024 SMARTPOL UB. Platform berbasis AI untuk transparansi demokrasi.
      </Footer>
    </>
  );
};

export default AdminLogin;