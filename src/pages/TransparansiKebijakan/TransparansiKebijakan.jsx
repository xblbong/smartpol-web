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
  const totalPages = Math.ceil(forumDiskusi.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleFilter = (values) => {
    console.log("Filter submitted:", values);
    // bisa tambahkan logic filter data di sini
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
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 sm:p-8 mb-8 text-white shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              Memahami Kebijakan Publik
            </h1>
            <p className="text-base sm:text-lg opacity-90 mb-6">
              Informasi RUU, kebijakan, dan peraturan terbaru dalam bahasa
              sederhana.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="text-2xl font-bold">{currentStats.total}</div>
                <div className="text-sm opacity-90">Total Kebijakan</div>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="text-2xl font-bold">{currentStats.ruu}</div>
                <div className="text-sm opacity-90">RUU Aktif</div>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="text-2xl font-bold">
                  {currentStats.disahkan}
                </div>
                <div className="text-sm opacity-90">Disahkan</div>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <div className="text-2xl font-bold">
                  {currentStats.pembahasan}
                </div>
                <div className="text-sm opacity-90">Dalam Pembahasan</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-end mb-8">
            {isWakilRakyat && (
              <ButtonComponent
                href="/transparansi-kebijakan/create"
                className="px-5 py-2 gap-2 flex items-center rounded-md bg-blue-800 hover:bg-blue-900 text-white"
              >
                <i className="fas fa-plus"></i>
                Buat Kebijakan
              </ButtonComponent>
            )}
            <ButtonComponent
              href="/transparansi-kebijakan/ruu"
              className="px-5 py-2 gap-2 flex items-center rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              <i className="fas fa-file-alt"></i>
              RUU Terbaru
            </ButtonComponent>
            <ButtonComponent
              href="/transparansi-kebijakan/analisis"
              className="px-5 py-2 gap-2 flex items-center rounded-md bg-green-600 hover:bg-green-700 text-white"
            >
              <i className="fas fa-chart-line"></i>
              Analisis & Ringkasan
            </ButtonComponent>
          </div>
          {/* Filter Form */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
            <h3 className="text-lg font-semibold mb-4">Filter Kebijakan</h3>
            <Form layout="vertical" onFinish={handleFilter} className="w-full">
              <div className="flex flex-col md:flex-row gap-x-4 items-stretch">
                <Form.Item name="search" className="flex-1">
                  <Input
                    placeholder="Cari kebijakan, RUU, atau topik..."
                    className="!h-11 w-full !text-base !rounded-lg"
                  />
                </Form.Item>

                <Form.Item name="jenis" className="flex-1">
                  <Select
                    placeholder="Semua Jenis"
                    allowClear
                    className="!h-11 w-full !text-base !rounded-lg flex-1"
                  >
                    <Select.Option value="RUU">RUU</Select.Option>
                    <Select.Option value="Perda">Perda</Select.Option>
                    <Select.Option value="Keputusan">Keputusan</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="status" className="flex-1">
                  <Select
                    placeholder="Semua Status"
                    allowClear
                    className="!h-11 w-full !text-base !rounded-lg flex-1"
                  >
                    <Select.Option value="diajukan">Diajukan</Select.Option>
                    <Select.Option value="dalam-pembahasan">
                      Dalam Pembahasan
                    </Select.Option>
                    <Select.Option value="disahkan">Disahkan</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="instansi" className="flex-1">
                  <Select
                    placeholder="Semua Instansi"
                    allowClear
                    className="!h-11 w-full !text-base !rounded-lg flex-1"
                  >
                    <Select.Option value="DPR-RI">DPR-RI</Select.Option>
                    <Select.Option value="DPRD">DPRD</Select.Option>
                  </Select>
                </Form.Item>

                <ButtonComponent
                  type="submit"
                  className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-6 !h-11 !w-44 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center !text-base"
                >
                  Cari
                </ButtonComponent>
              </div>
                {authUser && (
                  <Form.Item
                    name="my_posts"
                    valuePropName="checked"
                    className="flex items-center"
                  >
                    <Checkbox className="!text-base">Kebijakan Saya</Checkbox>
                  </Form.Item>
                )}
            </Form>
          </div>

          {/* List Kebijakan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentKebijakan.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {item.jenis}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.judul}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{item.deskripsi}</p>
                {item.user && (
                  <p className="text-sm text-gray-700">
                    <i className="fas fa-user mr-2 text-blue-500"></i>
                    {item.user.wakilRakyatProfile.nama_lengkap}
                  </p>
                )}
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

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
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
