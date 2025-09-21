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
    }, 1500); // Sedikit dipercepat transisi
  };

  const handlePollingComplete = () => {
    setCompletedSegments(prev => new Set([...prev, 'polling']));
    setTimeout(() => {
      setCurrentSegment('pendidikan');
    }, 1500); // Sedikit dipercepat transisi
  };

  const handlePendidikanComplete = () => {
    setCompletedSegments(prev => new Set([...prev, 'pendidikan']));
    setTimeout(() => {
      setCurrentSegment('closing');
    }, 1500); // Sedikit dipercepat transisi
  };

  const renderSegmentIndicator = () => {
    const segments = [
      { id: 'aspirasi', label: 'Aspirasi Warga', icon: '📝' },
      { id: 'polling', label: 'Survei & Polling', icon: '📊' },
      { id: 'pendidikan', label: 'Pendidikan Politik', icon: '🎓' },
      { id: 'closing', label: 'Penutup', icon: '👋' }
    ];

    return (
      <div className="mb-8 p-4 bg-white rounded-xl shadow-sm md:shadow-md">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {segments.map((segment, index) => {
            const isActive = currentSegment === segment.id;
            const isCompleted = completedSegments.has(segment.id);
            const isAccessible = index === 0 || completedSegments.has(segments[index - 1].id);
            
            return (
              <React.Fragment key={segment.id}>
                <div className="flex flex-col items-center min-w-[120px] max-w-[150px] text-center">
                  <div className={`
                    flex items-center justify-center w-14 h-14 rounded-full text-xl md:text-2xl font-semibold mb-2 transition-all duration-300 ease-in-out
                    ${isCompleted ? 'bg-green-500 text-white shadow-lg' : 
                      isActive ? 'bg-blue-500 text-white animate-pulse shadow-xl' : 
                      isAccessible ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                  `}>
                    {isCompleted ? '✓' : segment.icon}
                  </div>
                  <div className="text-xs md:text-sm font-medium">
                    <div className={`
                      ${isActive ? 'text-blue-600 font-bold' : 
                        isCompleted ? 'text-green-600' : 'text-gray-500'}
                      transition-colors duration-300
                    `}>
                      {segment.label}
                    </div>
                  </div>
                </div>
                {index < segments.length - 1 && (
                  <div className={`
                    hidden md:flex items-center
                    ${completedSegments.has(segment.id) ? 'text-green-500' : 'text-gray-300'}
                  `}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPicoIntroduction = () => {
    const introductions = {
      aspirasi: (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 md:p-8 rounded-xl shadow-lg mb-8 transition-all duration-500 ease-in-out transform hover:scale-105">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 shadow-md">
              🤖
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-1">Halo {userName}!</h3>
              <p className="text-blue-100 text-base md:text-lg">
                Saya Pico dari <strong className="font-semibold">SMARTPOL UB</strong>. Mari kita mulai dengan mendengar aspirasi Anda!
              </p>
            </div>
          </div>
        </div>
      ),
      polling: (
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-6 md:p-8 rounded-xl shadow-lg mb-8 transition-all duration-500 ease-in-out transform hover:scale-105">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 shadow-md">
              🤖
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-1">Terima kasih {userName}!</h3>
              <p className="text-green-100 text-base md:text-lg">
                Aspirasi Anda sudah tercatat. Sekarang mari kita lanjut ke sesi polling publik.
              </p>
            </div>
          </div>
        </div>
      ),
      pendidikan: (
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6 md:p-8 rounded-xl shadow-lg mb-8 transition-all duration-500 ease-in-out transform hover:scale-105">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 shadow-md">
              🤖
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-1">Polling selesai, {userName}!</h3>
              <p className="text-purple-100 text-base md:text-lg">
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
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl max-w-3xl mx-auto text-center border border-gray-100 animate-fade-in">
        <div className="mb-8">
          <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-5xl text-white mx-auto mb-5 shadow-lg">
            🤖
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Terima Kasih {userName}!</h3>
          <p className="text-gray-500 text-lg">Sampai jumpa lagi!</p>
        </div>
        
        <div className="space-y-5 text-gray-700">
          <p className="text-lg leading-relaxed">
            Baik {userName}, Terima kasih sudah berpartisipasi aktif di <strong className="text-blue-600">SMARTPOL UB</strong>!
          </p>
          
          <p className="leading-relaxed">
            Saya Pico senang bisa menemani Anda hari ini. Aspirasi dan pendapat Anda sangat berharga 
            untuk kemajuan demokrasi dan partisipasi politik di Indonesia.
          </p>
          
          <div className="bg-blue-50 p-5 rounded-lg my-6 border border-blue-100 shadow-inner">
            <h4 className="font-bold text-blue-800 text-xl mb-3">Ringkasan Aktivitas Anda:</h4>
            <div className="text-base text-blue-700 space-y-2">
              {completedSegments.has('aspirasi') && <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✓</span> Aspirasi warga telah disampaikan</p>}
              {completedSegments.has('polling') && <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✓</span> Survei & polling publik telah diisi</p>}
              {completedSegments.has('pendidikan') && <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✓</span> Informasi pendidikan politik telah diterima</p>}
            </div>
          </div>
          
          <p className="text-xl font-semibold text-gray-800 leading-relaxed">
            Mari kita wujudkan ruang publik digital yang lebih cerdas dan bermanfaat bersama <strong className="text-blue-600">SMARTPOL UB</strong>!
          </p>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              setCurrentSegment('aspirasi');
              setCompletedSegments(new Set());
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Mulai Sesi Baru
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
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
              // Asumsi PollingPublik memiliki cara internal untuk menandai selesai
              // atau kita tambahkan mekanisme di sini setelah polling submit terakhir.
              // Untuk demo, kita langsung anggap selesai setelah getStats dipanggil
              // jika ingin lebih presisi, ini harus di trigger dari dalam PollingPublik
              // setelah semua pertanyaan terjawab atau user menekan tombol 'Selesai Polling'
              setTimeout(() => {
                handlePollingComplete();
              }, 1000); // Memberi sedikit jeda visual
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
            <div className="text-center mt-8">
              <button
                onClick={handlePendidikanComplete}
                className="bg-purple-600 text-white px-10 py-4 rounded-full hover:bg-purple-700 transition-all duration-300 ease-in-out font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
    <div className="min-h-screen bg-gray-100  text-gray-900  py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="container mx-auto max-w-screen-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700  mb-3 drop-shadow-md">SMARTPOL UB</h1>
          <p className="text-lg sm:text-xl text-gray-600 ">Platform Partisipasi Politik Digital</p>
        </div>
        
        {renderSegmentIndicator()}
        
        {currentSegment !== 'closing' && renderPicoIntroduction()}
        
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-xl border border-gray-200 transition-all duration-300 animate-fade-in-up">
          {renderCurrentSegment()}
        </div>
      </div>
    </div>
  );
};

export default SmartpolFlow;