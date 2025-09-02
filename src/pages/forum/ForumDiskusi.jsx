import { useEffect, useState } from "react";
import FooterComponent from "../../components/layouts/FooterComponent";
import { NavbarDashboardComponent } from "../../components/layouts/NavbarDashboardComponent";
import HeaderPageComponent from "../../components/layouts/HeaderPageComponent";
import FilterComponent from "../../components/FilterComponent";
import PaginationComponent from "../../components/PaginationComponent";
import QuickNavs from "../../components/QuickNavs";
import ForumCard from "../../components/ForumCard";

const dummyForums = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1543269865-cbf427fdc87e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    judul: "Masa Depan Demokrasi Digital: Tantangan dan Peluang",
    deskripsi:
      "Diskusi mendalam tentang bagaimana teknologi digital memengaruhi praktik demokrasi dan partisipasi warga di era modern. Kami akan membahas isu-isu seperti disinformasi, privasi data, dan potensi e-voting.",
    jenis: "webinar",
    status: "terjadwal",
    tanggal_mulai: "2023-11-20T14:00:00Z",
    narasumber: "Dr. Ahmad Sucipto",
    kapasitas_peserta: 100,
    jumlah_peserta: 35,
    created_by: 1,
    isRegistered: false,
  },
  {
    id: 2,
    thumbnail: null,
    judul: "Peran Pemuda dalam Pembangunan Politik Berkelanjutan",
    deskripsi:
      "Materi edukasi interaktif yang membahas pentingnya keterlibatan pemuda dalam merumuskan dan melaksanakan kebijakan politik yang berpihak pada keberlanjutan lingkungan dan sosial.",
    jenis: "materi edukasi",
    status: "selesai",
    tanggal_mulai: "2023-10-15T10:00:00Z",
    narasumber: "Budi Santoso, S.Sos",
    kapasitas_peserta: null,
    jumlah_peserta: null,
    created_by: 2,
    isRegistered: false,
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1596526131078-05244005b637?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    judul: "Reformasi Birokrasi dan Pelayanan Publik di Era Disrupsi",
    deskripsi:
      "Diskusi publik tentang tantangan dan inovasi dalam reformasi birokrasi untuk meningkatkan efisiensi dan kualitas pelayanan publik di tengah perubahan yang cepat.",
    jenis: "diskusi publik",
    status: "berlangsung",
    tanggal_mulai: "2023-11-10T09:00:00Z",
    narasumber: "Prof. Dr. Siti Aminah",
    kapasitas_peserta: 50,
    jumlah_peserta: 45,
    created_by: 1,
    isRegistered: true,
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1620391294862-211c47087612?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    judul: "Etika Politik dan Pencegahan Korupsi",
    deskripsi:
      "Webinar yang mengupas tuntas pentingnya etika dalam berpolitik dan strategi efektif untuk mencegah tindakan korupsi di berbagai level pemerintahan.",
    jenis: "webinar",
    status: "terjadwal",
    tanggal_mulai: "2023-12-01T19:00:00Z",
    narasumber: "Dr. Rizal Malik",
    kapasitas_peserta: 120,
    jumlah_peserta: 10,
    created_by: 3,
    isRegistered: false,
  },
];

// Simulasi user yang sedang login
const mockAuthUser = {
  id: 1,
  name: "John Doe",
};


// Komponen Utama Forum Diskusi
function ForumDiskusi() {
  const [forumDiskusi, setForumDiskusi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const authUser = mockAuthUser;

  // Default filter
  const defaultFilters = {
    search: "",
    jenis: "",
    status: "",
    creator: "",
  };

  const [filterState, setFilterState] = useState(defaultFilters);

  // Ambil forum setiap kali filterState berubah
  useEffect(() => {
    const fetchForums = () => {
      let filteredForums = dummyForums;

      if (filterState.search) {
        filteredForums = filteredForums.filter(
          (forum) =>
            forum.judul
              .toLowerCase()
              .includes(filterState.search.toLowerCase()) ||
            forum.deskripsi
              .toLowerCase()
              .includes(filterState.search.toLowerCase())
        );
      }
      if (filterState.jenis) {
        filteredForums = filteredForums.filter(
          (forum) => forum.jenis === filterState.jenis
        );
      }
      if (filterState.status) {
        filteredForums = filteredForums.filter(
          (forum) => forum.status === filterState.status
        );
      }
      if (authUser && filterState.creator === "mine") {
        filteredForums = filteredForums.filter(
          (forum) => forum.created_by === authUser.id
        );
      }

      setForumDiskusi(filteredForums);
      setCurrentPage(1);
    };

    fetchForums();
  }, [filterState, authUser]);

  const handleFilterChange = (newFilters) => {
    setFilterState(newFilters);
  };

  const handleResetFilters = () => {
    setFilterState(defaultFilters);
  };

  const handleRegister = (forumId) => {
    if (!authUser) {
      alert("Anda harus login untuk mendaftar forum.");
      return;
    }
    setForumDiskusi((prevForums) =>
      prevForums.map((forum) =>
        forum.id === forumId
          ? {
              ...forum,
              isRegistered: true,
              jumlah_peserta: forum.jumlah_peserta + 1,
            }
          : forum
      )
    );
    alert(`Anda berhasil mendaftar forum ID: ${forumId}`);
  };

  const handleEdit = (forumId) => {
    alert(`Mengedit forum ID: ${forumId}`);
  };

  const handleDelete = (forumId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus forum ini?")) {
      setForumDiskusi((prevForums) =>
        prevForums.filter((forum) => forum.id !== forumId)
      );
      alert(`Forum ID: ${forumId} telah dihapus.`);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForums = forumDiskusi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(forumDiskusi.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Konfigurasi field untuk FilterComponent
  const filterFields = [
    {
      name: "search",
      type: "text",
      placeholder: "Cari forum diskusi...",
      colSpan: "sm:col-span-2 md:col-span-3 lg:col-span-1",
    },
    {
      name: "jenis",
      type: "select",
      options: [
        { value: "", label: "Semua Jenis" },
        { value: "webinar", label: "Webinar" },
        { value: "diskusi publik", label: "Diskusi Publik" },
        { value: "materi edukasi", label: "Materi Edukasi" },
      ],
    },
    {
      name: "status",
      type: "select",
      options: [
        { value: "", label: "Semua Status" },
        { value: "terjadwal", label: "Terjadwal" },
        { value: "berlangsung", label: "Berlangsung" },
        { value: "selesai", label: "Selesai" },
      ],
    },
    {
      name: "creator",
      type: "select",
      options: [
        { value: "", label: "Semua Forum" },
        { value: "mine", label: "Forum Saya" },
      ],
    },
  ];

  //Quick navs data
  const quickNavsData = [
    {
      route: "/forum-diskusi/webinar",
      className: "bg-gradient-to-br from-indigo-500 to-purple-600",
      icon: "fa-video",
      title: "Webinar",
      desc: "Seminar online interaktif",
    },
    {
      route: "/forum-diskusi/diskusi-publik",
      className: "bg-gradient-to-br from-emerald-500 to-teal-600",
      icon: "fa-comments",
      title: "Diskusi Publik",
      desc: "Forum diskusi terbuka",
    },
    {
      route: "/forum-diskusi/materi-edukasi",
      className: "bg-gradient-to-br from-amber-500 to-orange-600",
      icon: "fa-graduation-cap",
      title: "Materi Edukasi",
      desc: "Video & infografis politik",
    },
  ];
  return (
    <>
      <NavbarDashboardComponent />
      <HeaderPageComponent
        title="Forum Diskusi & Pendidikan Politik"
        iconClass="fas fa-users" // <-- typo diperbaiki
        showManageProfile={false}
        manageProfileText="Kelola Profil Saya"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-8 mt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang di Forum Diskusi
          </h1>
          <p className="text-md text-gray-600">
            Temukan berbagai forum diskusi dan materi edukasi politik yang
            menarik.
          </p>
          <p className="text-sm text-gray-500">
            Gunakan fitur pencarian dan filter untuk menemukan forum yang sesuai
            dengan minat Anda.
          </p>
        </div>

        <FilterComponent
          title="Cari Forum Sesuai Minat Anda"
          filters={filterState}
          onFilterChange={setFilterState}
          onResetFilters={handleResetFilters}
          fields={filterFields}
        />

        {authUser && (
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-start mb-6">
            <a
              href="/forum-diskusi/create"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i>
              <span>Buat Forum Baru</span>
            </a>
            <button
              onClick={() =>
                setFilterState({
                  ...filterState,
                  creator: filterState.creator === "mine" ? "" : "mine",
                })
              }
              className={`w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center ${
                filterState.creator === "mine" ? "ring-2 ring-green-300" : ""
              }`}
            >
              <i className="fas fa-user mr-2"></i>
              <span>Forum Saya</span>
            </button>
          </div>
        )}

        {authUser && filterState.creator === "mine" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-user-check text-green-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Anda sedang melihat forum diskusi yang Anda buat.
                  <button
                    onClick={handleResetFilters}
                    className="font-bold underline hover:text-green-900 ml-1"
                  >
                    Lihat semua forum
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        <QuickNavs items={quickNavsData} moreText="Jelajahi" />

        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Kumpulan Forum
          </h3>
          {currentForums.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentForums.map((forum) => (
                  <ForumCard
                    key={forum.id}
                    forum={forum}
                    authUser={authUser}
                    onRegister={handleRegister}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                activeClass="bg-blue-600 text-white"
                inactiveClass="bg-gray-100 text-gray-700 hover:bg-gray-200"
              />
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
              <i className="fas fa-comments text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Belum Ada Forum Diskusi
              </h3>
              <p className="text-gray-500 mb-6">
                Saat ini belum ada forum diskusi yang sesuai dengan kriteria
                pencarian Anda.
              </p>
              {authUser && (
                <a
                  href="/forum-diskusi/create"
                  className="inline-block bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  <i className="fas fa-plus mr-2"></i>Buat Forum Pertama
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <FooterComponent />
    </>
  );
}

export default ForumDiskusi;
