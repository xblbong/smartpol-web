import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ButtonComponent from './ButtonComponent';
// import 'leaflet.markercluster'; // Untuk marker clustering
// import 'leaflet.heat'; // Untuk heatmap

// Fix default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const dummyAspirasiData = [
  {
    id: 1,
    lat: -7.9666,
    lng: 112.6326,
    title: 'Perbaikan Jalan Berlubang',
    category: 'infrastruktur',
    status: 'proses',
    description: 'Jalan di sekitar Jl. Raya Langsep banyak yang berlubang.',
  },
  {
    id: 2,
    lat: -7.9804,
    lng: 112.6105,
    title: 'Kekurangan Tenaga Pengajar',
    category: 'pendidikan',
    status: 'baru',
    description: 'Sekolah dasar di Lowokwaru kekurangan guru kelas.',
  },
  {
    id: 3,
    lat: -7.945,
    lng: 112.65,
    title: 'Sampah Menumpuk di Sungai',
    category: 'lingkungan',
    status: 'selesai',
    description: 'Banyak sampah plastik di aliran sungai dekat Jodipan.',
  },
  {
    id: 4,
    lat: -7.97,
    lng: 112.68,
    title: 'Peningkatan Pelayanan Puskesmas',
    category: 'kesehatan',
    status: 'proses',
    description: 'Antrian panjang dan kurangnya dokter di Puskesmas Blimbing.',
  },
  {
    id: 5,
    lat: -8.00,
    lng: 112.59,
    title: 'Pelatihan UMKM Digital',
    category: 'ekonomi',
    status: 'baru',
    description:
      'Warga di Sukun membutuhkan pelatihan untuk pemasaran produk online.',
  },
  {
    id: 6,
    lat: -7.95,
    lng: 112.63,
    title: 'Lampung PJU Mati',
    category: 'infrastruktur',
    status: 'baru',
    description:
      'Beberapa lampu penerangan jalan umum di daerah Dieng mati total.',
  },
];

const MapSectionComponent = ({ currentFilter }) => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const aspirasiMarkersLayer = useRef(L.layerGroup());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeLayers, setActiveLayers] = useState({}); // { heatmap: false, cluster: false, ...}

  const categoryColors = {
    infrastruktur: '#3b82f6',
    pendidikan: '#10b981',
    kesehatan: '#ef4444',
    lingkungan: '#22c55e',
    ekonomi: '#f59e0b',
    all: '#6b7280', // bawaan color for 'all' or undefined
  };

  useEffect(() => {
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([-7.9666, 112.6326], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap.current);
      aspirasiMarkersLayer.current.addTo(leafletMap.current);
    }

    addAspirasiMarkers(currentFilter);

    // Cleanup function
    return () => {
      // If you want to destroy the map on unmount
      // leafletMap.current?.remove();
      // leafletMap.current = null;
    };
  }, [currentFilter]);

  const addAspirasiMarkers = (filter) => {
    aspirasiMarkersLayer.current.clearLayers(); // Clear existing markers

    const filteredData =
      filter === 'all'
        ? dummyAspirasiData
        : dummyAspirasiData.filter((item) => item.category === filter);

    filteredData.forEach((aspirasi) => {
      const markerHtml = `
        <div className="aspirasi-marker" style="background-color: ${
          categoryColors[aspirasi.category] || categoryColors['all']
        }; width: 24px; height: 24px;"></div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-aspirasi-icon',
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([aspirasi.lat, aspirasi.lng], { icon: customIcon })
        .bindPopup(
          `<div className="aspirasi-popup font-sans">
            <h4 className="font-bold text-lg mb-1">${aspirasi.title}</h4>
            <p className="text-sm text-gray-700 mb-2">${aspirasi.description}</p>
            <p className="text-xs text-gray-500">Kategori: <span className="font-semibold" style="color: ${
              categoryColors[aspirasi.category] || categoryColors['all']
            };">${aspirasi.category}</span></p>
            <p className="text-xs text-gray-500">Status: <span className="font-semibold text-orange-500">${
              aspirasi.status
            }</span></p>
          </div>`
        )
        .addTo(aspirasiMarkersLayer.current);
    });
  };

  const handleToggleLayer = (layerName) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
    // Implement actual Leaflet layer toggling logic here
    console.log(`Toggle ${layerName}: ${!activeLayers[layerName]}`);
    // Example for a hypothetical heatmap layer:
    // if (layerName === 'heat') {
    //   if (!activeLayers.heat) {
    //     const heatData = dummyAspirasiData.map(item => [item.lat, item.lng, 0.5]); // lat, lng, intensity
    //     const heatLayer = L.heatLayer(heatData).addTo(leafletMap.current);
    //     // Store heatLayer reference to remove later
    //   } else {
    //     // Remove heat layer
    //   }
    // }
  };

  const resetMap = () => {
    leafletMap.current.setView([-7.9666, 112.6326], 12);
    aspirasiMarkersLayer.current.clearLayers();
    addAspirasiMarkers('all'); // Reset filter
    setActiveLayers({}); // Reset all layer toggles
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      leafletMap.current.invalidateSize();
    }, 300); // Re-render map after CSS transition
  };

  return (
    <section id="peta" className="mb-16">
      <div className="container text-center mb-8 pt-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          <i className="fas fa-map-marked-alt text-blue-600 mr-3"></i>
          Peta Aspirasi Interaktif Kota Malang
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Eksplorasi aspirasi masyarakat berdasarkan lokasi dan kategori
        </p>
      </div>

      <div className="container bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <ButtonComponent
              onClick={() => handleToggleLayer('heat')}
              className={`layer-toggle bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 flex-grow sm:flex-grow-0 ${
                activeLayers.heat ? 'active' : ''
              }`}
            >
              {' '}
              <i className="fas fa-fire"></i> <span>Heat Map</span>{' '}
            </ButtonComponent>
            <ButtonComponent
              onClick={() => handleToggleLayer('cluster')}
              className={`layer-toggle bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 flex-grow sm:flex-grow-0 ${
                activeLayers.cluster ? 'active' : ''
              }`}
            >
              {' '}
              <i className="fas fa-layer-group"></i> <span>Cluster</span>{' '}
            </ButtonComponent>
            <ButtonComponent
              onClick={() => handleToggleLayer('kecamatan')}
              className={`layer-toggle bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 flex-grow sm:flex-grow-0 ${
                activeLayers.kecamatan ? 'active' : ''
              }`}
            >
              {' '}
              <i className="fas fa-border-all"></i> <span>Wilayah</span>{' '}
            </ButtonComponent>
            <ButtonComponent
              onClick={() => handleToggleLayer('density')}
              className={`layer-toggle bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 flex-grow sm:flex-grow-0 ${
                activeLayers.density ? 'active' : ''
              }`}
            >
              {' '}
              <i className="fas fa-chart-area"></i> <span>Kepadatan</span>{' '}
            </ButtonComponent>
          </div>

          <div className="container flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-auto flex-grow">
              <input
                type="text"
                id="search-location"
                placeholder="Cari lokasi atau aspirasi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="flex gap-3">
              <ButtonComponent
                onClick={toggleFullscreen}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex-grow whitespace-nowrap"
              >
                {' '}
                <i
                  className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} mr-2`}
                ></i>{' '}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}{' '}
              </ButtonComponent>
              <ButtonComponent
                onClick={resetMap}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex-grow"
              >
                {' '}
                <i className="fas fa-undo mr-2"></i> Reset{' '}
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`map-container container  mb-16 bg-white rounded-2xl shadow-lg h-[450px] md:h-[600px] ${
          isFullscreen ? 'fullscreen-map' : ''
        }`}
      >
        <div id="map" ref={mapRef} style={{ height: '100%', width: '100%', zIndex: 1 }}></div>
        {isFullscreen && (
          <div className="fullscreen-controls">
            <ButtonComponent onClick={toggleFullscreen} className="fullscreen-exit-btn">
              <i className="fas fa-times mr-2"></i>Exit Fullscreen
            </ButtonComponent>
          </div>
        )}
      </div>
    </section>
  );
};

export default MapSectionComponent;