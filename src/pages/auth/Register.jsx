import React from "react";
import { Form, Select, Input as AntInput } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
// PERUBAHAN DI SINI: Menggunakan ../../ untuk path yang benar
import InputComponents from "../../components/InputComponents";
import ButtonComponent from "../../components/ButtonComponent";
import HeaderForm from "../../components/HeaderForm";
import { useNavigate } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";

const { Option } = Select;
const { TextArea } = AntInput;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

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
            name="register"
            onFinish={onFinish}
            layout="vertical"
            className="mt-8"
            autoComplete="off"
          >
            <InputComponents
              label="Username"
              name="username"
              placeholder="Masukkan username unik"
              prefix={
                <UserOutlined className="site-form-item-icon mr-2 text-gray-400" />
              }
              rules={[{ required: true, message: "Username wajib diisi!" }]}
            />

            <InputComponents
              label="Nama Lengkap"
              name="fullName"
              placeholder="Masukkan nama lengkap"
              prefix={
                <IdcardOutlined className="site-form-item-icon mr-2 text-gray-400" />
              }
              rules={[{ required: true, message: "Nama lengkap wajib diisi!" }]}
            />

            <InputComponents
              label="Email"
              name="email"
              placeholder="Masukkan alamat email"
              type="email"
              prefix={
                <MailOutlined className="site-form-item-icon mr-2 text-gray-400" />
              }
              rules={[
                { required: true, message: "Email wajib diisi!" },
                { type: "email", message: "Format email tidak valid!" },
              ]}
            />

            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Peran
              </label>
              <Form.Item
                name="role"
                rules={[
                  { required: true, message: "Silakan pilih peran Anda!" },
                ]}
              >
                <Select id="role" placeholder="Pilih peran Anda" size="large">
                  <Option value="admin">Admin</Option>
                  <Option value="user">User</Option>
                  <Option value="guest">Guest</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Keterangan (Opsional)
              </label>
              <Form.Item name="description">
                <TextArea
                  id="description"
                  rows={3}
                  placeholder="Tambahkan keterangan tentang diri Anda (jabatan, instansi, dll)"
                />
              </Form.Item>
            </div>

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

            <InputComponents
              label="Konfirmasi Password"
              name="confirmPassword"
              placeholder="Konfirmasi password"
              prefix={
                <LockOutlined className="site-form-item-icon mr-2 text-gray-400" />
              }
              isPassword={true}
              rules={[
                { required: true, message: "Mohon konfirmasi password Anda!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Password yang Anda masukkan tidak cocok!")
                    );
                  },
                }),
              ]}
            />

            <Form.Item className="mt-6">
              <ButtonComponent
                type="submit"
                className="bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 w-full flex justify-center items-center gap-2 px-4 py-3 rounded-md shadow-sm text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colorscursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserAddOutlined />
                Daftar Sekarang
              </ButtonComponent>
            </Form.Item>
          </Form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <ButtonComponent
              type="link"
              className="font-medium text-[#1e3a8a] hover:text-blue-500"
              onClick={() => navigate("/login")}
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

export default Register;
