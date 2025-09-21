import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';

const PendidikanPolitik = ({ onGetEvents, userName }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const result = await onGetEvents();
      if (result.success) {
        setEvents(result.data);
      } else {
        console.error('Gagal memuat events:', result.error);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (eventId, registrationLink) => {
    // Simulasi pendaftaran
    setRegisteredEvents(prev => new Set([...prev, eventId]));
    
    // Buka link pendaftaran jika ada
    if (registrationLink) {
      window.open(registrationLink, '_blank');
    } else {
      alert('Pendaftaran berhasil! Anda akan menerima konfirmasi melalui email.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Waktu akan diinformasikan';
    return timeString;
  };

  const getEventTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'webinar':
        return 'bg-blue-100 text-blue-800';
      case 'seminar':
        return 'bg-green-100 text-green-800';
      case 'workshop':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat informasi kegiatan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Informasi Pendidikan Politik</h3>
        <p className="text-gray-600">
          {userName || 'Pak/Bu'} tadi sudah menjawab polling kami, nah sekarang kami informasikan 
          beberapa kegiatan untuk Pendidikan Politik:
        </p>
      </div>

      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada kegiatan yang tersedia saat ini.</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type?.toUpperCase() || 'EVENT'}
                    </span>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">
                    {event.title}
                  </h4>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span><strong>Tanggal:</strong> {formatDate(event.date)}</span>
                    </div>
                    
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span><strong>Waktu:</strong> {formatTime(event.time)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span><strong>Lokasi:</strong> {event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span><strong>Penyelenggara:</strong> {event.organizer}</span>
                    </div>
                  </div>
                  
                  {event.description && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{event.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 md:w-48">
                  {registeredEvents.has(event.id) ? (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
                      ✓ Terdaftar
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(event.id, event.registration_link)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Daftar Sekarang
                    </button>
                  )}
                  
                  {event.registration_link && (
                    <a
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 text-sm text-center underline"
                    >
                      Link Pendaftaran
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {events.length > 0 && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">Informasi Penting:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Pendaftaran gratis untuk semua kegiatan</li>
            <li>• Sertifikat akan diberikan untuk peserta yang hadir</li>
            <li>• Konfirmasi pendaftaran akan dikirim melalui email</li>
            <li>• Untuk informasi lebih lanjut, hubungi panitia penyelenggara</li>
          </ul>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Silahkan daftar dengan klik tombol pendaftaran di atas.
        </p>
      </div>
    </div>
  );
};

export default PendidikanPolitik;