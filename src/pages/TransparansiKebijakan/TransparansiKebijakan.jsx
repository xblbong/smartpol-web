import { Checkbox, Form, Input, Select } from "antd";
import ButtonComponent from "../../components/ButtonComponent";
import FooterComponent from "../../components/layouts/FooterComponent";
import HeaderPageComponent from "../../components/layouts/HeaderPageComponent";
import { NavbarDashboardComponent } from "../../components/layouts/NavbarDashboardComponent";
import PaginationComponent from "../../components/PaginationComponent";
import { useState } from "react";

function TransparansiKebijakan() {
  const authUser = { isWakilRakyat: true, isPimpinanDaerah: false };
  const isWakilRakyat = authUser?.isWakilRakyat;

  const [forumDiskusi, setForumDiskusi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dummy data kebijakan
  const currentStats = { total: 150, ruu: 25, disahkan: 100, pembahasan: 25 };
  const currentKebijakan = [
    {
      id: 1,
      jenis: "RUU",
      status: "dalam-pembahasan",
      judul: "RUU Perlindungan Data Pribadi",
      deskripsi:
        "RUU ini bertujuan memberikan landasan hukum yang kuat melindungi privasi data pribadi di era digital.",
      user: { wakilRakyatProfile: { nama_lengkap: "Dr. Siti Rahayu" } },
      instansi_terkait: "DPR-RI",
      tanggal_diajukan: new Date("2023-01-15"),
      tags: ["Data", "Digital", "Privasi"],
      posisi_dukungan: "Mendukung",
    },
    {
      id: 2,
      jenis: "Perda",
      status: "disahkan",
      judul: "Perda Pengelolaan Sampah",
      deskripsi:
        "Mengatur pengelolaan sampah berbasis masyarakat untuk lingkungan bersih.",
      user: null,
      instansi_terkait: "DPRD Jabar",
      tanggal_diajukan: new Date("2022-06-01"),
      tags: ["Lingkungan", "Kebersihan"],
      posisi_dukungan: "Mendukung",
    },
    {
      id: 3,
      jenis: "Keputusan",
      status: "diajukan",
      judul: "Subsidi Energi Terbarukan",
      deskripsi:
        "Keputusan memberi subsidi pengembangan energi terbarukan guna mendorong transisi energi nasional.",
      user: { wakilRakyatProfile: { nama_lengkap: "Ir. Budi Santoso" } },
      instansi_terkait: "Kementerian ESDM",
      tanggal_diajukan: new Date("2023-11-20"),
      tags: ["Energi", "Terbarukan"],
      posisi_dukungan: "Menolak",
    },
    {
      id: 4,
      jenis: "RUU",
      status: "diajukan",
      judul: "RUU Perubahan Iklim",
      deskripsi:
        "Membahas langkah-langkah adaptasi dan mitigasi perubahan iklim di Indonesia.",
      user: { wakilRakyatProfile: { nama_lengkap: "Dr. Siti Rahayu" } },
      instansi_terkait: "DPR-RI",
      tanggal_diajukan: new Date("2024-02-01"),
      tags: ["Iklim", "Lingkungan", "Global"],
      posisi_dukungan: "Mendukung",
    },
    {
      id: 5,
      jenis: "Perda",
      status: "dalam-pembahasan",
      judul: "Perda Tata Ruang Kota",
      deskripsi:
        "Mengatur zonasi dan pengembangan tata ruang untuk pembangunan berkelanjutan.",
      user: null,
      instansi_terkait: "DPRD DKI Jakarta",
      tanggal_diajukan: new Date("2023-09-10"),
      tags: ["Perkotaan", "Pembangunan"],
      posisi_dukungan: "Mendukung",
    },
    {
      id: 6,
      jenis: "Keputusan",
      status: "disahkan",
      judul: "Peningkatan Akses Pendidikan",
      deskripsi:
        "Keputusan untuk memperluas akses pendidikan berkualitas di seluruh wilayah.",
      user: { wakilRakyatProfile: { nama_lengkap: "Dr. Siti Rahayu" } },
      instansi_terkait: "Kementerian Pendidikan",
      tanggal_diajukan: new Date("2023-03-25"),
      tags: ["Pendidikan", "Sosial"],
      posisi_dukungan: "Mendukung",
    },
  ];

  const tagColors = [
    "bg-pink-100 text-pink-800",
    "bg-green-100 text-green-800",
    "bg-sky-100 text-sky-800",
    "bg-amber-100 text-amber-800",
    "bg-purple-100 text-purple-800",
  ];

  // Pagination dummy forum
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForums = forumDiskusi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(forumDiskusi.length / itemsPerPage); // This will be 0 if forumDiskusi is empty, which is fine for now as it's dummy.

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleFilter = (values) => {
    console.log("Filter submitted:", values);
    // bisa tambahkan logic filter data di sini
  };

  // Pagination for currentKebijakan
  const totalPolicyPages = Math.ceil(currentKebijakan.length / itemsPerPage);
  const currentPolicies = currentKebijakan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePolicyPageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPolicyPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <NavbarDashboardComponent />
      <HeaderPageComponent
        title=" Transparansi Kebijakan Publik"
        iconClassName="fas fa-file-alt"
        showManageProfile={false}
      />

      {/* content start */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Memahami Kebijakan Publik
            </h1>
            <p className="text-base sm:text-lg opacity-90 mb-5 sm:mb-6">
              Informasi RUU, kebijakan, dan peraturan terbaru dalam bahasa
              sederhana.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div
                className="rounded-xl p-3 sm:p-4 backdrop-filter backdrop-blur-sm"
                style={{ background: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="text-xl sm:text-2xl font-bold">
                  {currentStats.total}
                </div>
                <div className="text-xs sm:text-sm opacity-90">
                  Total Kebijakan
                </div>
              </div>
              <div
                className="rounded-xl p-3 sm:p-4 backdrop-filter backdrop-blur-sm"
                style={{ background: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="text-xl sm:text-2xl font-bold">
                  {currentStats.ruu}
                </div>
                <div className="text-xs sm:text-sm opacity-90">RUU Aktif</div>
              </div>
              <div
                className="rounded-xl p-3 sm:p-4 backdrop-filter backdrop-blur-sm"
                style={{ background: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="text-xl sm:text-2xl font-bold">
                  {currentStats.disahkan}
                </div>
                <div className="text-xs sm:text-sm opacity-90">Disahkan</div>
              </div>
              <div
                className="rounded-xl p-3 sm:p-4 backdrop-filter backdrop-blur-sm"
                style={{ background: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="text-xl sm:text-2xl font-bold">
                  {currentStats.pembahasan}
                </div>
                <div className="text-xs sm:text-sm opacity-90">
                  Dalam Pembahasan
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-end mb-8">
            {isWakilRakyat && (
              <ButtonComponent
                href="/transparansi-kebijakan/create"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-semibold transition duration-300 ease-in-out"
              >
                <i className="fas fa-plus mr-2"></i>
                Buat Kebijakan
              </ButtonComponent>
            )}
            <ButtonComponent
              href="/transparansi-kebijakan/ruu"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300 ease-in-out"
            >
              <i className="fas fa-file-alt mr-2"></i>
              RUU Terbaru
            </ButtonComponent>
            <ButtonComponent
              href="/transparansi-kebijakan/analisis"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-300 ease-in-out"
            >
              <i className="fas fa-chart-line mr-2"></i>
              Analisis & Ringkasan
            </ButtonComponent>
          </div>

          {/* Filter Form */}
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-5">
              Filter Kebijakan
            </h3>
            <Form layout="vertical" onFinish={handleFilter}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <Form.Item name="search" className="lg:col-span-2 ">
                  <Input
                    placeholder="Cari kebijakan, RUU, atau topik..."
                    className="h-10"
                  />
                </Form.Item>
                <Form.Item name="jenis" className="">
                  <Select placeholder="Semua Jenis" allowClear className="h-10">
                    <Select.Option value="RUU">RUU</Select.Option>
                    <Select.Option value="Perda">Perda</Select.Option>
                    <Select.Option value="Keputusan">Keputusan</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="status" className="">
                  <Select
                    placeholder="Semua Status"
                    allowClear
                    className="h-10"
                  >
                    <Select.Option value="diajukan">Diajukan</Select.Option>
                    <Select.Option value="dalam-pembahasan">
                      Dalam Pembahasan
                    </Select.Option>
                    <Select.Option value="disahkan">Disahkan</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="instansi">
                  <Select
                    placeholder="Semua Instansi"
                    allowClear
                    className="h-10"
                  >
                    <Select.Option value="DPR-RI">DPR-RI</Select.Option>
                    <Select.Option value="DPRD">DPRD</Select.Option>
                    <Select.Option value="Kementerian ESDM">
                      Kementerian ESDM
                    </Select.Option>
                    <Select.Option value="Kementerian Pendidikan">
                      Kementerian Pendidikan
                    </Select.Option>
                  </Select>
                </Form.Item>
                <ButtonComponent
                  type="submit"
                  className="w-full h-10 sm:w-auto px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300 ease-in-out"
                >
                  <i class="fas fa-search mr-2"></i>
                  Cari
                </ButtonComponent>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {authUser && (
                  <Form.Item
                    name="my_posts"
                    valuePropName="checked"
                    className=""
                  >
                    <Checkbox className="text-gray-700">
                      Tampilkan Kebijakan Saya
                    </Checkbox>
                  </Form.Item>
                )}
              </div>
            </Form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <a href="/transparansi-kebijakan/ruu" className="group">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <div className="flex items-center">
                  <div className="rounded-lg p-3 mr-4" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                    {/* Menggunakan kelas Font Awesome langsung */}
                    <i className="fas fa-file-alt text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">RUU Terbaru</h3>
                    <p className="text-sm opacity-90">
                      Rancangan Undang-Undang
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a href="/transparansi-kebijakan/analisis" className="group">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <div className="flex items-center">
                  <div className="rounded-lg p-3 mr-4" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                    {/* Menggunakan kelas Font Awesome langsung */}
                    <i className="fas fa-chart-line text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Analisis & Ringkasan
                    </h3>
                    <p className="text-sm opacity-90">
                      Penjelasan mudah dipahami
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a
              href="/transparansi-kebijakan?status=dalam-pembahasan"
              className="group"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <div className="flex items-center">
                  <div className="rounded-lg p-3 mr-4" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                    {/* Menggunakan kelas Font Awesome langsung */}
                    <i className="fas fa-gavel text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Sedang Dibahas</h3>
                    <p className="text-sm opacity-90">Kebijakan dalam proses</p>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* List Kebijakan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPolicies.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {item.jenis}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {item.status === "dalam-pembahasan"
                      ? "Dalam Pembahasan"
                      : item.status === "disahkan"
                      ? "Disahkan"
                      : "Diajukan"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.judul}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.deskripsi}
                </p>
                {item.user && (
                  <p className="text-sm text-gray-700 flex items-center mb-3">
                    <i className="fas fa-user-circle mr-2 text-blue-500"></i>
                    {item.user.wakilRakyatProfile.nama_lengkap}
                  </p>
                )}
                <p className="text-sm text-gray-700 flex items-center mb-3">
                  <i className="fas fa-building mr-2 text-gray-500"></i>
                  {item.instansi_terkait}
                </p>
                <p className="text-sm text-gray-700 flex items-center mb-4">
                  <i className="fas fa-calendar-alt mr-2 text-red-400"></i>
                  {item.tanggal_diajukan.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 text-xs rounded-full ${
                        tagColors[idx % tagColors.length]
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Policy Pagination */}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPolicyPages}
            onPageChange={handlePolicyPageChange}
            activeClass="bg-blue-600 text-white"
            inactiveClass="bg-gray-100 text-gray-700 hover:bg-gray-200"
          />
        </div>
      </section>
      {/* content end */}
      <FooterComponent />
    </>
  );
}

export default TransparansiKebijakan;
