import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaUser, FaFlag, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { Modal, Form, Input, Select, Button, message } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const ChatBubbleLegislator = ({ message, image, isUser, timestamp, isTyping = false }) => {
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportForm] = Form.useForm();
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const utteranceRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Typing effect for bot messages
  useEffect(() => {
    if (isTyping && !isUser && message) {
      const timer = setTimeout(() => {
        if (currentIndex < message.length) {
          setDisplayedMessage(prev => prev + message[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }
      }, 30); // Adjust speed here
      
      return () => clearTimeout(timer);
    } else if (!isTyping && !isUser) {
      setDisplayedMessage(message || '');
      setCurrentIndex(0);
    }
  }, [isTyping, message, isUser, currentIndex]);

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

  const handleTextToSpeech = () => {
    if (!speechSupported) {
      message.error('Browser Anda tidak mendukung text-to-speech.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Use the complete message for TTS, not the typing effect message
    const textToSpeak = isUser ? message : (displayedMessage || message);
    if (!textToSpeak.trim()) {
      message.warning('Tidak ada teks untuk dibacakan.');
      return;
    }
    
    // Wait for typing effect to complete before speaking
    if (!isUser && isTyping) {
      message.info('Tunggu hingga pesan selesai ditampilkan.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID'; // Indonesian language
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      message.error('Gagal memutar suara.');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <div className={`flex items-start gap-3 mb-4 animate-fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:animate-pulse transition-all duration-300 hover:scale-110" style={{backgroundColor: '#28b8b8'}}>
            <FaUser className="text-xs" />
          </div>
        ) : (
          <div className="relative">
            <img 
              src="/images/logo.png" 
              alt="Bot Avatar" 
              className="w-8 h-8 rounded-full object-cover hover:animate-zoom-pulse transition-all duration-300 hover:scale-110"
            />
            {isTyping && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
        )}
      </div>
      
      {/* Message Bubble */}
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 ${
        isUser 
          ? 'text-white rounded-br-md' 
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
      }`} style={isUser ? {backgroundColor: '#28b8b8'} : {}}>
        {/* Image */}
        {image && (
          <div className="mb-2 animate-fade-in">
            <img 
              src={createImageUrl(image)} 
              alt="Uploaded image" 
              className="max-w-full h-auto rounded-lg border border-gray-200 hover:scale-105 transition-transform duration-300"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
        
        {/* Text Message */}
        {(message || displayedMessage) && (
          <div className="text-sm leading-relaxed">
            {isTyping && !isUser ? (
              <span>
                {displayedMessage}
                <span className="animate-pulse">|</span>
              </span>
            ) : (
              <span className="animate-fade-in">{isUser ? message : displayedMessage}</span>
            )}
          </div>
        )}
        
        {timestamp && (
           <p className={`text-xs mt-1 ${
             isUser ? 'text-blue-100' : 'text-gray-500'
           }`}>
             {timestamp}
           </p>
         )}
        
        {/* Action Buttons for Bot Messages */}
        {!isUser && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setReportModalVisible(true)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              <FaFlag className="text-xs" />
              Laporkan
            </button>
            {speechSupported && (
              <button
                onClick={handleTextToSpeech}
                disabled={isTyping}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  isSpeaking
                    ? 'text-blue-600 animate-pulse'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
                title={isSpeaking ? 'Klik untuk berhenti' : 'Dengarkan pesan'}
              >
                {isSpeaking ? (
                  <FaVolumeMute className="text-xs" />
                ) : (
                  <FaVolumeUp className="text-xs" />
                )}
                {isSpeaking ? 'Berhenti' : 'Dengar'}
              </button>
            )}
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

export default ChatBubbleLegislator;