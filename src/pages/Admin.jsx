import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Tabs, 
  Space, 
  Popconfirm,
  Tag,
  DatePicker,
  Switch,
  Statistic,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import AppSidebar from '../components/layouts/AppSidebar';
import { authAPI, pollingAPI, policiesAPI, adminAPI } from '../services/api';
import dayjs from 'dayjs';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States for different entities
  const [users, setUsers] = useState([]);
  const [polls, setPolls] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportStats, setReportStats] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [pollModalVisible, setPollModalVisible] = useState(false);
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Forms
  const [userForm] = Form.useForm();
  const [pollForm] = Form.useForm();
  const [policyForm] = Form.useForm();
  const [reportForm] = Form.useForm();

  useEffect(() => {
    fetchUserData();
    fetchUsers();
    fetchPolls();
    fetchPolicies();
    fetchReports();
    fetchReportStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
      
      // Check if user is admin
      if (response.data.role !== 'admin') {
        message.error('Access denied. Admin privileges required.');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      window.location.href = '/login';
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await pollingAPI.getPolls();
      setPolls(response.polls);
    } catch (error) {
      console.error('Error fetching polls:', error);
      message.error('Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await policiesAPI.getPolicies();
      setPolicies(response.policies);
    } catch (error) {
      console.error('Error fetching policies:', error);
      message.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setReports(data.reports);
      } else {
        message.error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      message.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportStats = async () => {
    try {
      const response = await fetch('/api/reports/stats', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setReportStats(data);
      }
    } catch (error) {
      console.error('Error fetching report stats:', error);
    }
  };

  // User CRUD operations
  const handleCreateUser = async (values) => {
    try {
      await adminAPI.createUser(values);
      message.success('User created successfully');
      setUserModalVisible(false);
      userForm.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (values) => {
    try {
      await adminAPI.updateUser(editingItem.id, values);
      message.success('User updated successfully');
      setUserModalVisible(false);
      userForm.resetFields();
      setEditingItem(null);
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  // Poll CRUD operations
  const handleCreatePoll = async (values) => {
    try {
      const pollData = {
        ...values,
        end_date: values.end_date.format('YYYY-MM-DD HH:mm:ss')
      };
      await pollingAPI.createPoll(pollData);
      message.success('Poll created successfully');
      setPollModalVisible(false);
      pollForm.resetFields();
      fetchPolls();
    } catch (error) {
      message.error('Failed to create poll');
    }
  };

  const handleUpdatePoll = async (values) => {
    try {
      const pollData = {
        ...values,
        end_date: values.end_date.format('YYYY-MM-DD HH:mm:ss')
      };
      await adminAPI.updatePoll(editingItem.id, pollData);
      message.success('Poll updated successfully');
      setPollModalVisible(false);
      pollForm.resetFields();
      setEditingItem(null);
      fetchPolls();
    } catch (error) {
      message.error('Failed to update poll');
    }
  };

  const handleDeletePoll = async (pollId) => {
    try {
      await adminAPI.deletePoll(pollId);
      message.success('Poll deleted successfully');
      fetchPolls();
    } catch (error) {
      message.error('Failed to delete poll');
    }
  };

  // Policy CRUD operations
  const handleCreatePolicy = async (values) => {
    try {
      await policiesAPI.createPolicy(values);
      message.success('Policy created successfully');
      setPolicyModalVisible(false);
      policyForm.resetFields();
      fetchPolicies();
    } catch (error) {
      message.error('Failed to create policy');
    }
  };

  const handleUpdatePolicy = async (values) => {
    try {
      await adminAPI.updatePolicy(editingItem.id, values);
      message.success('Policy updated successfully');
      setPolicyModalVisible(false);
      policyForm.resetFields();
      setEditingItem(null);
      fetchPolicies();
    } catch (error) {
      message.error('Failed to update policy');
    }
  };

  const handleDeletePolicy = async (policyId) => {
    try {
      await adminAPI.deletePolicy(policyId);
      message.success('Policy deleted successfully');
      fetchPolicies();
    } catch (error) {
      message.error('Failed to delete policy');
    }
  };

  // Report CRUD operations
  const handleUpdateReport = async (values) => {
    try {
      const response = await fetch(`/api/reports/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        message.success('Report updated successfully');
        setReportModalVisible(false);
        reportForm.resetFields();
        setEditingItem(null);
        fetchReports();
      } else {
        message.error('Failed to update report');
      }
    } catch (error) {
      message.error('Failed to update report');
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        message.success('Report deleted successfully');
        fetchReports();
      } else {
        message.error('Failed to delete report');
      }
    } catch (error) {
      message.error('Failed to delete report');
    }
  };

  // Table columns
  const userColumns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'NIK Verified',
      dataIndex: 'nik_verified',
      key: 'nik_verified',
      render: (verified) => (
        <Tag color={verified ? 'green' : 'orange'}>
          {verified ? 'Verified' : 'Not Verified'}
        </Tag>
      ),
    },
    {
      title: 'Dapil',
      dataIndex: 'dapil',
      key: 'dapil',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              userForm.setFieldsValue(record);
              setUserModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pollColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Total Votes',
      key: 'total_votes',
      render: (_, record) => {
        const totalVotes = record.options?.reduce((sum, option) => sum + (option.vote_count || 0), 0) || 0;
        return totalVotes;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              pollForm.setFieldsValue({
                ...record,
                end_date: dayjs(record.end_date)
              });
              setPollModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this poll?"
            onConfirm={() => handleDeletePoll(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const policyColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          'draft': 'orange',
          'active': 'green',
          'archived': 'gray'
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              policyForm.setFieldsValue(record);
              setPolicyModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this policy?"
            onConfirm={() => handleDeletePolicy(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const reportColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'User',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          'pending': 'orange',
          'in_progress': 'blue',
          'resolved': 'green'
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const colors = {
          'low': 'green',
          'medium': 'orange',
          'high': 'red'
        };
        return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              reportForm.setFieldsValue({
                status: record.status,
                priority: record.priority,
                admin_notes: record.admin_notes
              });
              setReportModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this report?"
            onConfirm={() => handleDeleteReport(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderDashboard = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={users.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Polls"
              value={polls.filter(poll => poll.status === 'active').length}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Policies"
              value={policies.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Verified Users"
              value={users.filter(user => user.nik_verified).length}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Report Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Reports"
              value={reportStats.total_reports || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Reports"
              value={reportStats.pending_reports || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={reportStats.in_progress_reports || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Resolved Reports"
              value={reportStats.resolved_reports || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <AppSidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen}
        user={user}
      />
      
      <Layout className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="w-9"></div>
        </div>
        
        <Content className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 hidden md:block">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, polls, and policies</p>
            </div>

            <Card>
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Dashboard" key="dashboard">
                  {renderDashboard()}
                </TabPane>
                
                <TabPane tab="Users" key="users">
                  <div className="mb-4">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingItem(null);
                        userForm.resetFields();
                        setUserModalVisible(true);
                      }}
                    >
                      Add User
                    </Button>
                  </div>
                  <Table
                    columns={userColumns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                  />
                </TabPane>
                
                <TabPane tab="Polls" key="polls">
                  <div className="mb-4">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingItem(null);
                        pollForm.resetFields();
                        setPollModalVisible(true);
                      }}
                    >
                      Add Poll
                    </Button>
                  </div>
                  <Table
                    columns={pollColumns}
                    dataSource={polls}
                    rowKey="id"
                    loading={loading}
                  />
                </TabPane>
                
                <TabPane tab="Policies" key="policies">
                  <div className="mb-4">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingItem(null);
                        policyForm.resetFields();
                        setPolicyModalVisible(true);
                      }}
                    >
                      Add Policy
                    </Button>
                  </div>
                  <Table
                    columns={policyColumns}
                    dataSource={policies}
                    rowKey="id"
                    loading={loading}
                  />
                </TabPane>
                
                <TabPane tab="Reports" key="reports">
                  <Table
                    columns={reportColumns}
                    dataSource={reports}
                    rowKey="id"
                    loading={loading}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div style={{ margin: 0 }}>
                          <p><strong>Description:</strong> {record.description}</p>
                          {record.admin_notes && (
                            <p><strong>Admin Notes:</strong> {record.admin_notes}</p>
                          )}
                          {record.resolver_name && (
                            <p><strong>Resolved by:</strong> {record.resolver_name}</p>
                          )}
                          {record.resolved_at && (
                            <p><strong>Resolved at:</strong> {dayjs(record.resolved_at).format('DD/MM/YYYY HH:mm')}</p>
                          )}
                        </div>
                      ),
                    }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </Content>
      </Layout>

      {/* User Modal */}
      <Modal
        title={editingItem ? 'Edit User' : 'Add User'}
        open={userModalVisible}
        onCancel={() => {
          setUserModalVisible(false);
          userForm.resetFields();
          setEditingItem(null);
        }}
        footer={null}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={editingItem ? handleUpdateUser : handleCreateUser}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please input valid email!' }]}
          >
            <Input />
          </Form.Item>
          {!editingItem && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input password!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select>
              <Option value="konsituen">Konsituen</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setUserModalVisible(false);
                userForm.resetFields();
                setEditingItem(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Poll Modal */}
      <Modal
        title={editingItem ? 'Edit Poll' : 'Add Poll'}
        open={pollModalVisible}
        onCancel={() => {
          setPollModalVisible(false);
          pollForm.resetFields();
          setEditingItem(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={pollForm}
          layout="vertical"
          onFinish={editingItem ? handleUpdatePoll : handleCreatePoll}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: 'Please select end date!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setPollModalVisible(false);
                pollForm.resetFields();
                setEditingItem(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Policy Modal */}
      <Modal
        title={editingItem ? 'Edit Policy' : 'Add Policy'}
        open={policyModalVisible}
        onCancel={() => {
          setPolicyModalVisible(false);
          policyForm.resetFields();
          setEditingItem(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={policyForm}
          layout="vertical"
          onFinish={editingItem ? handleUpdatePolicy : handleCreatePolicy}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please input content!' }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please input category!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="active">Active</Option>
              <Option value="archived">Archived</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setPolicyModalVisible(false);
                policyForm.resetFields();
                setEditingItem(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Report Modal */}
      <Modal
        title="Edit Report"
        open={reportModalVisible}
        onCancel={() => {
          setReportModalVisible(false);
          reportForm.resetFields();
          setEditingItem(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={reportForm}
          layout="vertical"
          onFinish={handleUpdateReport}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select priority!' }]}
          >
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="admin_notes"
            label="Admin Notes"
          >
            <TextArea rows={4} placeholder="Add notes about this report..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Report
              </Button>
              <Button onClick={() => {
                setReportModalVisible(false);
                reportForm.resetFields();
                setEditingItem(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Admin;