import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AspirasiWarga = ({ onSubmitAspirasi, onGetStats, userName }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const aspirasiCategories = {
    'Pendidikan': [
      'Pendidikan gratis dan berkualitas sampai perguruan tinggi',
      'Pemerataan akses sekolah di daerah terpencil',
      'Peningkatan kualitas guru dan kurikulum'
    ],
    'Kesehatan': [
      'Layanan kesehatan murah/terjangkau untuk semua warga',
      'Fasilitas rumah sakit dan puskesmas yang lebih lengkap',
      'Akses obat dan BPJS yang lebih mudah'
    ],
    'Ekonomi & Lapangan Kerja': [
      'Penciptaan lapangan kerja baru untuk anak muda',
      'Dukungan bagi UMKM, petani, dan nelayan',
      'Stabilitas harga kebutuhan pokok'
    ],
    'Infrastruktur & Transportasi': [
      'Perbaikan jalan dan transportasi publik',
      'Infrastruktur digital/internet merata di seluruh wilayah',
      'Pembangunan energi terbarukan'
    ],
    'Pemerintahan & Politik': [
      'Pemerintah yang bersih dari korupsi',
      'Transparansi anggaran dan kebijakan publik',
      'Partisipasi masyarakat dalam pengambilan keputusan'
    ],
    'Penegakan Hukum': [
      'Pemberantasan korupsi secara konsisten',
      'Penegakan hukum yang adil, transparan, dan cepat',
      'Tindakan tegas terhadap pembalakan liar dan perusakan sumber daya alam'
    ],
    'Lingkungan Hidup': [
      'Pengelolaan sampah yang lebih baik',
      'Perlindungan hutan, laut, dan keanekaragaman hayati',
      'Pengendalian polusi udara dan air'
    ],
    'Ketahanan Sosial & Budaya': [
      'Perlindungan bagi kelompok rentan (disabilitas, lansia, anak)',
      'Pelestarian budaya dan kearifan lokal',
      'Meningkatkan rasa persatuan dan toleransi antarwarga'
    ]
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedSubcategory) {
      alert('Silakan pilih kategori dan subkategori aspirasi');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmitAspirasi(selectedCategory, selectedSubcategory);
      if (result.success) {
        alert('Aspirasi berhasil dikirim!');
        setSelectedCategory('');
        setSelectedSubcategory('');
        // Tampilkan statistik setelah submit
        await handleShowStats();
      } else {
        alert('Gagal mengirim aspirasi: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim aspirasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowStats = async () => {
    try {
      const result = await onGetStats();
      if (result.success) {
        setStatsData(result.data);
        setShowStats(true);
      } else {
        alert('Gagal mengambil statistik: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengambil statistik');
    }
  };

  const renderChart = () => {
    if (!statsData || !statsData.by_category) return null;

    const chartData = {
      labels: Object.keys(statsData.by_category),
      datasets: [
        {
          label: 'Jumlah Aspirasi',
          data: Object.values(statsData.by_category),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF'
          ],
          borderColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF'
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Statistik Aspirasi Warga per Kategori',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={chartData} options={options} />;
  };

  const renderMap = () => {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mt-4">
        <h4 className="font-semibold mb-2">Peta Sebaran Aspirasi</h4>
        <div className="bg-white p-4 rounded border">
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23e5f3ff'/%3E%3Cpath d='M50 50 L150 50 L150 100 L100 120 L50 100 Z' fill='%23ffeb3b'/%3E%3Cpath d='M160 60 L250 60 L250 110 L200 130 L160 110 Z' fill='%234caf50'/%3E%3Cpath d='M260 70 L350 70 L350 120 L300 140 L260 120 Z' fill='%23ff9800'/%3E%3Ctext x='100' y='85' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Timur%3C/text%3E%3Ctext x='205' y='95' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Tengah%3C/text%3E%3Ctext x='305' y='105' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Barat%3C/text%3E%3C/svg%3E"
            alt="Peta Sebaran Aspirasi"
            className="w-full h-48 object-contain"
          />
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span>Tinggi (Jawa Timur): {statsData?.by_region?.['Jawa Timur'] || 0} aspirasi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Sedang (Jawa Tengah): {statsData?.by_region?.['Jawa Tengah'] || 0} aspirasi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span>Rendah (Jawa Barat): {statsData?.by_region?.['Jawa Barat'] || 0} aspirasi</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showStats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-4 text-center">Hasil Aspirasi Warga</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {renderChart()}
          </div>
          <div>
            {renderMap()}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowStats(false)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Kembali ke Form Aspirasi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Aspirasi Warga</h3>
        <p className="text-gray-600">
          Baik {userName || 'Pak/Bu'}, aspirasi apa yang ingin Anda sampaikan? 
          Silahkan pilih dari daftar aspirasi di bawah ini:
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kategori Aspirasi:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory('');
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Pilih Kategori --</option>
            {Object.keys(aspirasiCategories).map((category, index) => (
              <option key={index} value={category}>
                {index + 1}. {category}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Sub-kategori:
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Pilih Sub-kategori --</option>
              {aspirasiCategories[selectedCategory].map((subcategory, index) => (
                <option key={index} value={subcategory}>
                  [{index + 1}] {subcategory}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedCategory || !selectedSubcategory || isSubmitting}
            className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Aspirasi'}
          </button>
          
          <button
            onClick={handleShowStats}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
          >
            Lihat Statistik
          </button>
        </div>
      </div>
    </div>
  );
};

export default AspirasiWarga;