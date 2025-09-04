import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Typography, 
  Card, 
  Tag, 
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  DatePicker,
  Switch,
  Upload,
  Divider
} from 'antd';
import {
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  UploadOutlined,
  BookOutlined,
  SafetyOutlined,
  BankOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PoliciesManagement = () => {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      title: 'Peraturan Daerah tentang Pengelolaan Sampah',
      description: 'Peraturan yang mengatur pengelolaan sampah di wilayah daerah',
      content: 'Isi lengkap peraturan daerah tentang pengelolaan sampah...',
      category: 'Lingkungan',
      status: 'active',
      priority: 'high',
      effectiveDate: '2024-01-01',
      expiryDate: '2026-12-31',
      createdBy: 'Admin',
      createdDate: '2023-12-15',
      lastModified: '2024-01-10',
      attachments: ['perda_sampah.pdf'],
      isPublic: true
    },
    {
      id: 2,
      title: 'Kebijakan Anggaran Pendidikan 2024',
      description: 'Kebijakan alokasi anggaran untuk sektor pendidikan tahun 2024',
      content: 'Detail kebijakan anggaran pendidikan...',
      category: 'Pendidikan',
      status: 'draft',
      priority: 'medium',
      effectiveDate: '2024-03-01',
      expiryDate: '2024-12-31',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      lastModified: '2024-01-20',
      attachments: [],
      isPublic: false
    },
    {
      id: 3,
      title: 'Peraturan Keamanan dan Ketertiban Umum',
      description: 'Peraturan yang mengatur keamanan dan ketertiban di ruang publik',
      content: 'Isi peraturan keamanan dan ketertiban umum...',
      category: 'Keamanan',
      status: 'review',
      priority: 'high',
      effectiveDate: '2024-02-01',
      expiryDate: '2025-01-31',
      createdBy: 'Admin',
      createdDate: '2024-01-05',
      lastModified: '2024-01-18',
      attachments: ['peraturan_kamtibmas.pdf', 'lampiran_sanksi.pdf'],
      isPublic: true
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setEditingPolicy(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    form.setFieldsValue({
      ...policy,
      effectiveDate: new Date(policy.effectiveDate),
      expiryDate: new Date(policy.expiryDate)
    });
    setIsModalVisible(true);
  };

  const handleDelete = (policyId) => {
    setPolicies(policies.filter(policy => policy.id !== policyId));
    message.success('Policy deleted successfully');
  };

  const handleSubmit = (values) => {
    setLoading(true);
    
    setTimeout(() => {
      const policyData = {
        ...values,
        effectiveDate: values.effectiveDate.format('YYYY-MM-DD'),
        expiryDate: values.expiryDate.format('YYYY-MM-DD'),
        attachments: values.attachments || []
      };

      if (editingPolicy) {
        // Update existing policy
        setPolicies(policies.map(policy => 
          policy.id === editingPolicy.id 
            ? { ...policy, ...policyData, lastModified: new Date().toISOString().split('T')[0] }
            : policy
        ));
        message.success('Policy updated successfully');
      } else {
        // Add new policy
        const newPolicy = {
          id: Date.now(),
          ...policyData,
          createdBy: 'Admin',
          createdDate: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0]
        };
        setPolicies([...policies, newPolicy]);
        message.success('Policy created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchText.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchText.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'draft': return 'orange';
      case 'review': return 'blue';
      case 'archived': return 'gray';
      case 'expired': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleOutlined />;
      case 'draft': return <ClockCircleOutlined />;
      case 'review': return <EyeOutlined />;
      case 'archived': return <StopOutlined />;
      case 'expired': return <StopOutlined />;
      default: return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Lingkungan': return <EnvironmentOutlined />;
      case 'Pendidikan': return <BookOutlined />;
      case 'Keamanan': return <SafetyOutlined />;
      case 'Ekonomi': return <BankOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const columns = [
    {
      title: 'Policy Information',
      key: 'policyInfo',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: '14px', color: '#001529' }}>
            {record.title}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description.length > 60 
              ? `${record.description.substring(0, 60)}...` 
              : record.description
            }
          </Text>
          <br />
          <Space style={{ marginTop: '4px' }}>
            <Tag color="blue" icon={getCategoryIcon(record.category)}>
              {record.category}
            </Tag>
            <Tag color={getPriorityColor(record.priority)}>
              {record.priority.toUpperCase()}
            </Tag>
          </Space>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Effective Period',
      key: 'effectivePeriod',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <CalendarOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
            <Text style={{ fontSize: '12px' }}>
              {new Date(record.effectiveDate).toLocaleDateString('id-ID')}
            </Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>to</Text>
          </div>
          <div>
            <CalendarOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
            <Text style={{ fontSize: '12px' }}>
              {new Date(record.expiryDate).toLocaleDateString('id-ID')}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Attachments',
      dataIndex: 'attachments',
      key: 'attachments',
      render: (attachments) => (
        <div>
          <Text strong>{attachments.length}</Text>
          <Text type="secondary"> files</Text>
          {attachments.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              {attachments.slice(0, 2).map((file, index) => (
                <Tag key={index} size="small">
                  {file.length > 15 ? `${file.substring(0, 15)}...` : file}
                </Tag>
              ))}
              {attachments.length > 2 && (
                <Tag size="small">+{attachments.length - 2} more</Tag>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Visibility',
      dataIndex: 'isPublic',
      key: 'isPublic',
      render: (isPublic) => (
        <Tag color={isPublic ? 'green' : 'orange'}>
          {isPublic ? 'Public' : 'Private'}
        </Tag>
      ),
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      key: 'lastModified',
      render: (date) => (
        <Text style={{ fontSize: '12px' }}>
          {new Date(date).toLocaleDateString('id-ID')}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => message.info('View policy details')}
          >
            View
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Policy"
            description="Are you sure you want to delete this policy?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const policyStats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    draft: policies.filter(p => p.status === 'draft').length,
    review: policies.filter(p => p.status === 'review').length,
    public: policies.filter(p => p.isPublic).length
  };

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <Title level={2} style={{ marginBottom: '24px', color: '#001529' }}>
          📋 Policies Management
        </Title>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Policies"
              value={policyStats.total}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Active Policies"
              value={policyStats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="In Review"
              value={policyStats.review}
              prefix={<EyeOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Public Policies"
              value={policyStats.public}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Controls */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search policies..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="active">Active</Option>
              <Option value="draft">Draft</Option>
              <Option value="review">In Review</Option>
              <Option value="archived">Archived</Option>
              <Option value="expired">Expired</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
            >
              Create New Policy
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Policies Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPolicies}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} policies`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Policy Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="title"
            label="Policy Title"
            rules={[
              { required: true, message: 'Please input policy title!' },
              { min: 10, message: 'Title must be at least 10 characters!' }
            ]}
          >
            <Input placeholder="Enter policy title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Enter policy description"
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Policy Content"
            rules={[{ required: true, message: 'Please input policy content!' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Enter detailed policy content"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category!' }]}
              >
                <Select placeholder="Select category">
                  <Option value="Lingkungan">Lingkungan</Option>
                  <Option value="Pendidikan">Pendidikan</Option>
                  <Option value="Keamanan">Keamanan</Option>
                  <Option value="Ekonomi">Ekonomi</Option>
                  <Option value="Kesehatan">Kesehatan</Option>
                  <Option value="Infrastruktur">Infrastruktur</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select placeholder="Select status">
                  <Option value="draft">Draft</Option>
                  <Option value="review">In Review</Option>
                  <Option value="active">Active</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority!' }]}
              >
                <Select placeholder="Select priority">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="effectiveDate"
                label="Effective Date"
                rules={[{ required: true, message: 'Please select effective date!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="Select effective date"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="expiryDate"
                label="Expiry Date"
                rules={[{ required: true, message: 'Please select expiry date!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="Select expiry date"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isPublic"
            label="Policy Visibility"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Public" 
              unCheckedChildren="Private" 
            />
          </Form.Item>

          <Divider />

          <Form.Item
            name="attachments"
            label="Attachments"
          >
            <Upload
              multiple
              beforeUpload={() => false}
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button icon={<UploadOutlined />}>Upload Files</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingPolicy ? 'Update Policy' : 'Create Policy'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </div>
  );
};

export default PoliciesManagement;