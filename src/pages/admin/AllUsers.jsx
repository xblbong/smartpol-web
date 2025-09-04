import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Avatar,
  Tooltip,
  Modal,
  message,
  Popconfirm
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  FilterOutlined,
  PlusOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';

const { Title } = Typography;
const { Option } = Select;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data untuk users
  const mockUsers = [
    {
      id: 1,
      name: 'Ahmad Wijaya',
      email: 'ahmad.wijaya@email.com',
      phone: '081234567890',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20 10:30',
      avatar: null
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      phone: '081234567891',
      role: 'konsituen',
      status: 'active',
      joinDate: '2024-01-16',
      lastLogin: '2024-01-20 09:15',
      avatar: null
    },
    {
      id: 3,
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '081234567892',
      role: 'konsituen',
      status: 'inactive',
      joinDate: '2024-01-17',
      lastLogin: '2024-01-18 14:20',
      avatar: null
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      email: 'dewi.lestari@email.com',
      phone: '081234567893',
      role: 'moderator',
      status: 'active',
      joinDate: '2024-01-18',
      lastLogin: '2024-01-20 11:45',
      avatar: null
    },
    {
      id: 5,
      name: 'Eko Prasetyo',
      email: 'eko.prasetyo@email.com',
      phone: '081234567894',
      role: 'konsituen',
      status: 'pending',
      joinDate: '2024-01-19',
      lastLogin: null,
      avatar: null
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleRoleFilter = (value) => {
    setFilterRole(value);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    message.info(`Edit user: ${user.name}`);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    message.success('User berhasil dihapus');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'moderator': return 'orange';
      case 'konsituen': return 'blue';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            src={record.avatar}
            style={{ marginRight: '12px' }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <MailOutlined style={{ marginRight: '4px' }} />
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <div>
          <PhoneOutlined style={{ marginRight: '4px' }} />
          {phone}
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin) => lastLogin ? new Date(lastLogin).toLocaleString('id-ID') : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="default"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <SidebarComponents />
      <div className="flex-1 p-6 overflow-auto">
        <Title level={2} style={{ marginBottom: '24px', color: '#001529' }}>
          👥 All Users
        </Title>

        {/* Filters and Search */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Filter by Role"
                value={filterRole}
                onChange={handleRoleFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">All Roles</Option>
                <Option value="admin">Admin</Option>
                <Option value="moderator">Moderator</Option>
                <Option value="konsituen">Konsituen</Option>
              </Select>
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Filter by Status"
                value={filterStatus}
                onChange={handleStatusFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />}>
                Add New User
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Users Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {/* User Detail Modal */}
        <Modal
          title="User Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {selectedUser && (
            <div>
              <Row gutter={[16, 16]}>
                <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Avatar size={80} icon={<UserOutlined />} src={selectedUser.avatar} />
                  <Title level={4} style={{ marginTop: '10px', marginBottom: '5px' }}>
                    {selectedUser.name}
                  </Title>
                  <Tag color={getRoleColor(selectedUser.role)}>
                    {selectedUser.role.toUpperCase()}
                  </Tag>
                  <Tag color={getStatusColor(selectedUser.status)}>
                    {selectedUser.status.toUpperCase()}
                  </Tag>
                </Col>
                <Col span={12}>
                  <strong>Email:</strong>
                  <div>{selectedUser.email}</div>
                </Col>
                <Col span={12}>
                  <strong>Phone:</strong>
                  <div>{selectedUser.phone}</div>
                </Col>
                <Col span={12}>
                  <strong>Join Date:</strong>
                  <div>{new Date(selectedUser.joinDate).toLocaleDateString('id-ID')}</div>
                </Col>
                <Col span={12}>
                  <strong>Last Login:</strong>
                  <div>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('id-ID') : 'Never'}</div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AllUsers;