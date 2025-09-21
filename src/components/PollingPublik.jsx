import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2'; // Hanya Pie yang digunakan, Bar dihapus jika tidak dipakai
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // Tetap didaftarkan jika mungkin ada kasus Bar chart di masa depan
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PollingPublik = ({ onSubmitPolling, onGetStats, userName }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showStats, setShowStats] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const pollingQuestions = [
    {
      id: 1,
      question: 'Apakah Bapak/Ibu puas dengan pemerintahan Prabowo – Gibran saat ini?',
      options: [
        { value: 1, label: 'Sangat Tidak Puas' },
        { value: 2, label: 'Tidak Puas' },
        { value: 3, label: 'Puas' },
        { value: 4, label: 'Sangat Puas' },
        { value: 5, label: 'TIDAK TAHU/TIDAK JAWAB' }
      ]
    },
    {
      id: 2,
      question: 'Apakah Bapak/Ibu percaya Presiden Prabowo dapat memberantas Korupsi?',
      options: [
        { value: 1, label: 'Sangat Tidak Percaya' },
        { value: 2, label: 'Tidak Percaya' },
        { value: 3, label: 'Percaya' },
        { value: 4, label: 'Sangat Percaya' },
        { value: 5, label: 'TIDAK TAHU/TIDAK JAWAB' }
      ]
    }
  ];

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = async () => {
    const currentQ = pollingQuestions[currentQuestion];
    const selectedAnswer = answers[currentQ.id];
    
    if (!selectedAnswer) {
      alert('Silakan pilih jawaban terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmitPolling(currentQ.id, selectedAnswer);
      if (!result.success) {
        alert('Gagal mengirim jawaban: ' + result.error);
        setIsSubmitting(false);
        return;
      }

      if (currentQuestion < pollingQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsCompleted(true);
        await handleShowStats();
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim jawaban');
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

  const renderPieChart = (questionData, title) => {
    if (!questionData) return null;

    // Menyesuaikan label agar sesuai dengan opsi yang ada di pollingQuestions
    const getOptionLabel = (questionId, value) => {
      const question = pollingQuestions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.value === parseInt(value));
      return option ? option.label : value;
    };

    const labels = Object.keys(questionData).map(value => getOptionLabel(pollingQuestions[0].id, value)); // Ambil ID pertanyaan dari pertanyaan pertama untuk label
    const data = Object.values(questionData);
    
    const chartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ],
          borderColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          },
          color: '#333'
        },
      },
    };

    return <Pie data={chartData} options={options} />;
  };

  const renderMap = () => {
    return (
      <div className="bg-blue-50 p-4 rounded-lg h-full flex flex-col">
        <h4 className="font-semibold text-lg mb-2 text-gray-800">Peta Sebaran Polling</h4>
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex-grow flex flex-col justify-center items-center">
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23e5f3ff'/%3E%3Cpath d='M50 50 L150 50 L150 100 L100 120 L50 100 Z' fill='%234caf50'/%3E%3Cpath d='M160 60 L250 60 L250 110 L200 130 L160 110 Z' fill='%23ffeb3b'/%3E%3Cpath d='M260 70 L350 70 L350 120 L300 140 L260 120 Z' fill='%23ff5722'/%3E%3Ctext x='100' y='85' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Timur%3C/text%3E%3Ctext x='205' y='95' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Tengah%3C/text%3E%3Ctext x='305' y='105' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Barat%3C/text%3E%3C/svg%3E"
            alt="Peta Sebaran Polling"
            className="w-full max-h-40 object-contain mb-4"
          />
          <div className="mt-2 text-sm text-gray-700 w-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div> {/* Warna disamakan dengan fill di SVG */}
              <span>Puas (Jawa Timur): <span className="font-semibold">{statsData?.by_region?.['Jawa Timur'] || 0}</span> responden</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span>Netral (Jawa Tengah): <span className="font-semibold">{statsData?.by_region?.['Jawa Tengah'] || 0}</span> responden</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Tidak Puas (Jawa Barat): <span className="font-semibold">{statsData?.by_region?.['Jawa Barat'] || 0}</span> responden</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showStats) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-7xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Hasil Survei & Polling Publik</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center min-h-[300px]">
              {renderPieChart(
                statsData?.by_question?.[1], 
                'Kepuasan terhadap Pemerintahan Prabowo-Gibran'
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center min-h-[300px]">
              {renderPieChart(
                statsData?.by_question?.[2], 
                'Kepercayaan pada Pemberantasan Korupsi'
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center min-h-[300px]">
              {renderMap()}
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-inner">
            <h4 className="font-semibold text-xl mb-3 text-blue-800">Ringkasan Hasil:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
              <div>
                <p className="mb-1"><strong>Total Responden:</strong> <span className="font-semibold">{statsData?.total_responses || 0}</span></p>
                <p className="mb-1"><strong>Periode Survei:</strong> <span className="font-semibold">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
              </div>
              <div>
                <p className="mb-1"><strong>Tingkat Partisipasi:</strong> <span className="font-semibold">Tinggi</span></p>
                <p className="mb-1"><strong>Margin Error:</strong> <span className="font-semibold">±3%</span></p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setShowStats(false);
                setCurrentQuestion(0);
                setAnswers({});
                setIsCompleted(false);
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg"
            >
              Mulai Polling Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = pollingQuestions[currentQuestion];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-2xl mx-auto border border-gray-200">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Survei & Polling Publik</h3>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            {userName || 'Pak/Bu'} tadi sudah menyampaikan aspirasi, terima kasih. 
            Sekarang saya ajak {userName || 'Pak/Bu'} untuk mengisi Polling hari ini ya...
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm sm:text-base text-gray-500 font-medium">
              Pertanyaan {currentQuestion + 1} dari {pollingQuestions.length}
            </span>
            <div className="w-2/3 sm:w-1/2 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentQuestion + 1) / pollingQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-lg sm:text-xl mb-4 text-blue-800">{currentQ.question}</h4>
            
            <div className="space-y-3 sm:space-y-4">
              {currentQ && currentQ.options && currentQ.options.map((option, index) => (
                <label 
                  key={index}
                  className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 
                             ${answers[currentQ.id] === option.value ? 'bg-blue-100 border-blue-500 shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option.value}
                    checked={answers[currentQ.id] === option.value}
                    onChange={() => handleAnswerSelect(currentQ.id, option.value)}
                    className="mr-3 sm:mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="font-medium text-gray-800 text-base sm:text-lg">
                    <span className="mr-2 text-blue-700">[{option.value}]</span>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between pt-4 gap-3 sm:gap-0">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0 || isSubmitting}
              className="bg-gray-300 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-medium shadow-sm"
            >
              Sebelumnya
            </button>
            
            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id] || isSubmitting}
              className="bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-base font-medium shadow-md"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </span>
              ) : (
                currentQuestion === pollingQuestions.length - 1 ? 'Selesai' : 'Selanjutnya'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollingPublik;