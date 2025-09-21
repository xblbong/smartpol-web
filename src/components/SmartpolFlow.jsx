import React, { useState } from 'react';
import AspirasiWarga from './AspirasiWarga';
import PollingPublik from './PollingPublik';
import PendidikanPolitik from './PendidikanPolitik';
import { useChat } from '../hooks/useChat';

const SmartpolFlow = ({ userName = 'Pak Jaka' }) => {
  const [currentSegment, setCurrentSegment] = useState('aspirasi'); // aspirasi, polling, pendidikan, closing
  const [completedSegments, setCompletedSegments] = useState(new Set());
  
  const {
    submitAspirasi,
    getAspirasiStats,
    submitPollingPublik,
    getPollingPublikStats,
    getEvents
  } = useChat();

  const handleAspirasiComplete = () => {
    setCompletedSegments(prev => new Set([...prev, 'aspirasi']));
    setTimeout(() => {
      setCurrentSegment('polling');
    }, 2000);
  };

  const handlePollingComplete = () => {
    setCompletedSegments(prev => new Set([...prev, 'polling']));
    setTimeout(() => {
      setCurrentSegment('pendidikan');
    }, 2000);
  };

  const handlePendidikanComplete = () => {
    setCompletedSegments(prev => new Set([...prev, 'pendidikan']));
    setTimeout(() => {
      setCurrentSegment('closing');
    }, 2000);
  };

  const renderSegmentIndicator = () => {
    const segments = [
      { id: 'aspirasi', label: 'Aspirasi Warga', icon: '📝' },
      { id: 'polling', label: 'Survei & Polling', icon: '📊' },
      { id: 'pendidikan', label: 'Pendidikan Politik', icon: '🎓' },
      { id: 'closing', label: 'Penutup', icon: '👋' }
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {segments.map((segment, index) => {
              const isActive = currentSegment === segment.id;
              const isCompleted = completedSegments.has(segment.id);
              const isAccessible = index === 0 || completedSegments.has(segments[index - 1].id);
              
              return (
                <div key={segment.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium
                    ${isCompleted ? 'bg-green-500 text-white' : 
                      isActive ? 'bg-blue-500 text-white' : 
                      isAccessible ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'}
                  `}>
                    {isCompleted ? '✓' : segment.icon}
                  </div>
                  <div className="ml-2 text-sm">
                    <div className={`font-medium ${
                      isActive ? 'text-blue-600' : 
                      isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {segment.label}
                    </div>
                  </div>
                  {index < segments.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      completedSegments.has(segment.id) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPicoIntroduction = () => {
    const introductions = {
      aspirasi: (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-bold">Halo {userName}!</h3>
              <p className="text-blue-100">
                Saya Pico dari SMARTPOL UB. Mari kita mulai dengan mendengar aspirasi Anda!
              </p>
            </div>
          </div>
        </div>
      ),
      polling: (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-bold">Terima kasih {userName}!</h3>
              <p className="text-green-100">
                Aspirasi Anda sudah tercatat. Sekarang mari kita lanjut ke sesi polling publik.
              </p>
            </div>
          </div>
        </div>
      ),
      pendidikan: (
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-bold">Polling selesai, {userName}!</h3>
              <p className="text-purple-100">
                Sekarang saya informasikan kegiatan pendidikan politik yang tersedia untuk Anda.
              </p>
            </div>
          </div>
        </div>
      )
    };

    return introductions[currentSegment];
  };

  const renderClosing = () => {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-4">
            🤖
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Terima Kasih {userName}!</h3>
        </div>
        
        <div className="space-y-4 text-gray-600">
          <p className="text-lg">
            Baik {userName}, Terima kasih sudah berkunjung ke <strong className="text-blue-600">SMARTPOL UB</strong>!
          </p>
          
          <p>
            Saya Pico senang bisa menemani Anda hari ini. Aspirasi dan pendapat Anda sangat berharga 
            untuk kemajuan demokrasi dan partisipasi politik di Indonesia.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg my-6">
            <h4 className="font-semibold text-blue-800 mb-2">Ringkasan Aktivitas Anda:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              {completedSegments.has('aspirasi') && <p>✓ Aspirasi warga telah disampaikan</p>}
              {completedSegments.has('polling') && <p>✓ Survei & polling publik telah diisi</p>}
              {completedSegments.has('pendidikan') && <p>✓ Informasi pendidikan politik telah diterima</p>}
            </div>
          </div>
          
          <p className="text-lg font-medium text-gray-800">
            Sampai jumpa di kesempatan berikutnya, mari kita wujudkan ruang publik digital 
            yang lebih cerdas dan bermanfaat bersama <strong className="text-blue-600">SMARTPOL UB</strong>!
          </p>
        </div>
        
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => {
              setCurrentSegment('aspirasi');
              setCompletedSegments(new Set());
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Mulai Sesi Baru
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentSegment = () => {
    switch (currentSegment) {
      case 'aspirasi':
        return (
          <AspirasiWarga
            userName={userName}
            onSubmitAspirasi={async (category, subcategory) => {
              const result = await submitAspirasi(category, subcategory);
              if (result.success) {
                setTimeout(() => {
                  handleAspirasiComplete();
                }, 1000);
              }
              return result;
            }}
            onGetStats={getAspirasiStats}
          />
        );
      
      case 'polling':
        return (
          <PollingPublik
            userName={userName}
            onSubmitPolling={async (questionId, answer) => {
              const result = await submitPollingPublik(questionId, answer);
              return result;
            }}
            onGetStats={async () => {
              const result = await getPollingPublikStats();
              if (result.success) {
                setTimeout(() => {
                  handlePollingComplete();
                }, 3000);
              }
              return result;
            }}
          />
        );
      
      case 'pendidikan':
        return (
          <div>
            <PendidikanPolitik
              userName={userName}
              onGetEvents={getEvents}
            />
            <div className="text-center mt-6">
              <button
                onClick={handlePendidikanComplete}
                className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Lanjut ke Penutup
              </button>
            </div>
          </div>
        );
      
      case 'closing':
        return renderClosing();
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SMARTPOL UB</h1>
          <p className="text-gray-600">Platform Partisipasi Politik Digital</p>
        </div>
        
        {renderSegmentIndicator()}
        
        {currentSegment !== 'closing' && renderPicoIntroduction()}
        
        {renderCurrentSegment()}
      </div>
    </div>
  );
};

export default SmartpolFlow;