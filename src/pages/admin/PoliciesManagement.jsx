import React, { useState } from "react";
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
  Divider,
} from "antd";
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
  EnvironmentOutlined,
  BarChartOutlined,
  ContainerOutlined,
  QuestionCircleOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PoliciesManagement = () => {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      title: "Peraturan Daerah tentang Pengelolaan Sampah",
      description:
        "Peraturan yang mengatur pengelolaan sampah di wilayah daerah untuk menjaga kebersihan dan kesehatan lingkungan.",
      content:
        "Isi lengkap peraturan daerah tentang pengelolaan sampah, termasuk sanksi dan tata cara pembuangan yang benar...",
      category: "Lingkungan",
      status: "active",
      priority: "high",
      effectiveDate: "2024-01-01",
      expiryDate: "2026-12-31",
      createdBy: "Admin",
      createdDate: "2023-12-15",
      lastModified: "2024-01-10",
      attachments: ["perda_sampah.pdf", "sosialisasi_sampah.pptx"],
      isPublic: true,
    },
    {
      id: 2,
      title: "Kebijakan Anggaran Pendidikan 2024",
      description:
        "Kebijakan alokasi anggaran untuk sektor pendidikan tahun 2024, berfokus pada pemerataan kualitas pendidikan.",
      content:
        "Detail kebijakan anggaran pendidikan, termasuk pos-pos anggaran untuk beasiswa, infrastruktur, dan pelatihan guru...",
      category: "Pendidikan",
      status: "draft",
      priority: "medium",
      effectiveDate: "2024-03-01",
      expiryDate: "2024-12-31",
      createdBy: "Admin",
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      attachments: [],
      isPublic: false,
    },
    {
      id: 3,
      title: "Peraturan Keamanan dan Ketertiban Umum",
      description:
        "Peraturan yang mengatur keamanan dan ketertiban di ruang publik untuk menciptakan lingkungan yang aman dan nyaman.",
      content:
        "Isi peraturan keamanan dan ketertiban umum, mencakup larangan, sanksi, dan tanggung jawab warga negara...",
      category: "Keamanan",
      status: "review",
      priority: "high",
      effectiveDate: "2024-02-01",
      expiryDate: "2025-01-31",
      createdBy: "Admin",
      createdDate: "2024-01-05",
      lastModified: "2024-01-18",
      attachments: ["peraturan_kamtibmas.pdf", "lampiran_sanksi.pdf"],
      isPublic: true,
    },
    {
      id: 4,
      title: "Standar Pelayanan Publik",
      description:
        "Pedoman untuk memastikan kualitas pelayanan publik yang prima dan merata bagi seluruh masyarakat.",
      content:
        "Rincian standar pelayanan publik, mulai dari waktu pelayanan, persyaratan, hingga mekanisme pengaduan...",
      category: "Umum",
      status: "active",
      priority: "medium",
      effectiveDate: "2023-07-01",
      expiryDate: "2025-06-30",
      createdBy: "Staff",
      createdDate: "2023-06-20",
      lastModified: "2024-02-01",
      attachments: ["sop_pelayanan.pdf"],
      isPublic: true,
    },
    {
      id: 5,
      title: "Kebijakan Pembangunan Infrastruktur",
      description:
        "Arah kebijakan pembangunan infrastruktur daerah untuk mendukung pertumbuhan ekonomi dan konektivitas.",
      content:
        "Penjelasan lengkap mengenai proyek-proyek infrastruktur prioritas, alokasi dana, dan jadwal pelaksanaan...",
      category: "Infrastruktur",
      status: "draft",
      priority: "high",
      effectiveDate: "2024-04-01",
      expiryDate: "2027-03-31",
      createdBy: "Kepala Dinas",
      createdDate: "2024-02-10",
      lastModified: "2024-02-28",
      attachments: [],
      isPublic: false,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
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
      effectiveDate: moment(policy.effectiveDate),
      expiryDate: moment(policy.expiryDate),
      attachments: policy.attachments
        ? policy.attachments.map((name) => ({
            uid: name,
            name: name,
            status: "done",
            url: `/uploads/${name}`,
          }))
        : [],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (policyId) => {
    setPolicies(policies.filter((policy) => policy.id !== policyId));
    message.success("Policy deleted successfully");
  };

  const handleSubmit = (values) => {
    setLoading(true);

    setTimeout(() => {
      const policyData = {
        ...values,
        effectiveDate: values.effectiveDate.format("YYYY-MM-DD"),
        expiryDate: values.expiryDate.format("YYYY-MM-DD"),
        attachments: values.attachments
          ? values.attachments.fileList.map((f) => f.name)
          : [],
      };

      if (editingPolicy) {
        setPolicies(
          policies.map((policy) =>
            policy.id === editingPolicy.id
              ? {
                  ...policy,
                  ...policyData,
                  lastModified: moment().format("YYYY-MM-DD"),
                }
              : policy
          )
        );
        message.success("Policy updated successfully");
      } else {
        const newPolicy = {
          id: Date.now(),
          ...policyData,
          createdBy: "Admin",
          createdDate: moment().format("YYYY-MM-DD"),
          lastModified: moment().format("YYYY-MM-DD"),
        };
        setPolicies([...policies, newPolicy]);
        message.success("Policy created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const filteredPolicies = policies.filter(
    (policy) =>
      (policy.title.toLowerCase().includes(searchText.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchText.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchText.toLowerCase())) &&
      (filterStatus ? policy.status === filterStatus : true)
  );

  const getStatusTagProps = (status) => {
    switch (status) {
      case "active":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "draft":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      case "review":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
        };
      case "archived":
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
      case "expired":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleOutlined />;
      case "draft":
        return <ClockCircleOutlined />;
      case "review":
        return <EyeOutlined />;
      case "archived":
        return <StopOutlined />;
      case "expired":
        return <StopOutlined />;
      default:
        return null;
    }
  };

  const getPriorityTagProps = (priority) => {
    switch (priority) {
      case "high":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      case "medium":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      case "low":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Lingkungan":
        return <EnvironmentOutlined />;
      case "Pendidikan":
        return <BookOutlined />;
      case "Keamanan":
        return <SafetyOutlined />;
      case "Ekonomi":
        return <BankOutlined />;
      case "Kesehatan":
        return <PlusOutlined />; 
      case "Infrastruktur":
        return <ContainerOutlined />;
      case "Umum":
        return <QuestionCircleOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const columns = [
    {
      title: "Policy Information",
      key: "policyInfo",
      render: (_, record) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br text-white from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
            {getCategoryIcon(record.category) ? (
              React.cloneElement(getCategoryIcon(record.category), {
                className: "text-lg",
              })
            ) : (
              <FileTextOutlined className="text-lg"  style={{ color: 'white' }}/>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
              {record.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {record.description.length > 80
                ? `${record.description.substring(0, 80)}...`
                : record.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                {getCategoryIcon(record.category) &&
                  React.cloneElement(getCategoryIcon(record.category), {
                    className: "w-3 h-3 mr-1",
                  })}
                {record.category}
              </span>
              {(() => {
                const priorityProps = getPriorityTagProps(record.priority);
                return (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityProps.bgColor} ${priorityProps.textColor} ${priorityProps.borderColor} border`}
                  >
                    {record.priority.toUpperCase()}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusProps = getStatusTagProps(status);
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusProps.bgColor} ${statusProps.textColor} ${statusProps.borderColor} border`}
          >
            {getStatusIcon(status) &&
              React.cloneElement(getStatusIcon(status), {
                className: "w-3 h-3 mr-1",
              })}
            {status.toUpperCase()}
          </span>
        );
      },
    },
    {
      title: "Effective Period",
      key: "effectivePeriod",
      width: 180,
      render: (_, record) => (
        <div className="text-sm space-y-1">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-700 font-medium">
              {moment(record.effectiveDate).format("DD MMM YYYY")}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-700">
              {moment(record.expiryDate).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Attachments",
      dataIndex: "attachments",
      key: "attachments",
      width: 150,
      render: (attachments) => (
        <div>
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-gray-900">
              {attachments.length}
            </span>
            <span className="text-sm text-gray-600 ml-1">
              file{attachments.length !== 1 ? "s" : ""}
            </span>
          </div>
          {attachments.length > 0 && (
            <div className="space-y-1">
              {attachments.slice(0, 2).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs text-gray-600 bg-gray-50 rounded px-2 py-1"
                >
                  <FileTextOutlined className="w-3 h-3 mr-1" />
                  <span className="truncate">
                    {file.length > 15 ? `${file.substring(0, 15)}...` : file}
                  </span>
                </div>
              ))}
              {attachments.length > 2 && (
                <div className="text-xs text-indigo-600 font-medium">
                  +{attachments.length - 2} lainnya
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Visibility",
      dataIndex: "isPublic",
      key: "isPublic",
      width: 100,
      render: (isPublic) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isPublic
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-purple-100 text-purple-800 border border-purple-200"
          }`}
        >
          {isPublic ? (
            <UserOutlined className="w-3 h-3 mr-1" />
          ) : (
            <UnlockOutlined className="w-3 h-3 mr-1" />
          )}
          {isPublic ? "Publik" : "Privat"}
        </span>
      ),
    },
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
      width: 120,
      render: (date) => (
        <Text className="text-sm text-gray-700">
          {moment(date).format("DD MMM YYYY")}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              console.log("View policy:", record.id);
            }}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Lihat Detail"
          >
            <EyeOutlined className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(record)}
            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
            title="Edit Kebijakan"
          >
            <EditOutlined className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Hapus Kebijakan"
          >
            <DeleteOutlined className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const policyStats = {
    total: policies.length,
    active: policies.filter((p) => p.status === "active").length,
    draft: policies.filter((p) => p.status === "draft").length,
    review: policies.filter((p) => p.status === "review").length,
    public: policies.filter((p) => p.isPublic).length,
  };

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-auto bg-gray-100">
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <FileTextOutlined
                className="text-xl"
                style={{ color: "white" }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manajemen Kebijakan
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola dan pantau semua kebijakan organisasi
              </p>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={12} sm={6}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Kebijakan
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {policyStats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileTextOutlined
                    className="text-xl"
                    style={{ color: "white" }}
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Kebijakan Aktif
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {policyStats.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircleOutlined
                    className="text-xl"
                    style={{ color: "white" }}
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Dalam Review
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {policyStats.review}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <EyeOutlined className="text-xl" style={{ color: "white" }} />
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Kebijakan Publik
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {policyStats.public}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <UserOutlined
                    className="text-xl"
                    style={{ color: "white" }}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="flex justify-end mb-5">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none rounded-lg px-6 h-12 font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            Buat Kebijakan Baru
          </Button>
        </div>

        <div className="bg-white  items-center rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Kebijakan
                </label>
                <Input
                  placeholder="Cari berdasarkan judul, deskripsi, atau kategori..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  className="rounded-lg h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all duration-200"
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status
                </label>
                <Select
                  placeholder="Semua Status"
                  style={{ width: "100%", height: "48px" }}
                  allowClear
                  onChange={(value) => setFilterStatus(value)}
                  className="rounded-lg"
                >
                  <Option value="active">Aktif</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="review">Review</Option>
                  <Option value="archived">Arsip</Option>
                  <Option value="expired">Kedaluwarsa</Option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-2 py-4 border-b border-gray-200 ">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Kebijakan
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Kelola semua kebijakan organisasi Anda
            </p>
          </div>
          <Table
            columns={columns}
            dataSource={filteredPolicies}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              showTotal: (total, range) => (
                <Text type="secondary" className="text-gray-600">
                  {range[0]}-{range[1]} of {total} policies
                </Text>
              ),
              className: "px-6 py-4",
            }}
            scroll={{ x: 1300 }}
            className="[&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-gray-50 [&_.ant-table-thead>tr>th]:!border-gray-200 [&_.ant-table-tbody>tr>td]:!border-gray-200 [&_.ant-table-tbody>tr:hover>td]:!bg-gray-50"
            bordered={false}
          />
        </div>

        <Modal
          title={
            <div className="flex items-center space-x-4 pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileTextOutlined
                  className="text-xl"
                  style={{ color: "white" }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPolicy ? "Edit Kebijakan" : "Tambah Kebijakan Baru"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingPolicy
                    ? "Perbarui informasi kebijakan yang ada"
                    : "Buat kebijakan baru untuk organisasi Anda"}
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
          className="rounded-lg shadow-xl"
          styles={{
            header: { borderBottom: "1px solid #e5e7eb", paddingBottom: 0 },
            body: { paddingTop: "1.5rem" },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-6 space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Judul Kebijakan *
              </label>
              <Form.Item
                name="title"
                rules={[
                  { required: true, message: "Judul kebijakan harus diisi!" },
                  { min: 10, message: "Judul minimal 10 karakter!" },
                ]}
                className="mb-0"
              >
                <Input
                  placeholder="Masukkan judul kebijakan"
                  className="h-12 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
              </Form.Item>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Deskripsi *
              </label>
              <Form.Item
                name="description"
                rules={[{ required: true, message: "Deskripsi harus diisi!" }]}
                className="mb-0"
              >
                <TextArea
                  rows={4}
                  placeholder="Masukkan deskripsi singkat kebijakan"
                  showCount
                  maxLength={300}
                  className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 resize-none"
                />
              </Form.Item>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Konten Kebijakan *
              </label>
              <Form.Item
                name="content"
                rules={[
                  { required: true, message: "Konten kebijakan harus diisi!" },
                ]}
                className="mb-0"
              >
                <TextArea
                  rows={8}
                  placeholder="Masukkan konten lengkap kebijakan..."
                  showCount
                  maxLength={2000}
                  className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 resize-none"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Kategori *
                </label>
                <Form.Item
                  name="category"
                  rules={[
                    { required: true, message: "Kategori harus dipilih!" },
                  ]}
                  className="mb-0"
                >
                  <Select
                    placeholder="Pilih kategori"
                    className="h-12 [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-focused_.ant-select-selector]:!border-indigo-500 [&_.ant-select-focused_.ant-select-selector]:!ring-2 [&_.ant-select-focused_.ant-select-selector]:!ring-indigo-200"
                  >
                    <Option value="Lingkungan">Lingkungan</Option>
                    <Option value="Pendidikan">Pendidikan</Option>
                    <Option value="Keamanan">Keamanan</Option>
                    <Option value="Ekonomi">Ekonomi</Option>
                    <Option value="Kesehatan">Kesehatan</Option>
                    <Option value="Infrastruktur">Infrastruktur</Option>
                    <Option value="Umum">Umum</Option>
                  </Select>
                </Form.Item>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Status *
                </label>
                <Form.Item
                  name="status"
                  rules={[{ required: true, message: "Status harus dipilih!" }]}
                  className="mb-0"
                >
                  <Select
                    placeholder="Pilih status"
                    className="h-12 [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-focused_.ant-select-selector]:!border-indigo-500 [&_.ant-select-focused_.ant-select-selector]:!ring-2 [&_.ant-select-focused_.ant-select-selector]:!ring-indigo-200"
                  >
                    <Option value="draft">Draft</Option>
                    <Option value="review">Review</Option>
                    <Option value="active">Aktif</Option>
                    <Option value="archived">Arsip</Option>
                  </Select>
                </Form.Item>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Prioritas *
                </label>
                <Form.Item
                  name="priority"
                  rules={[
                    { required: true, message: "Prioritas harus dipilih!" },
                  ]}
                  className="mb-0"
                >
                  <Select
                    placeholder="Pilih prioritas"
                    className="h-12 [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-focused_.ant-select-selector]:!border-indigo-500 [&_.ant-select-focused_.ant-select-selector]:!ring-2 [&_.ant-select-focused_.ant-select-selector]:!ring-indigo-200"
                  >
                    <Option value="low">Rendah</Option>
                    <Option value="medium">Sedang</Option>
                    <Option value="high">Tinggi</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tanggal Berlaku *
                </label>
                <Form.Item
                  name="effectiveDate"
                  rules={[
                    {
                      required: true,
                      message: "Tanggal berlaku harus dipilih!",
                    },
                  ]}
                  className="mb-0"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Pilih tanggal berlaku"
                    className="h-12 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  />
                </Form.Item>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tanggal Berakhir *
                </label>
                <Form.Item
                  name="expiryDate"
                  rules={[
                    {
                      required: true,
                      message: "Tanggal berakhir harus dipilih!",
                    },
                  ]}
                  className="mb-0"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Pilih tanggal berakhir"
                    className="h-12 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  />
                </Form.Item>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Visibilitas Kebijakan
              </label>
              <Form.Item
                name="isPublic"
                valuePropName="checked"
                className="mb-0"
              >
                <Switch
                  checkedChildren="Publik"
                  unCheckedChildren="Privat"
                  className="bg-gray-300 data-[state=checked]:!bg-indigo-600"
                />
              </Form.Item>
            </div>

            <Divider className="my-6 border-gray-300" />

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Lampiran
              </label>
              <Form.Item
                name="attachments"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
                className="mb-0"
              >
                <Upload
                  multiple
                  beforeUpload={() => false}
                  showUploadList={{ showRemoveIcon: true }}
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="h-12 rounded-xl border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all duration-200"
                  >
                    Upload File
                  </Button>
                </Upload>
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
                className="h-12 px-8 rounded-xl border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 transition-all duration-200"
              >
                Batal
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                {editingPolicy ? "Perbarui Kebijakan" : "Buat Kebijakan"}
              </Button>
            </div>
          </Form>
        </Modal>
    </div>
  );
};

export default PoliciesManagement;
