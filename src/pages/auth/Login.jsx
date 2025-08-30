import React, { useState } from "react";
import { Form, Select, Input as AntInput, Checkbox, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  UserAddOutlined,
  LoginOutlined,
  ShopFilled,
} from "@ant-design/icons";
// PERUBAHAN DI SINI: Menggunakan ../../ untuk path yang benar
import InputComponents from "../../components/InputComponents";
import ButtonComponent from "../../components/ButtonComponent";
import HeaderForm from "../../components/HeaderForm";
import { useNavigate } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import { authAPI } from "../../services/api";

const { Option } = Select;
const { TextArea } = AntInput;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gunakan identifier sebagai username untuk login
      const loginData = {
        username: values.identifier,
        password: values.password
      };
      
      const response = await authAPI.login(loginData);
      
      message.success('Login berhasil!');
      console.log('User logged in:', response.user);
      
      // Redirect ke halaman home setelah login berhasil
      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.error || 'Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <HeaderForm />
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Masuk Akun Konsituen
            </h2>
            <p className="mt-2 text-sm text-gray-600 mb-4">
              Bergabunglah dengan platform demokrasi digital
            </p>
          </div>

          <Form
            form={form}
            name="Login"
            onFinish={onFinish}
            layout="vertical"
            className="mt-8"
            autoComplete="off"
          >
            <InputComponents
              label="Username"
              name="identifier"
              placeholder="Masukkan username"
              prefix={
                <UserOutlined className="site-form-item-icon mr-2 text-gray-400" />
              }
              rules={[
                { required: true, message: "Username wajib diisi!" },
              ]}
            />

            <InputComponents
              label="Password"
              name="password"
              placeholder="Masukkan password"
              prefix={
                <LockOutlined className="site-form-item-icon mr-2 text-gray-400" />
              }
              isPassword={true}
              rules={[{ required: true, message: "Password wajib diisi!" }]}
            />

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ingat saya</Checkbox>
              </Form.Item>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Lupa password?
              </a>
            </div>

            <Form.Item>
              <ButtonComponent
                type="submit"
                loading={loading}
                disabled={loading}
                className="bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-500 w-full flex justify-center items-center gap-2 px-4 py-3 rounded-md shadow-sm text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                {loading ? 'Masuk...' : 'Masuk'}
              </ButtonComponent>
            </Form.Item>

            

            <Form.Item>
            </Form.Item>
          </Form>

          <p className="mt-4 text-center text-sm tex    t-gray-600">
            Belum punya akun?{" "}
            <ButtonComponent
              type="link"
              onClick={() => navigate("/register")}
              className="font-medium text-[#1e3a8a] hover:text-blue-500"
            >
              Daftar di sini
            </ButtonComponent>
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <Footer className="text-center bg-none text-xs text-gray-500">
          © 2024 SMARTPOL UB. Platform berbasis AI untuk transparansi demokrasi.
      </Footer>
    </>
  );
};

export default Login;
