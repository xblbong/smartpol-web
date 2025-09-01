import { useState } from "react";
import ButtonComponent from "../../components/ButtonComponent";
import FooterComponent from "../../components/layouts/FooterComponent";
import { NavbarDashboardComponent } from "../../components/layouts/NavbarDashboardComponent";

// Mock useAuth hook
const useAuth = () => ({
  user: { name: "John Doe", role: { display_name: "Admin" } },
  isAuthenticated: true,
  isWakilRakyatOrPimpinanDaerah: true
});

// Dummy data for stats
const dummyStats = {
  total: 45,
  aktif: 12,
  survei: 28,
  polling: 17
};

// Dummy data for survei polling
const dummySurveiPolling = [
  {
    id: 1,
    judul: "Survei Kepuasan Layanan Publik 2024",
    deskripsi: "Survei untuk mengevaluasi tingkat kepuasan masyarakat terhadap layanan publik yang diberikan pemerintah daerah.",
    tipe: "survei",
    status: "aktif",
    tanggal_mulai: "2024-01-15",
    tanggal_selesai: "2024-02-15",
    jumlah_responden: 1250,
    target_responden: 2000,
    penyelenggara: "DPRD DKI Jakarta",
    kategori: "Layanan Publik"
  },
  {
    id: 2,
    judul: "Polling Kebijakan Transportasi Umum",
    deskripsi: "Polling untuk mengetahui preferensi masyarakat terkait pengembangan sistem transportasi umum di Jakarta.",
    tipe: "polling",
    status: "aktif",
    tanggal_mulai: "2024-01-20",
    tanggal_selesai: "2024-01-30",
    jumlah_responden: 850,
    target_responden: 1000,
    penyelenggara: "DPR-RI",
    kategori: "Transportasi"
  },
  {
    id: 3,
    judul: "Survei Pendapat RUU Kesehatan",
    deskripsi: "Survei untuk mengumpulkan masukan masyarakat terkait draft RUU Kesehatan yang sedang dibahas.",
    tipe: "survei",
    status: "selesai",
    tanggal_mulai: "2023-12-01",
    tanggal_selesai: "2023-12-31",
    jumlah_responden: 3200,
    target_responden: 3000,
    penyelenggara: "DPR-RI",
    kategori: "Kesehatan"
  },
  {
    id: 4,
    judul: "Polling Anggaran Pendidikan 2024",
    deskripsi: "Polling untuk mengetahui prioritas alokasi anggaran pendidikan menurut masyarakat.",
    tipe: "polling",
    status: "draft",
    tanggal_mulai: "2024-02-01",
    tanggal_selesai: "2024-02-28",
    jumlah_responden: 0,
    target_responden: 1500,
    penyelenggara: "DPRD Jawa Barat",
    kategori: "Pendidikan"
  }
];

function SurveyPolling() {
  const { user, isAuthenticated, isWakilRakyatOrPimpinanDaerah } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [surveiData, setSurveiData] = useState(dummySurveiPolling); // State for dummy data
  const [filters, setFilters] = useState({
    search: "",
    tipe: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuickFilter = (key, value) => {
    setFilters({
      search: "",
      tipe: "",
      status: "",
      [key]: value,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would fetch data based on filters here
    console.log("Applying filters:", filters);
    // For dummy data, we'll just filter in memory
    const filteredData = dummySurveiPolling.filter((item) => {
      const matchesSearch =
        item.judul.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(filters.search.toLowerCase());
      const matchesTipe = filters.tipe === "" || item.tipe === filters.tipe;
      const matchesStatus =
        filters.status === "" || item.status === filters.status;
      return matchesSearch && matchesTipe && matchesStatus;
    });
    setSurveiData(filteredData);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "selesai":
        return "bg-blue-100 text-blue-800";
      case "ditutup":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "aktif":
        return "fa-play-circle";
      case "draft":
        return "fa-edit";
      case "selesai":
        return "fa-check-circle";
      case "ditutup":
        return "fa-times-circle";
      default:
        return "fa-info-circle";
    }
  };

  // Simulate `isActive()` method for dummy data
  const isActive = (item) => item.status === "aktif";
  return (
    <>
      <NavbarDashboardComponent />
      {/* content start */}
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-[#1e3a8a] to-[#f97316] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-[#f97316] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-0 right-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-6 backdrop-blur-sm">
                <i className="fas fa-chart-bar text-[#f97316] mr-2"></i>
                <span className="text-sm font-medium text-white">
                  Platform Survei & Polling
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Survei & Polling
                <span className="text-[#f97316]"> Publik</span>
              </h1>

              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
                Berpartisipasilah dalam survei dan polling yang diselenggarakan
                oleh DPR-RI, DPRD, dan Pimpinan Daerah untuk memberikan masukan
                pada proses legislasi dan pengambilan keputusan.
              </p>

              <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
                <a href="#survei-section">
                  <ButtonComponent className="bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center">
                    <i className="fas fa-play mr-2"></i>
                    Mulai Berpartisipasi
                  </ButtonComponent>
                </a>
                <a href="#statistik">
                  <ButtonComponent className="border-2 border-white text-white hover:bg-white hover:text-[#1e3a8a] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center">
                    <i className="fas fa-chart-line mr-2"></i>
                    Lihat Statistik
                  </ButtonComponent>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div
          className="container mx-auto px-4 -mt-12 relative z-20"
          id="statistik"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#1e3a8a] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-poll-h text-white text-2xl"></i>
              </div>
              <div className="text-4xl font-bold text-[#1e3a8a] mb-2">
                {dummyStats.total}
              </div>
              <div className="text-gray-600 font-medium">
                Total Survei & Polling
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-play-circle text-white text-2xl"></i>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {dummyStats.aktif}
              </div>
              <div className="text-gray-600 font-medium">Sedang Aktif</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-clipboard-list text-white text-2xl"></i>
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {dummyStats.survei}
              </div>
              <div className="text-gray-600 font-medium">Survei</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#f97316] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-vote-yea text-white text-2xl"></i>
              </div>
              <div className="text-4xl font-bold text-[#f97316] mb-2">
                {dummyStats.polling}
              </div>
              <div className="text-gray-600 font-medium">Polling</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16" id="survei-section">
          {/* Filter and Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center mr-4">
                <i className="fas fa-filter text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Filter & Pencarian
                </h2>
                <p className="text-gray-600">
                  Temukan survei dan polling yang sesuai dengan minat Anda
                </p>
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Cari survei/polling..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-tag text-gray-400"></i>
                  </div>
                  <select
                    name="tipe"
                    value={filters.tipe}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Semua Tipe</option>
                    <option value="survei">Survei</option>
                    <option value="polling">Polling</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-info-circle text-gray-400"></i>
                  </div>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="draft">Draft</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditutup">Ditutup</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <ButtonComponent
                    type="submit"
                    className="w-full h-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg"
                  >
                    <i className="fas fa-search mr-2"></i>Filter
                  </ButtonComponent>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                <ButtonComponent
                  onClick={() => handleQuickFilter("", "")}
                  className={`px-6 py-3 rounded-full text-sm font-medium ${
                    !filters.tipe && !filters.status
                      ? "bg-[#1e3a8a] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-th-large mr-2"></i>
                  Semua
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => handleQuickFilter("status", "aktif")}
                  className={`px-6 py-3 rounded-full text-sm font-medium ${
                    filters.status === "aktif"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-play-circle mr-2"></i>
                  Sedang Aktif
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => handleQuickFilter("tipe", "survei")}
                  className={`px-6 py-3 rounded-full text-sm font-medium ${
                    filters.tipe === "survei"
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-clipboard-list mr-2"></i>
                  Survei
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => handleQuickFilter("tipe", "polling")}
                  className={`px-6 py-3 rounded-full text-sm font-medium ${
                    filters.tipe === "polling"
                      ? "bg-[#f97316] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-vote-yea mr-2"></i>
                  Polling
                </ButtonComponent>
                {isAuthenticated && isWakilRakyatOrPimpinanDaerah && (
                  <ButtonComponent
                    onClick={() => handleQuickFilter("my_posts", "1")} // Needs actual implementation for 'my_posts'
                    className={`px-6 py-3 rounded-full text-sm font-medium ${
                      filters.my_posts === "1"
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <i className="fas fa-user-edit mr-2"></i>
                    Survei/Polling Saya
                  </ButtonComponent>
                )}
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          {isAuthenticated && isWakilRakyatOrPimpinanDaerah && (
            <div className="mb-8">
              <ButtonComponent className="px-8 py-4">
                <i className="fas fa-plus"></i>
                Buat Survei/Polling Baru
              </ButtonComponent>
            </div>
          )}

          {/* Survei & Polling Grid */}
          {surveiData.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-poll-h text-gray-300 text-5xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Belum Ada Survei atau Polling
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {filters.search || filters.tipe || filters.status
                    ? "Tidak ada survei atau polling yang sesuai dengan filter Anda."
                    : "Belum ada survei atau polling yang tersedia saat ini."}
                </p>
                {isAuthenticated && isWakilRakyatOrPimpinanDaerah && (
                  <ButtonComponent className="px-8 py-4">
                    <i className="fas fa-plus mr-2"></i>
                    Buat Survei/Polling Pertama
                  </ButtonComponent>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {surveiData.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        item.tipe === 'survei' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        <i className={`fas ${
                          item.tipe === 'survei' ? 'fa-clipboard-list' : 'fa-vote-yea'
                        } mr-2`}></i>
                        {item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1)}
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(item.status)}`}>
                        <i className={`fas ${getStatusIcon(item.status)} mr-2`}></i>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors duration-200">
                      {item.judul}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Penyelenggara:</span>
                        <span className="font-medium text-gray-900">{item.penyelenggara}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Kategori:</span>
                        <span className="font-medium text-gray-900">{item.kategori}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Periode:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress:</span>
                          <span className="font-medium text-gray-900">
                            {item.jumlah_responden}/{item.target_responden} responden
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#1e3a8a] to-[#f97316] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((item.jumlah_responden / item.target_responden) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {Math.round((item.jumlah_responden / item.target_responden) * 100)}% tercapai
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      {isActive(item) ? (
                        <ButtonComponent 
                          className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                        >
                          <i className="fas fa-play mr-2"></i>
                          Ikut Berpartisipasi
                        </ButtonComponent>
                      ) : (
                        <div className="flex items-center space-x-3 w-full">
                          <ButtonComponent 
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                          >
                            <i className="fas fa-eye mr-2"></i>
                            Lihat Hasil
                          </ButtonComponent>
                          {item.status === 'draft' && isAuthenticated && isWakilRakyatOrPimpinanDaerah && (
                            <ButtonComponent 
                              className="flex-1 bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                            >
                              <i className="fas fa-edit mr-2"></i>
                              Edit
                            </ButtonComponent>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* content end */}
      <FooterComponent />
    </>
  );
}

export default SurveyPolling;
