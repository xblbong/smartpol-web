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
  Progress
} from 'antd';
import {
  BarChartOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const PollingManagement = () => {
  const [polls, setPolls] = useState([
    {
      id: 1,
      title: 'Pemilihan Ketua RT 2024',
      description: 'Pemilihan ketua RT untuk periode 2024-2026',
      category: 'Pemilihan',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      totalVotes: 245,
      maxVotes: 500,
      isPublic: true,
      createdBy: 'Admin',
      createdDate: '2024-01-10'
    },
    {
      id: 2,
      title: 'Survey Kepuasan Pelayanan Publik',
      description: 'Survey untuk mengevaluasi kepuasan masyarakat terhadap pelayanan publik',
      category: 'Survey',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      totalVotes: 1250,
      maxVotes: 1000,
      isPublic: true,
      createdBy: 'Admin',
      createdDate: '2023-12-25'
    },
    {
      id: 3,
      title: 'Polling Anggaran Daerah 2024',
      description: 'Polling untuk menentukan prioritas anggaran daerah tahun 2024',
      category: 'Anggaran',
      status: 'draft',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      totalVotes: 0,
      maxVotes: 2000,
      isPublic: false,
      createdBy: 'Admin',
      createdDate: '2024-01-20'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setEditingPoll(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (poll) => {
    setEditingPoll(poll);
    form.setFieldsValue({
      ...poll,
      dateRange: [new Date(poll.startDate), new Date(poll.endDate)]
    });
    setIsModalVisible(true);
  };

  const handleDelete = (pollId) => {
    setPolls(polls.filter(poll => poll.id !== pollId));
    message.success('Poll deleted successfully');
  };

  const handleSubmit = (values) => {
    setLoading(true);
    
    setTimeout(() => {
      const pollData = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
      };
      delete pollData.dateRange;

      if (editingPoll) {
        // Update existing poll
        setPolls(polls.map(poll => 
          poll.id === editingPoll.id 
            ? { ...poll, ...pollData }
            : poll
        ));
        message.success('Poll updated successfully');
      } else {
        // Add new poll
        const newPoll = {
          id: Date.now(),
          ...pollData,
          totalVotes: 0,
          createdBy: 'Admin',
          createdDate: new Date().toISOString().split('T')[0]
        };
        setPolls([...polls, newPoll]);
        message.success('Poll created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const filteredPolls = polls.filter(poll =>
    poll.title.toLowerCase().includes(searchText.toLowerCase()) ||
    poll.description.toLowerCase().includes(searchText.toLowerCase()) ||
    poll.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'draft': return 'orange';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleOutlined />;
      case 'completed': return <CheckCircleOutlined />;
      case 'draft': return <ClockCircleOutlined />;
      case 'cancelled': return <StopOutlined />;
      default: return null;
    }
  };

  const columns = [
    {
      title: 'Poll Information',
      key: 'pollInfo',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: '14px', color: '#001529' }}>
            {record.title}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description.length > 50 
              ? `${record.description.substring(0, 50)}...` 
              : record.description
            }
          </Text>
          <br />
          <Tag color="blue" style={{ marginTop: '4px' }}>
            {record.category}
          </Tag>
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
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <Text style={{ fontSize: '12px' }}>
              {new Date(record.startDate).toLocaleDateString('id-ID')}
            </Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>to</Text>
          </div>
          <div>
            <CalendarOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
            <Text style={{ fontSize: '12px' }}>
              {new Date(record.endDate).toLocaleDateString('id-ID')}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Votes Progress',
      key: 'votes',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '8px' }}>
            <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
            <Text strong>{record.totalVotes}</Text>
            <Text type="secondary"> / {record.maxVotes}</Text>
          </div>
          <Progress 
            percent={Math.round((record.totalVotes / record.maxVotes) * 100)}
            size="small"
            status={record.totalVotes >= record.maxVotes ? 'success' : 'active'}
          />
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => message.info('View poll details')}
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
            title="Delete Poll"
            description="Are you sure you want to delete this poll?"
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

  const pollStats = {
    total: polls.length,
    active: polls.filter(p => p.status === 'active').length,
    completed: polls.filter(p => p.status === 'completed').length,
    draft: polls.filter(p => p.status === 'draft').length,
    totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0)
  };

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <Title level={2} style={{ marginBottom: '24px', color: '#001529' }}>
          📊 Polling Management
        </Title>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Polls"
              value={pollStats.total}
              prefix={<BarChartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Active Polls"
              value={pollStats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Completed"
              value={pollStats.completed}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Votes"
              value={pollStats.totalVotes}
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
              placeholder="Search polls..."
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
              <Option value="completed">Completed</Option>
              <Option value="draft">Draft</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
            >
              Create New Poll
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Polls Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPolls}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} polls`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit Poll Modal */}
      <Modal
        title={
          <Space>
            <BarChartOutlined />
            {editingPoll ? 'Edit Poll' : 'Create New Poll'}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="title"
            label="Poll Title"
            rules={[
              { required: true, message: 'Please input poll title!' },
              { min: 5, message: 'Title must be at least 5 characters!' }
            ]}
          >
            <Input placeholder="Enter poll title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter poll description"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category!' }]}
              >
                <Select placeholder="Select poll category">
                  <Option value="Pemilihan">Pemilihan</Option>
                  <Option value="Survey">Survey</Option>
                  <Option value="Anggaran">Anggaran</Option>
                  <Option value="Kebijakan">Kebijakan</Option>
                  <Option value="Infrastruktur">Infrastruktur</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select placeholder="Select poll status">
                  <Option value="draft">Draft</Option>
                  <Option value="active">Active</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dateRange"
                label="Poll Duration"
                rules={[{ required: true, message: 'Please select poll duration!' }]}
              >
                <RangePicker 
                  style={{ width: '100%' }}
                  placeholder={['Start Date', 'End Date']}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="maxVotes"
                label="Maximum Votes"
                rules={[
                  { required: true, message: 'Please input maximum votes!' },
                  { type: 'number', min: 1, message: 'Must be at least 1!' }
                ]}
              >
                <Input type="number" placeholder="Enter maximum votes" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isPublic"
            label="Poll Visibility"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Public" 
              unCheckedChildren="Private" 
            />
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
                {editingPoll ? 'Update Poll' : 'Create Poll'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </div>
  );
};

export default PollingManagement;