import React, { useState, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { FaHistory, FaTrash, FaPlus } from 'react-icons/fa';
import { Button, List, Card, Typography, Spin, Empty, Modal, message, Tooltip } from 'antd';

const { Title, Text } = Typography;

const ChatHistory = ({ onSelectSession, onNewChat, currentSessionId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.id) {
        const response = await chatAPI.getChatSessions();
        setSessions(response.sessions || []);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      message.error('Gagal memuat riwayat chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = (sessionId) => {
    onSelectSession(sessionId);
  };

  const handleNewChat = () => {
    onNewChat();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Hari ini';
    } else if (diffDays === 2) {
      return 'Kemarin';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} hari lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
     <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaHistory className="text-blue-600" />
          <Title level={5} className="mb-0" style={{ color: '#01077A' }}>
            Riwayat Chat
          </Title>
        </div>
        <Tooltip title="Chat Baru" placement="bottom">
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon={<FaPlus />}
            onClick={handleNewChat}
            style={{ backgroundColor: '#01077A', borderColor: '#01077A' }}
          />
        </Tooltip>
      </div>

      {sessions.length === 0 ? (
        <Empty
          description="Belum ada riwayat chat"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={sessions}
          renderItem={(session) => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-50 rounded-lg p-2 mb-2 transition-colors ${
                currentSessionId === session.session_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => handleSelectSession(session.session_id)}
            >
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <Text
                    className="font-medium text-sm"
                    style={{ color: '#01077A' }}
                    ellipsis={{ tooltip: session.title }}
                  >
                    {session.title}
                  </Text>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <Text className="text-xs text-gray-500">
                    {formatDate(session.last_message_time)}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {session.message_count} pesan
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ChatHistory;