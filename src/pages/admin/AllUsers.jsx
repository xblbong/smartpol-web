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
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <UserOutlined className="text-xl" style={{color: 'white'}} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Semua Pengguna</h1>
              <p className="text-gray-600 mt-1">Kelola dan pantau semua pengguna sistem</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-4 flex justify-end">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center font-medium shadow-sm">
              <PlusOutlined className="mr-2" />
              Tambah Pengguna Baru
            </button>
          </div>
          
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 items-center md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pengguna</label>
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter Peran</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                value={filterRole}
                onChange={(e) => handleRoleFilter(e.target.value)}
              >
                <option value="all">Semua Peran</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="konsituen">Konsituen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter Status</label>
              <div className="flex items-end h-full">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 mb-0"
                  value={filterStatus}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="pending">Menunggu</option>
                </select>
              </div>
            </div>
          </div>
        </div>
          

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <UserOutlined className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Daftar Pengguna</h3>
              </div>
              <div className="text-sm text-gray-500">
                Total: {filteredUsers.length} pengguna
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredUsers}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} pengguna`,
              }}
              scroll={{ x: 800 }}
              className="custom-table"
            />
          </div>
        </div>

        {/* User Detail Modal */}
        <Modal
          title={null}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
          className="custom-modal"
        >
          {selectedUser && (
            <div className="p-6">
              {/* Modal Header */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <Avatar size={80} src={selectedUser.avatar} className="border-4 border-white shadow-lg" />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                    selectedUser.status === 'active' ? 'bg-green-500' : 
                    selectedUser.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedUser.name}</h2>
                <div className="flex justify-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    selectedUser.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedUser.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedUser.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedUser.status === 'active' ? 'Aktif' : 
                     selectedUser.status === 'inactive' ? 'Tidak Aktif' : 'Menunggu'}
                  </span>
                </div>
              </div>
              
              {/* User Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Telepon</label>
                      <p className="text-gray-900 font-medium">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Bergabung</label>
                      <p className="text-gray-900 font-medium">{new Date(selectedUser.joinDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Login Terakhir</label>
                      <p className="text-gray-900 font-medium">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('id-ID') : 'Never'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setIsModalVisible(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Tutup
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Edit Pengguna
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AllUsers;