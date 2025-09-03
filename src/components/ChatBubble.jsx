import React, { useState } from 'react';
import { FaRobot, FaUser, FaFlag } from 'react-icons/fa';
import { Modal, Form, Input, Select, Button, message } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const ChatBubble = ({ message, image, isUser, timestamp }) => {
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportForm] = Form.useForm();

  const createImageUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file;
  };

  const handleCreateReport = async (values) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...values,
          description: `${values.description}\n\nRelated to chat message: "${message}"`
        })
      });
      
      if (response.ok) {
        message.success('Report submitted successfully');
        setReportModalVisible(false);
        reportForm.resetFields();
      } else {
        message.error('Failed to submit report');
      }
    } catch (error) {
      message.error('Failed to submit report');
    }
  };
  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{backgroundColor: '#01077A'}}>
            <FaUser className="text-xs" />
          </div>
        ) : (
          <img 
            src="/images/logo.png" 
            alt="Bot Avatar" 
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
      </div>
      
      {/* Message Bubble */}
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
        isUser 
          ? 'text-white rounded-br-md' 
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
      }`} style={isUser ? {backgroundColor: '#01077A'} : {}}>
        {/* Image */}
        {image && (
          <div className="mb-2">
            <img 
              src={createImageUrl(image)} 
              alt="Uploaded image" 
              className="max-w-full h-auto rounded-lg border border-gray-200"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
        
        {/* Text Message */}
        {message && (
          <p className="text-sm leading-relaxed">{message}</p>
        )}
        
        {timestamp && (
          <p className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {timestamp}
          </p>
        )}
        
        {/* Report Button for Bot Messages */}
        {!isUser && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setReportModalVisible(true)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              <FaFlag className="text-xs" />
              Laporkan
            </button>
          </div>
        )}
      </div>
      
      {/* Report Modal */}
      <Modal
        title="Buat Laporan"
        open={reportModalVisible}
        onCancel={() => {
          setReportModalVisible(false);
          reportForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={reportForm}
          layout="vertical"
          onFinish={handleCreateReport}
        >
          <Form.Item
            name="title"
            label="Judul Laporan"
            rules={[{ required: true, message: 'Silakan masukkan judul laporan!' }]}
          >
            <Input placeholder="Masukkan judul laporan..." />
          </Form.Item>
          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: 'Silakan pilih kategori!' }]}
          >
            <Select placeholder="Pilih kategori laporan">
              <Option value="pelayanan">Pelayanan Publik</Option>
              <Option value="infrastruktur">Infrastruktur</Option>
              <Option value="keamanan">Keamanan</Option>
              <Option value="lingkungan">Lingkungan</Option>
              <Option value="sosial">Sosial</Option>
              <Option value="ekonomi">Ekonomi</Option>
              <Option value="lainnya">Lainnya</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="Lokasi (Opsional)"
          >
            <Input placeholder="Masukkan lokasi kejadian..." />
          </Form.Item>
          <Form.Item
            name="description"
            label="Deskripsi"
            rules={[{ required: true, message: 'Silakan masukkan deskripsi!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Jelaskan detail laporan Anda..."
            />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Prioritas"
            initialValue="medium"
          >
            <Select>
              <Option value="low">Rendah</Option>
              <Option value="medium">Sedang</Option>
              <Option value="high">Tinggi</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="flex gap-2 justify-end">
              <Button 
                onClick={() => {
                  setReportModalVisible(false);
                  reportForm.resetFields();
                }}
              >
                Batal
              </Button>
              <Button type="primary" htmlType="submit">
                Kirim Laporan
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChatBubble;