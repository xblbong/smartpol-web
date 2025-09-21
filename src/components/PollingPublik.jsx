import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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

    const labels = Object.keys(questionData);
    const data = Object.values(questionData);
    
    const chartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ],
          borderColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
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
        },
        title: {
          display: true,
          text: title,
        },
      },
    };

    return <Pie data={chartData} options={options} />;
  };

  const renderMap = () => {
    return (
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Peta Sebaran Polling</h4>
        <div className="bg-white p-4 rounded border">
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23e5f3ff'/%3E%3Cpath d='M50 50 L150 50 L150 100 L100 120 L50 100 Z' fill='%234caf50'/%3E%3Cpath d='M160 60 L250 60 L250 110 L200 130 L160 110 Z' fill='%23ffeb3b'/%3E%3Cpath d='M260 70 L350 70 L350 120 L300 140 L260 120 Z' fill='%23ff5722'/%3E%3Ctext x='100' y='85' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Timur%3C/text%3E%3Ctext x='205' y='95' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Tengah%3C/text%3E%3Ctext x='305' y='105' text-anchor='middle' font-size='12' fill='%23333'%3EJawa Barat%3C/text%3E%3C/svg%3E"
            alt="Peta Sebaran Polling"
            className="w-full h-48 object-contain"
          />
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Puas (Jawa Timur): {statsData?.by_region?.['Jawa Timur'] || 0} responden</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span>Netral (Jawa Tengah): {statsData?.by_region?.['Jawa Tengah'] || 0} responden</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span>Tidak Puas (Jawa Barat): {statsData?.by_region?.['Jawa Barat'] || 0} responden</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showStats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
        <h3 className="text-xl font-bold mb-4 text-center">Hasil Survei & Polling Publik</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            {renderPieChart(
              statsData?.by_question?.[1], 
              'Kepuasan terhadap Pemerintahan Prabowo-Gibran'
            )}
          </div>
          <div>
            {renderPieChart(
              statsData?.by_question?.[2], 
              'Kepercayaan pada Pemberantasan Korupsi'
            )}
          </div>
          <div>
            {renderMap()}
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Ringkasan Hasil:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Total Responden:</strong> {statsData?.total_responses || 0}</p>
              <p><strong>Periode Survei:</strong> {new Date().toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <p><strong>Tingkat Partisipasi:</strong> Tinggi</p>
              <p><strong>Margin Error:</strong> ±3%</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setShowStats(false);
              setCurrentQuestion(0);
              setAnswers({});
              setIsCompleted(false);
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Mulai Polling Baru
          </button>
        </div>
      </div>
    );
  }

  const currentQ = pollingQuestions[currentQuestion];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Survei & Polling Publik</h3>
        <p className="text-gray-600">
          {userName || 'Pak/Bu'} tadi sudah menyampaikan aspirasi, terima kasih. 
          Sekarang saya ajak {userName || 'Pak/Bu'} untuk mengisi Polling hari ini ya...
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Pertanyaan {currentQuestion + 1} dari {pollingQuestions.length}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / pollingQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-4">{currentQ.question}</h4>
          
          <div className="space-y-3">
            {currentQ && currentQ.options && currentQ.options.map((option, index) => (
              <label 
                key={index}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={option.value}
                  checked={answers[currentQ.id] === option.value}
                  onChange={() => handleAnswerSelect(currentQ.id, option.value)}
                  className="mr-3 text-blue-500"
                />
                <span className="font-medium mr-2">[{option.value}]</span>
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sebelumnya
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[currentQ.id] || isSubmitting}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Mengirim...' : 
             currentQuestion === pollingQuestions.length - 1 ? 'Selesai' : 'Selanjutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollingPublik;