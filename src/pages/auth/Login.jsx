import React from "react";
import { Form, Select, Input as AntInput, Checkbox } from "antd";
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

const { Option } = Select;
const { TextArea } = AntInput;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Data yang disubmit:", values);
    // Logika untuk mengirim data ke API bisa ditambahkan di sini
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <HeaderForm />
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Daftar Akun Baru
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
              label="Username atau Email"
              name="identifier"
              placeholder="Masukkan username atau email"
              prefix={
                <UserOutlined className="site-form-item-icon mr-2 text-gray-400" />
              }
              rules={[
                { required: true, message: "Username atau Email wajib diisi!" },
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
                className="bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-500 w-full flex justify-center items-center gap-2 px-4 py-3 rounded-md shadow-sm text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colorscursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fa-solid fa-right-to-bracket"></i>
                Masuk
              </ButtonComponent>
            </Form.Item>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau</span>
              </div>
            </div>

            <Form.Item>
              <ButtonComponent
                type="button"
                className="bg-white text-blue-800 border-2 border-blue-800 hover:bg-blue-50 focus:ring-blue-500 w-full flex justify-center items-center gap-2 px-4 py-3 rounded-md shadow-sm text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colorscursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-shield-alt mr-2"></i>
                Masuk dengan OTP
              </ButtonComponent>
            </Form.Item>
          </Form>

          <p className="mt-4 text-center text-sm tex    t-gray-600">
            Sudah punya akun?{" "}
            <ButtonComponent
              type="link"
              onClick={() => navigate("/register")}
              className="font-medium text-[#1e3a8a] hover:text-blue-500"
            >
              Masuk di sini
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
