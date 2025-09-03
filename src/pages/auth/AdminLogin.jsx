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
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <HeaderForm />
        <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg shadow -2xl rounded-lg animate-fade-in-down">
          <div className="text-center mb-6 px-4">
            <SafetyOutlined className="text-5xl text-blue-600 mb-4 animate-bounce-in" />
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Akses Administrator
            </h2>
            <p className="mt-2 text-md text-gray-600">
              Silakan masukkan kredensial admin Anda untuk melanjutkan.
            </p>
          </div>

          <Form
            form={form}
            name="adminLogin"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            className="px-4"
          >
            <Form.Item
              label={<span className="font-semibold text-gray-700">Username Admin</span>}
              name="username"
              rules={[
                { required: true, message: "Username admin wajib diisi!" },
              ]}
              className="mb-4"
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 text-lg" />}
                placeholder="Masukkan username admin"
                size="large"
                className="rounded-md h-12 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-gray-700">Password Admin</span>}
              name="password"
              rules={[
                { required: true, message: "Password admin wajib diisi!" }
              ]}
              className="mb-6"
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-lg" />}
                placeholder="Masukkan password admin"
                size="large"
                className="rounded-md h-12 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full rounded-md font-bold text-lg transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: '#1e40af', // Blue-800
                  borderColor: '#1e40af', // Blue-800
                  height: '52px'
                }}
              >
                <SafetyOutlined className="mr-2" />
                {loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Button
              type="link"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 text-base transition-colors duration-300"
            >
              Kembali ke Login User
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Footer */}
      <Footer className="text-center bg-transparent text-sm text-white py-4">
          © 2024 SMARTPOL UB. Platform berbasis AI untuk transparansi demokrasi.
      </Footer>
    </>
  );
};

export default AdminLogin;