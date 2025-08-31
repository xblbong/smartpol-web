import HeaderPageComponent from "../components/layouts/HeaderPageComponent";
import { NavbarDashboardComponent } from "../components/layouts/NavbarDashboardComponent";
import FooterComponent from "../components/layouts/FooterComponent";
import { useEffect, useState } from "react";

function ProfilWakilRakyat() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [wakilRakyat, setWakilRakyat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data wakil rakyat
  const dummyWakilRakyat = [
    {
      id: 1,
      name: "Budi Santoso",
      role: { name: "dpr-ri" },
      wakilRakyatProfile: {
        foto_profil: "https://via.placeholder.com/80",
        partai: "Partai Harapan Bangsa",
        daerah_pemilihan: "DKI Jakarta III",
      },
    },
    {
      id: 2,
      name: "Siti Aminah",
      role: { name: "dprd" },
      wakilRakyatProfile: {
        foto_profil: null, // Tanpa foto profil
        partai: "Partai Kebangkitan Nasional",
        daerah_pemilihan: "Jawa Barat I",
      },
    },
    {
      id: 3,
      name: "Agus Salim",
      role: { name: "pimpinan-daerah" },
      wakilRakyatProfile: {
        foto_profil: "https://via.placeholder.com/80/FF5733/FFFFFF",
        partai: "Partai Persatuan Indonesia",
        daerah_pemilihan: "Surabaya",
      },
    },
    {
      id: 4,
      name: "Dewi Lestari",
      role: { name: "dpr-ri" },
      wakilRakyatProfile: {
        foto_profil: "https://via.placeholder.com/80/33FF57/FFFFFF",
        partai: "Partai Demokrasi",
        daerah_pemilihan: "Banten II",
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    const filteredWakilRakyat = dummyWakilRakyat.filter((wakil) => {
      const matchesSearch = wakil.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRole =
        role === "" || (wakil.role && wakil.role.name === role);
      return matchesSearch && matchesRole;
    });
    setTimeout(() => {
      setWakilRakyat(filteredWakilRakyat);
      setLoading(false);
    }, 500);
  }, [search, role]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleResetFilter = () => {
    setSearch("");
    setRole("");
  };

  // Pagination dummy
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(wakilRakyat.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWakilRakyat = wakilRakyat.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <NavbarDashboardComponent />
      <HeaderPageComponent
        title="Daftar Wakil Rakyat"
        iconClassclassName="fas fa-users"
        showManageProfile={true}
        manageProfileLink="/wakil-rakyat/profile"
        manageProfileText="Kelola Profil Saya"
      />
      <section>
        <div className="py-12 bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Filter Pencarian */}
            <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100">
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-6 flex items-center">
                  <i className="fas fa-filter mr-3 text-[#f97316]"></i>
                  Filter Pencarian
                </h3>
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                  <div className="lg:col-span-2">
                    <label
                      htmlFor="search"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Nama Wakil Rakyat
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        name="search"
                        id="search"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Cari berdasarkan nama..."
                        className="w-full py-2 pl-10 rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-[#1e3a8a] focus:ring focus:ring-[#1e3a8a] focus:ring-opacity-50 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Jabatan
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={role}
                      onChange={handleRoleChange}
                      className="w-full  p-2 rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-[#1e3a8a] focus:ring focus:ring-[#1e3a8a] focus:ring-opacity-50 transition-colors"
                    >
                      <option value="">Semua Jabatan</option>
                      <option value="dpr-ri">DPR RI</option>
                      <option value="dprd">DPRD</option>
                      <option value="pimpinan-daerah">Pimpinan Daerah</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="submit"
                      onClick={(e) => e.preventDefault()} // Mencegah reload halaman
                      className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      Cari
                    </button>
                    <button
                      type="button"
                      title="Reset Filter"
                      onClick={handleResetFilter}
                      className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-bold transition-colors"
                    >
                       <i className="fas fa-sync-alt"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Daftar Wakil Rakyat */}
            <div className="bg-transparent">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Memuat data...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 sm:py-16 px-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="text-red-500/50 text-7xl sm:text-8xl mb-4">
                    <i className="fa-solid fa-user-slash"></i>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Terjadi Kesalahan
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Maaf, kami tidak dapat memuat data saat ini. Silakan coba
                    lagi nanti.
                  </p>
                </div>
              ) : currentWakilRakyat.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentWakilRakyat.map((wakil) => (
                      <div
                        key={wakil.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-transparent hover:border-[#1e3a8a] flex flex-col transition-all duration-300 transform hover:-translate-y-2 group"
                      >
                        <div className="p-6 flex-grow">
                          <div className="flex items-center mb-5">
                            {wakil.wakilRakyatProfile &&
                            wakil.wakilRakyatProfile.foto_profil ? (
                              <img
                                src={wakil.wakilRakyatProfile.foto_profil}
                                alt={wakil.name}
                                className="w-20 h-20 rounded-full object-cover mr-5 border-4 border-gray-100 shadow-sm"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 to-gray-100 flex items-center justify-center mr-5 flex-shrink-0 border-4 border-gray-100 shadow-sm">
                                <span className="text-[#f97316] text-3xl font-bold">
                                  {wakil.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="overflow-hidden">
                              <h3 className="font-bold text-xl text-[#1e3a8a] truncate group-hover:text-[#f97316] transition-colors">
                                {wakil.name}
                              </h3>
                              <p className="text-sm text-gray-500 capitalize">
                                {wakil.role
                                  ? wakil.role.name.replace("-", " ")
                                  : "Tidak ada role"}
                              </p>
                            </div>
                          </div>

                          {wakil.wakilRakyatProfile && (
                            <ul className="space-y-3 text-sm text-gray-600 mb-6 pl-2">
                              {wakil.wakilRakyatProfile.partai && (
                                <li className="flex items-center gap-2">
                                  <i class="fa-solid fa-map-pin"></i>
                                  <span className="font-semibold text-gray-800">
                                    {wakil.wakilRakyatProfile.partai}
                                  </span>
                                </li>
                              )}
                              {wakil.wakilRakyatProfile.daerah_pemilihan && (
                                <li className="flex items-center gap-2">
                                  <i className="fa-solid fa-map-location-dot"></i>
                                  {wakil.wakilRakyatProfile.daerah_pemilihan}
                                </li>
                              )}
                            </ul>
                          )}
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 rounded-b-2xl">
                          <a
                            href={`/wakil-rakyat/${wakil.id}`}
                            className="block w-full text-center bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            Lihat Profil Lengkap
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          {/* Heroicon "chevron-left" */}
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            aria-current={
                              currentPage === i + 1 ? "page" : undefined
                            }
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === i + 1
                                ? "z-10 bg-[#1e3a8a] border-[#1e3a8a] text-gray-900"
                                : "text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          {/* Heroicon "chevron-right" */}
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 sm:py-16 px-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="text-[#1e3a8a]/20 text-7xl sm:text-8xl mb-4">
                    <i className="fa-solid fa-users-slash"></i>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Pencarian Tidak Ditemukan
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Maaf, kami tidak dapat menemukan wakil rakyat yang cocok
                    dengan kriteria Anda. Coba reset filter atau periksa kembali
                    kata kunci Anda.
                  </p>
                  <button
                    onClick={handleResetFilter}
                    className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <i className="fa-solid fa-rotate"></i>
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <FooterComponent />
    </>
  );
}

export default ProfilWakilRakyat;
