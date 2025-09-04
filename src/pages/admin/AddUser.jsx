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
      <div className="flex-1 p-6 overflow-auto">
        <div style={{ marginBottom: '24px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/users/all')}
            style={{ marginBottom: '16px' }}
          >
            Back to All Users
          </Button>
          <Title level={2} style={{ marginBottom: '0', color: '#001529' }}>
            ➕ Add New User
          </Title>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="User Information" style={{ height: 'fit-content' }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Full Name"
                      name="name"
                      rules={[
                        { required: true, message: 'Please enter full name!' },
                        { min: 2, message: 'Name must be at least 2 characters!' }
                      ]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Enter full name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter email address!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Enter email address"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[
                        { required: true, message: 'Please enter phone number!' },
                        { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number!' }
                      ]}
                    >
                      <Input 
                        prefix={<PhoneOutlined />} 
                        placeholder="Enter phone number"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Role"
                      name="role"
                      rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                      <Select placeholder="Select user role" size="large">
                        <Option value="admin">Admin</Option>
                        <Option value="moderator">Moderator</Option>
                        <Option value="konsituen">Konsituen</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[{ required: true, message: 'Please select status!' }]}
                      initialValue="active"
                    >
                      <Select placeholder="Select status" size="large">
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                        <Option value="pending">Pending</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        { required: true, message: 'Please enter password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                      ]}
                    >
                      <Input.Password 
                        prefix={<LockOutlined />} 
                        placeholder="Enter password"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Address"
                      name="address"
                    >
                      <TextArea 
                        rows={3}
                        placeholder="Enter address (optional)"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Notes"
                      name="notes"
                    >
                      <TextArea 
                        rows={3}
                        placeholder="Additional notes (optional)"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      {loading ? 'Adding User...' : 'Add User'}
                    </Button>
                    <Button 
                      onClick={() => form.resetFields()}
                      size="large"
                    >
                      Reset Form
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Profile Picture" style={{ height: 'fit-content' }}>
              <div style={{ textAlign: 'center' }}>
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />} 
                  src={avatarUrl}
                  style={{ marginBottom: '16px' }}
                />
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
                    <Button icon={<UploadOutlined />}>
                      Upload Picture
                    </Button>
                  </Upload>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    JPG/PNG files only, max 2MB
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Quick Tips" style={{ marginTop: '16px' }}>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li>Ensure email addresses are unique</li>
                <li>Use strong passwords (min 6 characters)</li>
                <li>Phone numbers should include country code</li>
                <li>Admin users have full system access</li>
                <li>Moderators can manage content</li>
                <li>Konsituen are regular users</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddUser;