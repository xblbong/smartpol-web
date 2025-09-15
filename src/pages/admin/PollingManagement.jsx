import React, { useState, useEffect } from "react";
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
  Progress,
} from "antd";
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
  StopOutlined,
  ThunderboltOutlined,
  FundOutlined,
  GlobalOutlined,
  LockOutlined,
  LineChartOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { pollingAPI } from '../../services/api';


const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const PollingManagement = () => {
  const [polls, setPolls] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch polls from database using pollingAPI
  const fetchPolls = async () => {
    try {
      setRefreshing(true);
      const data = await pollingAPI.getPolls();
      console.log('📊 Polls API Response:', data);
      
      // Ensure data.polls is an array before mapping
      const pollsArray = Array.isArray(data.polls) ? data.polls : [];
      const formattedPolls = pollsArray.map(poll => ({
        id: poll.id,
        title: poll.title,
        description: poll.description,
        category: poll.category,
        status: poll.status,
        startDate: poll.start_date ? new Date(poll.start_date).toISOString().split('T')[0] : null,
        endDate: poll.end_date ? new Date(poll.end_date).toISOString().split('T')[0] : null,
        totalVotes: poll.total_votes || 0,
        maxVotes: 1000, // Default value
        isPublic: true, // Default value
        createdBy: poll.created_by,
        createdDate: poll.created_at ? new Date(poll.created_at).toISOString().split('T')[0] : null,
        type: poll.type
      }));
      setPolls(formattedPolls);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ Error fetching polls:', error);
      console.log('🔍 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      message.error('Terjadi kesalahan saat mengambil data polling');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPolls();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchPolls, 30000);
    return () => clearInterval(interval);
  }, []);


  const handleAdd = () => {
    setEditingPoll(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (poll) => {
    setEditingPoll(poll);
    form.setFieldsValue({
      ...poll,
      dateRange: [moment(poll.startDate), moment(poll.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (pollId) => {
    try {
      const response = await fetch(`/api/admin/polls/${pollId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        message.success('Polling berhasil dihapus!');
        fetchPolls(); // Refresh data
      } else {
        message.error('Gagal menghapus polling');
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
      message.error('Terjadi kesalahan saat menghapus polling');
    }
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);

    try {
      const pollData = {
        title: values.title,
        description: values.description,
        category: values.category,
        status: values.status,
        start_date: values.dateRange[0].format("YYYY-MM-DD HH:mm:ss"),
        end_date: values.dateRange[1].format("YYYY-MM-DD HH:mm:ss"),
        type: 'polling'
      };

      let response;
      if (editingPoll) {
        // Update existing poll
        response = await fetch(`/api/admin/polls/${editingPoll.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pollData)
        });
      } else {
        // Create new poll
        response = await fetch('/api/polling', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pollData)
        });
      }
      
      if (response.ok) {
        message.success(editingPoll ? 'Polling berhasil diperbarui!' : 'Polling berhasil dibuat!');
        setIsModalVisible(false);
        form.resetFields();
        fetchPolls(); // Refresh data
      } else {
        message.error('Gagal menyimpan polling');
      }
    } catch (error) {
      console.error('Error saving poll:', error);
      message.error('Terjadi kesalahan saat menyimpan polling');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredPolls = polls.filter(
    (poll) =>
      (poll.title.toLowerCase().includes(searchText.toLowerCase()) ||
        poll.description.toLowerCase().includes(searchText.toLowerCase()) ||
        poll.category.toLowerCase().includes(searchText.toLowerCase())) &&
      (filterStatus ? poll.status === filterStatus : true)
  );

  const getStatusTagProps = (status) => {
    let color;
    let icon;
    let text;
    let bgColor;
    let textColor;
    let borderColor;
    switch (status) {
      case "active":
        color = "processing";
        icon = <ThunderboltOutlined />;
        text = "AKTIF";
        bgColor = "bg-blue-50";
        textColor = "text-blue-700";
        borderColor = "border-blue-200";
        break;
      case "completed":
        color = "success";
        icon = <CheckCircleOutlined />;
        text = "SELESAI";
        bgColor = "bg-green-50";
        textColor = "text-green-700";
        borderColor = "border-green-200";
        break;
      case "draft":
        color = "warning";
        icon = <ClockCircleOutlined />;
        text = "DRAFT";
        bgColor = "bg-yellow-50";
        textColor = "text-yellow-700";
        borderColor = "border-yellow-200";
        break;
      case "cancelled":
        color = "error";
        icon = <StopOutlined />;
        text = "BATAL";
        bgColor = "bg-red-50";
        textColor = "text-red-700";
        borderColor = "border-red-200";
        break;
      default:
        color = "default";
        icon = null;
        text = status;
        bgColor = "bg-gray-50";
        textColor = "text-gray-700";
        borderColor = "border-gray-200";
    }
    return { color, icon, text, bgColor, textColor, borderColor };
  };

  const columns = [
    {
      title: "Informasi Polling",
      key: "pollInfo",
      width: 300,
      render: (_, record) => (
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm sm:text-lg border border-indigo-200">
            <FundOutlined className="text-sm sm:text-base" />
          </div>
          <div className="flex-1 min-w-0">
            <Text strong className="text-sm sm:text-base text-gray-800 block truncate">
              {record.title}
            </Text>
            <Text type="secondary" className="text-xs sm:text-sm text-gray-500 block mt-1 line-clamp-2">
              {record.description.length > 50
                ? `${record.description.substring(0, 50)}...`
                : record.description}
            </Text>
            <Tag color="blue" className="mt-1 font-medium text-xs">
              {record.category}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["md"],
      render: (status) => {
        const { color, icon, text, bgColor, textColor, borderColor } =
          getStatusTagProps(status);
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}
          >
            {icon && <span className="mr-1">{icon}</span>}
            {text}
          </span>
        );
      },
    },
    {
      title: "Durasi",
      key: "duration",
      responsive: ["lg"],
      render: (_, record) => (
        <div>
          <div className="flex items-center mb-1">
            <CalendarOutlined className="mr-2 text-indigo-500" />
            <Text className="text-sm text-gray-700">
              {moment(record.startDate).format("DD MMM YYYY")}
            </Text>
          </div>
          <div className="flex items-center">
            <Text type="secondary" className="mr-2 text-sm">
              sampai
            </Text>
            <CalendarOutlined className="mr-2 text-red-500" />
            <Text className="text-sm text-gray-700">
              {moment(record.endDate).format("DD MMM YYYY")}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Progress Voting",
      key: "votes",
      responsive: ["lg"],
      render: (_, record) => (
        <div>
          <div className="flex items-center mb-2">
            <UserOutlined className="mr-2 text-green-500" />
            <Text strong className="text-base text-gray-800">
              {record.totalVotes}
            </Text>
            <Text type="secondary" className="text-sm text-gray-600">
              {" "}
              / {record.maxVotes}
            </Text>
          </div>
          <Progress
            percent={Math.round((record.totalVotes / record.maxVotes) * 100)}
            size="small"
            status={record.totalVotes >= record.maxVotes ? "success" : "active"}
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
            trailColor="#e6f7ff"
            className="w-full"
          />
        </div>
      ),
    },
    {
      title: "Visibilitas",
      dataIndex: "isPublic",
      key: "isPublic",
      responsive: ["lg"],
      render: (isPublic) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
            isPublic
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-orange-50 text-orange-700 border-orange-200"
          }`}
        >
          {isPublic ? (
            <GlobalOutlined className="mr-1" />
          ) : (
            <LockOutlined className="mr-1" />
          )}
          {isPublic ? "Publik" : "Privat"}
        </span>
      ),
    },
    {
      title: "Aksi",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => message.info("Melihat detail polling")}
            className="text-indigo-600 hover:text-indigo-800 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
            size="small"
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="bg-indigo-600 hover:bg-indigo-700 border-none"
            size="small"
          />
          <Popconfirm
            title="Hapus Polling"
            description="Apakah Anda yakin ingin menghapus polling ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="hover:bg-red-50"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pollStats = {
    total: polls.length,
    active: polls.filter((p) => p.status === "active").length,
    completed: polls.filter((p) => p.status === "completed").length,
    draft: polls.filter((p) => p.status === "draft").length,
    totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-2 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <BarChartOutlined
                  className="text-lg sm:text-xl"
                  style={{ color: "white" }}
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Manajemen Polling
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Kelola dan pantau semua polling dalam sistem
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${refreshing ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {refreshing ? 'Refreshing...' : 'Terhubung'}
                </span>
              </div>
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Update: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6 lg:mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    Total Polling
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {pollStats.total}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LineChartOutlined
                    className="text-lg sm:text-xl"
                    style={{ color: "white" }}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    Polling Aktif
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {pollStats.active}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircleOutlined
                    className="text-lg sm:text-xl"
                    style={{ color: "white" }}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    Selesai
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {pollStats.completed}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FundOutlined
                    className="text-lg sm:text-xl"
                    style={{ color: "white" }}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    Total Suara
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {pollStats.totalVotes}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserOutlined
                    className="text-lg sm:text-xl"
                    style={{ color: "white" }}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Controls */}
        <div className="mb-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Daftar Polling
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola semua polling yang tersedia dalam sistem
                </p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                size="large"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none rounded-lg shadow-md px-4 sm:px-6 py-2 h-10 sm:h-11"
              >
                <span className="hidden sm:inline">Buat Polling Baru</span>
                <span className="sm:hidden">Tambah</span>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Polling
                </label>
                <Input
                  placeholder="Cari berdasarkan judul, deskripsi, atau kategori..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  className="rounded-lg h-10 sm:h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status
                </label>
                <Select
                  placeholder="Semua status"
                  style={{ width: "100%", height: "40px" }}
                  allowClear
                  onChange={setFilterStatus}
                  className="rounded-lg [&_.ant-select-selector]:!h-10 sm:[&_.ant-select-selector]:!h-11"
                >
                  <Option value="active">Aktif</Option>
                  <Option value="completed">Selesai</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="cancelled">Dibatalkan</Option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Polls Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredPolls}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => (
                  <span className="text-xs sm:text-sm text-gray-600">
                    {range[0]}-{range[1]} dari {total} polling
                  </span>
                ),
                className: "px-2 sm:px-4 py-4",
                size: "small",
                responsive: true,
              }}
              scroll={{ x: 1000 }}
              className="[&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-gray-50 [&_.ant-table-thead>tr>th]:!border-gray-200 [&_.ant-table-tbody>tr>td]:!border-gray-200 [&_.ant-table-tbody>tr:hover>td]:!bg-gray-50 [&_.ant-table-thead>tr>th]:!text-xs [&_.ant-table-tbody>tr>td]:!text-xs sm:[&_.ant-table-thead>tr>th]:!text-sm sm:[&_.ant-table-tbody>tr>td]:!text-sm"
              bordered={false}
              size="small"
            />
          </div>
        </div>

        {/* Add/Edit Poll Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <BarChartOutlined className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingPoll ? "Edit Polling" : "Buat Polling Baru"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingPoll
                    ? "Perbarui informasi polling"
                    : "Lengkapi detail polling baru"}
                </p>
              </div>
            </div>
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={900}
          centered
          destroyOnHidden
          className="rounded-xl"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-8 space-y-6"
          >
            <Form.Item
              name="title"
              label={
                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                  Judul Polling
                </span>
              }
              rules={[
                { required: true, message: "Harap masukkan judul polling!" },
                { min: 5, message: "Judul minimal 5 karakter!" },
              ]}
            >
              <Input
                placeholder="Masukkan judul polling"
                className="rounded-lg h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                  Deskripsi
                </span>
              }
              rules={[{ required: true, message: "Harap masukkan deskripsi!" }]}
            >
              <TextArea
                rows={4}
                placeholder="Masukkan deskripsi polling"
                showCount
                maxLength={500}
                className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </Form.Item>

            <Row gutter={[24, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="category"
                  label={
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                      Kategori
                    </span>
                  }
                  rules={[{ required: true, message: "Harap pilih kategori!" }]}
                >
                  <Select
                    placeholder="Pilih kategori polling"
                    className="rounded-lg"
                    style={{ height: "48px" }}
                  >
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
                  label={
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                      Status
                    </span>
                  }
                  rules={[{ required: true, message: "Harap pilih status!" }]}
                >
                  <Select
                    placeholder="Pilih status polling"
                    className="rounded-lg"
                    style={{ height: "48px" }}
                  >
                    <Option value="draft">Draft</Option>
                    <Option value="active">Aktif</Option>
                    <Option value="completed">Selesai</Option>
                    <Option value="cancelled">Dibatalkan</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="dateRange"
                  label={
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                      Durasi Polling
                    </span>
                  }
                  rules={[
                    { required: true, message: "Harap pilih durasi polling!" },
                  ]}
                >
                  <RangePicker
                    style={{ width: "100%", height: "48px" }}
                    placeholder={["Tanggal Mulai", "Tanggal Selesai"]}
                    format="DD-MM-YYYY"
                    className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="maxVotes"
                  label={
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                      Maksimal Suara
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Harap masukkan maksimal suara!",
                    },
                    { type: "number", min: 1, message: "Harus minimal 1!" },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Masukkan maksimal suara"
                    className="rounded-lg h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 bg-gray-50 focus:bg-white transition-all duration-200"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="isPublic"
              label={
                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                  Visibilitas Polling
                </span>
              }
              valuePropName="checked"
            >
              <div className="flex items-center space-x-3">
                <Switch
                  checkedChildren={
                    <span className="text-xs font-medium">Publik</span>
                  }
                  unCheckedChildren={
                    <span className="text-xs font-medium">Privat</span>
                  }
                  className="bg-gray-300"
                />
                <span className="text-sm text-gray-600">
                  Tentukan apakah polling dapat diakses oleh publik atau hanya
                  pengguna tertentu
                </span>
              </div>
            </Form.Item>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
                className="rounded-lg px-6 py-3 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200"
                size="large"
              >
                Batal
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                className="rounded-lg px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                size="large"
              >
                {editingPoll ? "Perbarui Polling" : "Buat Polling"}
              </Button>
            </div>
          </Form>
        </Modal>
    </div>
  );
};

export default PollingManagement;