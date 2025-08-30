import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js v3+

const CategoryDistributionChart = ({ statisticsData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // To store the Chart.js instance

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart if it exists
      }

      const ctx = chartRef.current.getContext('2d');

      let labels = ['Infrastruktur', 'Lingkungan', 'Ekonomi', 'Pendidikan', 'Kesehatan'];
      let data = [27.4, 23.0, 21.2, 15.9, 12.5];
      const backgroundColors = ['#3b82f6', '#22c55e', '#f59e0b', '#10b981', '#ef4444']; // Tailwind colors

      if (statisticsData && statisticsData.by_category) {
        labels = [];
        data = [];
        Object.keys(statisticsData.by_category).forEach((category) => {
          labels.push(category.charAt(0).toUpperCase() + category.slice(1));
          data.push(statisticsData.by_category[category].percentage || 0);
        });
      }

      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColors,
              borderWidth: 2,
              borderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  family: 'Inter, sans-serif', // Ensure font consistency
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null) {
                    label += context.parsed + '%';
                  }
                  return label;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Cleanup on component unmount
      }
    };
  }, [statisticsData]); // Re-run effect if statisticsData changes

  const displayData = [
    { label: 'Infrastruktur', percentage: '27.4%', color: 'blue', icon: 'fas fa-road' },
    { label: 'Lingkungan', percentage: '23.0%', color: 'green', icon: 'fas fa-leaf' },
    { label: 'Ekonomi', percentage: '21.2%', color: 'yellow', icon: 'fas fa-chart-line' },
    { label: 'Pendidikan', percentage: '15.9%', color: 'green', icon: 'fas fa-graduation-cap' },
    { label: 'Kesehatan', percentage: '12.5%', color: 'red', icon: 'fas fa-heartbeat' },
  ];

  return (
    <section className="mb-16">
      <div className="container bg-white rounded-2xl p-6 shadow-lg" data-aos="fade-up">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
          <i className="fas fa-chart-pie text-blue-600 mr-3"></i>
          Distribusi Aspirasi per Kategori
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative h-72 sm:h-96" data-aos="fade-right" data-aos-delay="100">
            <canvas id="categoryChart" ref={chartRef}></canvas>
          </div>
          <div className="space-y-4" data-aos="fade-left" data-aos-delay="200">
            {displayData.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 bg-${item.color}-50 rounded-lg`}>
                <div className="flex items-center">
                  <i className={`${item.icon} text-${item.color}-600 mr-3`}></i>{' '}
                  <span className="text-gray-800">{item.label}</span>{' '}
                </div>{' '}
                <span className={`font-bold text-${item.color}-600`}>{item.percentage}</span>{' '}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryDistributionChart;