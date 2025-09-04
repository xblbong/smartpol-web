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
      <div className="flex-1 p-6 overflow-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#001529' }}>
            🔐 Role Management
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddRole}
          >
            Add New Role
          </Button>
        </div>

        {/* Roles Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} roles`,
            }}
          />
        </Card>

        {/* Add/Edit Role Modal */}
        <Modal
          title={editingRole ? 'Edit Role' : 'Add New Role'}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Role Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter role name!' },
                    { min: 2, message: 'Role name must be at least 2 characters!' }
                  ]}
                >
                  <Input placeholder="Enter role name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <div style={{ paddingTop: '30px' }}>
                  <Text type="secondary">Role names should be descriptive and unique</Text>
                </div>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'Please enter role description!' }]}
                >
                  <TextArea 
                    rows={3}
                    placeholder="Describe the role and its purpose"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Permissions"
                  name="permissions"
                  rules={[{ required: true, message: 'Please select at least one permission!' }]}
                >
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row gutter={[16, 16]}>
                      {availablePermissions.map(permission => (
                        <Col span={12} key={permission.key}>
                          <Checkbox value={permission.key}>
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{permission.label}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {permission.description}
                              </div>
                            </div>
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingRole ? 'Update Role' : 'Create Role'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Role Modal */}
        <Modal
          title="Role Details"
          visible={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {selectedRole && (
            <div>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    <Title level={3} style={{ marginTop: '10px', marginBottom: '5px' }}>
                      {selectedRole.name}
                      {selectedRole.isSystem && (
                        <Tag color="orange" style={{ marginLeft: '8px' }}>SYSTEM ROLE</Tag>
                      )}
                    </Title>
                    <Text type="secondary">{selectedRole.description}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <strong>Users with this role:</strong>
                  <div>{selectedRole.userCount} users</div>
                </Col>
                <Col span={12}>
                  <strong>Created:</strong>
                  <div>{new Date(selectedRole.createdAt).toLocaleDateString('id-ID')}</div>
                </Col>
                <Col span={12}>
                  <strong>Last Updated:</strong>
                  <div>{new Date(selectedRole.updatedAt).toLocaleDateString('id-ID')}</div>
                </Col>
                <Col span={12}>
                  <strong>Role Type:</strong>
                  <div>{selectedRole.isSystem ? 'System Role' : 'Custom Role'}</div>
                </Col>
                <Col span={24}>
                  <strong>Permissions ({selectedRole.permissions.length}):</strong>
                  <div style={{ marginTop: '8px' }}>
                    {selectedRole.permissions.map(permission => (
                      <Tag key={permission} style={{ marginBottom: '4px' }}>
                        <LockOutlined style={{ marginRight: '4px' }} />
                        {getPermissionLabel(permission)}
                      </Tag>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Roles;