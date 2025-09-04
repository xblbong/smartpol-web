import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Typography,
  message,
  Popconfirm,
  Tooltip,
  Divider,
  Badge
} from 'antd';
import {
  SafetyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  SettingOutlined,
  LockOutlined
} from '@ant-design/icons';
import SidebarComponents from '../../components/layouts/SidebarComponents';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();

  // Mock data untuk roles
  const mockRoles = [
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access with all permissions',
      userCount: 3,
      permissions: [
        'user_management',
        'role_management',
        'polling_management',
        'policy_management',
        'report_access',
        'analytics_access',
        'system_settings'
      ],
      isSystem: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Moderator',
      description: 'Content moderation and user management',
      userCount: 5,
      permissions: [
        'user_management',
        'polling_management',
        'policy_management',
        'report_access'
      ],
      isSystem: false,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-16'
    },
    {
      id: 3,
      name: 'Konsituen',
      description: 'Regular user with basic access',
      userCount: 150,
      permissions: [
        'polling_participation',
        'policy_viewing',
        'chatbot_access'
      ],
      isSystem: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-10'
    }
  ];

  const availablePermissions = [
    { key: 'user_management', label: 'User Management', description: 'Create, edit, delete users' },
    { key: 'role_management', label: 'Role Management', description: 'Manage user roles and permissions' },
    { key: 'polling_management', label: 'Polling Management', description: 'Create and manage polls' },
    { key: 'policy_management', label: 'Policy Management', description: 'Manage policies and content' },
    { key: 'report_access', label: 'Report Access', description: 'View and generate reports' },
    { key: 'analytics_access', label: 'Analytics Access', description: 'Access analytics dashboard' },
    { key: 'system_settings', label: 'System Settings', description: 'Configure system settings' },
    { key: 'polling_participation', label: 'Polling Participation', description: 'Participate in polls' },
    { key: 'policy_viewing', label: 'Policy Viewing', description: 'View policies and content' },
    { key: 'chatbot_access', label: 'Chatbot Access', description: 'Access chatbot features' }
  ];

  useEffect(() => {
    setRoles(mockRoles);
  }, []);

  const handleAddRole = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsModalVisible(true);
  };

  const handleViewRole = (role) => {
    setSelectedRole(role);
    setIsViewModalVisible(true);
  };

  const handleDeleteRole = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      message.error('System roles cannot be deleted');
      return;
    }
    setRoles(roles.filter(role => role.id !== roleId));
    message.success('Role berhasil dihapus');
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingRole) {
        // Update existing role
        setRoles(roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...values, updatedAt: new Date().toISOString().split('T')[0] }
            : role
        ));
        message.success('Role berhasil diupdate');
      } else {
        // Add new role
        const newRole = {
          id: Date.now(),
          ...values,
          userCount: 0,
          isSystem: false,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setRoles([...roles, newRole]);
        message.success('Role berhasil ditambahkan');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Gagal menyimpan role');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionLabel = (permissionKey) => {
    const permission = availablePermissions.find(p => p.key === permissionKey);
    return permission ? permission.label : permissionKey;
  };

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <SafetyOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            {name}
            {record.isSystem && (
              <Tag color="orange" style={{ marginLeft: '8px' }}>SYSTEM</Tag>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Users',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count) => (
        <Badge count={count} style={{ backgroundColor: '#52c41a' }}>
          <UserOutlined style={{ fontSize: '16px' }} />
        </Badge>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <div>
          <Text strong>{permissions.length} permissions</Text>
          <div style={{ marginTop: '4px' }}>
            {permissions.slice(0, 3).map(permission => (
              <Tag key={permission} size="small" style={{ marginBottom: '2px' }}>
                {getPermissionLabel(permission)}
              </Tag>
            ))}
            {permissions.length > 3 && (
              <Tag size="small" color="blue">
                +{permissions.length - 3} more
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => new Date(date).toLocaleDateString('id-ID'),
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
              onClick={() => handleViewRole(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Role">
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditRole(record)}
              disabled={record.isSystem}
            />
          </Tooltip>
          <Tooltip title={record.isSystem ? "System roles cannot be deleted" : "Delete Role"}>
            <Popconfirm
              title="Are you sure you want to delete this role?"
              onConfirm={() => handleDeleteRole(record.id)}
              okText="Yes"
              cancelText="No"
              disabled={record.isSystem}
            >
              <Button
                type="default"
                size="small"
                icon={<DeleteOutlined />}
                danger
                disabled={record.isSystem}
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <SafetyOutlined className="text-2xl" style={{color: 'white'}} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manajemen Peran</h1>
              <p className="text-gray-600 mt-1">Kelola peran dan izin pengguna sistem</p>
            </div>
          </div>
          <button 
            onClick={handleAddRole}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <PlusOutlined className="text-lg" />
            <span className="font-medium">Tambah Peran Baru</span>
          </button>
        </div>

        {/* Roles Table */}
        <div className="px-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 ">
            <div className="flex items-center space-x-2">
              <SafetyOutlined className="text-lg text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Daftar Peran</h2>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} peran`,
            }}
          />
        </div>

        {/* Add/Edit Role Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafetyOutlined className="text-lg" style={{color: 'blue'}} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingRole ? 'Edit Peran' : 'Tambah Peran Baru'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingRole ? 'Perbarui informasi peran' : 'Buat peran baru dengan izin yang sesuai'}
                </p>
              </div>
            </div>
          }
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={700}
          className="custom-modal"
        >
          <div className="pt-6">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Peran *
                  </label>
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: 'Silakan masukkan nama peran!' },
                      { min: 2, message: 'Nama peran minimal 2 karakter!' }
                    ]}
                    className="mb-0"
                  >
                    <Input 
                      placeholder="Masukkan nama peran"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi *
                </label>
                <Form.Item
                  name="description"
                  rules={[{ required: true, message: 'Silakan masukkan deskripsi peran!' }]}
                  className="mb-0"
                >
                  <TextArea 
                    rows={3}
                    placeholder="Jelaskan peran dan tujuannya"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  />
                </Form.Item>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Izin Akses *
                </label>
                <Form.Item
                  name="permissions"
                  rules={[{ required: true, message: 'Silakan pilih minimal satu izin!' }]}
                  className="mb-0"
                >
                  <Checkbox.Group className="w-full">
                    <div className="grid grid-cols-2 gap-4">
                      {availablePermissions.map(permission => (
                        <div key={permission.key} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                          <Checkbox value={permission.key} className="w-full">
                            <div className="ml-2">
                              <div className="font-medium text-gray-800">{permission.label}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                {permission.description}
                              </div>
                            </div>
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>

              <div className="border-t border-gray-200 mt-8 pt-6">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalVisible(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                    <span>{editingRole ? 'Perbarui Peran' : 'Buat Peran'}</span>
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </Modal>

        {/* View Role Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <EyeOutlined className="text-lg" style={{color: 'blue'}} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Detail Peran</h3>
                <p className="text-sm text-gray-600 mt-1">Informasi lengkap tentang peran dan izinnya</p>
              </div>
            </div>
          }
          visible={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <button
              key="close"
              onClick={() => setIsViewModalVisible(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Tutup
            </button>,
          ]}
          width={600}
          className="custom-modal"
        >
          {selectedRole && (
            <div className="pt-6">
              {/* Role Header */}
              <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <SafetyOutlined className="text-2xl" style={{color: 'white'}} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedRole.name}
                  {selectedRole.isSystem && (
                    <span className="ml-3 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                      PERAN SISTEM
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">{selectedRole.description}</p>
              </div>

              {/* Role Information */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserOutlined className="text-blue-600" />
                    <span className="font-medium text-gray-700">Pengguna dengan peran ini:</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{selectedRole.userCount} pengguna</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <SettingOutlined className="text-green-600" />
                    <span className="font-medium text-gray-700">Tipe Peran:</span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {selectedRole.isSystem ? 'Peran Sistem' : 'Peran Kustom'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-700">Dibuat:</span>
                  </div>
                  <div className="text-gray-800">
                    {new Date(selectedRole.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-700">Terakhir Diperbarui:</span>
                  </div>
                  <div className="text-gray-800">
                    {new Date(selectedRole.updatedAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <LockOutlined className="text-purple-600 text-lg" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Izin Akses ({selectedRole.permissions.length})
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRole.permissions.map(permission => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <LockOutlined className="text-sm" style={{color: 'blue'}} />
                      <span className="text-gray-700 font-medium">
                        {getPermissionLabel(permission)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Roles;