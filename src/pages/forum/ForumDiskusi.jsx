import { useEffect, useState } from "react";
import FooterComponent from "../../components/layouts/FooterComponent";
import { NavbarDashboardComponent } from "../../components/layouts/NavbarDashboardComponent";
import HeaderPageComponent from "../../components/layouts/HeaderPageComponent";
import { faL } from "@fortawesome/free-solid-svg-icons";

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
    jenis: "materi_edukasi",
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
    jenis: "diskusi_publik",
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

// Helper function untuk mendapatkan badge class
const getBadgeClass = (type, value) => {
  if (type === "status") {
    switch (value) {
      case "terjadwal":
        return "bg-blue-100 text-blue-800";
      case "berlangsung":
        return "bg-green-100 text-green-800";
      case "selesai":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  } else if (type === "jenis") {
    switch (value) {
      case "webinar":
        return "bg-purple-100 text-purple-800";
      case "diskusi_publik":
        return "bg-yellow-100 text-yellow-800";
      case "materi_edukasi":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  return "";
};

// Komponen Card Forum
const ForumCard = ({ forum, authUser, onRegister, onEdit, onDelete }) => {
  const isCreator = authUser && forum.created_by === authUser.id;
  const isRegistered = authUser && forum.isRegistered;
  const hasAvailableSlots =
    forum.kapasitas_peserta === null ||
    forum.jumlah_peserta < forum.kapasitas_peserta;
  const canRegister =
    authUser &&
    !isCreator &&
    !isRegistered &&
    hasAvailableSlots &&
    ["terjadwal", "berlangsung"].includes(forum.status);

  const forumDate = forum.tanggal_mulai ? new Date(forum.tanggal_mulai) : null;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
      {forum.thumbnail ? (
        <div
          className="h-48 bg-cover bg-center rounded-t-xl"
          style={{ backgroundImage: `url('${forum.thumbnail}')` }}
        ></div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center rounded-t-xl">
          <i
            className={`fas fa-${
              forum.jenis === "webinar"
                ? "video"
                : forum.jenis === "diskusi_publik"
                ? "comments"
                : "graduation-cap"
            } text-5xl text-white`}
          ></i>
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${getBadgeClass(
              "status",
              forum.status
            )}`}
          >
            <i className="fas fa-circle text-xs"></i>
            {forum.status.charAt(0).toUpperCase() + forum.status.slice(1)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${getBadgeClass(
              "jenis",
              forum.jenis
            )}`}
          >
            {forum.jenis.replace("_", " ").charAt(0).toUpperCase() +
              forum.jenis.slice(1)}
          </span>
          {isCreator && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              <i className="fas fa-user"></i>
              <span>Forum Saya</span>
            </span>
          )}
        </div>

        <h3 className="capitalize text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
          {forum.judul}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {forum.deskripsi}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {forumDate && (
            <div className="flex items-center">
              <i className="fas fa-calendar w-4 mr-2 text-center text-gray-400"></i>
              <span>
                {forumDate.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                ,{" "}
                {forumDate.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {forum.narasumber && (
            <div className="flex items-center">
              <i className="fas fa-user-tie w-4 mr-2 text-center text-gray-400"></i>
              <span>{forum.narasumber}</span>
            </div>
          )}
          {forum.kapasitas_peserta && (
            <div className="flex items-center">
              <i className="fas fa-users w-4 mr-2 text-center text-gray-400"></i>
              <span>
                {forum.jumlah_peserta}/{forum.kapasitas_peserta} peserta
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              {authUser && (
                <>
                  {isCreator ? (
                    <>
                      <button
                        onClick={() => onEdit(forum.id)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-xs transition duration-300 flex items-center"
                      >
                        <i className="fas fa-edit mr-1"></i>Edit
                      </button>
                      <button
                        onClick={() => onDelete(forum.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-xs transition duration-300 flex items-center"
                      >
                        <i className="fas fa-trash mr-1"></i>Hapus
                      </button>
                    </>
                  ) : (
                    <>
                      {isRegistered ? (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <i className="fas fa-check-circle mr-1"></i>Terdaftar
                        </span>
                      ) : (
                        canRegister && (
                          <button
                            onClick={() => onRegister(forum.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-300 flex items-center"
                          >
                            <i className="fas fa-plus-circle mr-1"></i>Daftar
                          </button>
                        )
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <a
              href={`/forum-diskusi/${forum.id}`}
              className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition duration-300 flex items-center justify-center"
            >
              <span>Lihat Detail</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Form Filter
const ForumFilterForm = ({
  filters,
  onFilterChange,
  onResetFilters,
  authUser,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika submit filter, karena state sudah diupdate
    // Jika ingin melakukan fetch data di sini, panggil fungsi fetch
  };

  return (
    <div className="bg-white overflow-hidden shadow-md rounded-xl mb-8">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Cari Forum Sesuai Minat Anda
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end"
        >
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <label htmlFor="search" className="sr-only">
              Cari Forum
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Cari forum diskusi..."
              className="w-full rounded-lg border-gray-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
            />
          </div>
          <div>
            <label htmlFor="jenis" className="sr-only">
              Jenis
            </label>
            <select
              id="jenis"
              name="jenis"
              value={filters.jenis}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
            >
              <option value="">Semua Jenis</option>
              <option value="webinar">Webinar</option>
              <option value="diskusi_publik">Diskusi Publik</option>
              <option value="materi_edukasi">Materi Edukasi</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="sr-only">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
            >
              <option value="">Semua Status</option>
              <option value="terjadwal">Terjadwal</option>
              <option value="berlangsung">Berlangsung</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          {authUser && (
            <div>
              <label htmlFor="creator" className="sr-only">
                Pembuat
              </label>
              <select
                id="creator"
                name="creator"
                value={filters.creator}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
              >
                <option value="">Semua Forum</option>
                <option value="mine">Forum Saya</option>
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            <button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <i className="fas fa-search mr-2"></i>
              <span>Filter</span>
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <i className="fas fa-times mr-2"></i>
                <span>Reset</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Komponen Navigasi
const QuickNavs = () => {
  const quickNavsData = [
    {
      route: "/forum-diskusi/webinar",
      gradient: "from-indigo-500 to-purple-600",
      icon: "fa-video",
      title: "Webinar",
      desc: "Seminar online interaktif",
    },
    {
      route: "/forum-diskusi/diskusi-publik",
      gradient: "from-emerald-500 to-teal-600",
      icon: "fa-comments",
      title: "Diskusi Publik",
      desc: "Forum diskusi terbuka",
    },
    {
      route: "/forum-diskusi/materi-edukasi",
      gradient: "from-amber-500 to-orange-600",
      icon: "fa-graduation-cap",
      title: "Materi Edukasi",
      desc: "Video & infografis politik",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {quickNavsData.map((nav, index) => (
        <a key={index} href={nav.route} className="group block relative">
          <div className="relative bg-gradient-to-br transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl rounded-xl p-6 text-white overflow-hidden">
            <div
              className={`absolute right-4 text-8xl text-white opacity-20 transform rotate-[-15deg]`}
            >
              <i className={`fas ${nav.icon}`}></i>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold">{nav.title}</h3>
              <p className="text-sm opacity-90 mt-1">{nav.desc}</p>
              <div className="flex items-center text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Lihat Selengkapnya</span>
                <i className="fas fa-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

// Komponen Paginasi
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === page
              ? "bg-[#1e3a8a] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
};

// Komponen Utama Forum Diskusi
function ForumDiskusi() {
  const [forumDiskusi, setForumDiskusi] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    jenis: "",
    status: "",
    creator: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Jumlah forum per halaman

  const authUser = mockAuthUser;

  useEffect(() => {
    // Simulasi fetching data dengan filter
    const fetchForums = () => {
      let filteredForums = dummyForums;

      if (filters.search) {
        filteredForums = filteredForums.filter(
          (forum) =>
            forum.judul.toLowerCase().includes(filters.search.toLowerCase()) ||
            forum.deskripsi.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.jenis) {
        filteredForums = filteredForums.filter(
          (forum) => forum.jenis === filters.jenis
        );
      }
      if (filters.status) {
        filteredForums = filteredForums.filter(
          (forum) => forum.status === filters.status
        );
      }
      if (authUser && filters.creator === "mine") {
        filteredForums = filteredForums.filter(
          (forum) => forum.created_by === authUser.id
        );
      }

      setForumDiskusi(filteredForums);
      setCurrentPage(1); // Reset halaman ke 1 setiap kali filter berubah
    };

    fetchForums();
  }, [filters, authUser]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      jenis: "",
      status: "",
      creator: "",
    });
  };

  const handleRegister = (forumId) => {
    if (!authUser) {
      alert("Anda harus login untuk mendaftar forum.");
      return;
    }
    // Implementasi logika pendaftaran (misalnya, update state atau panggil API)
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

  // Logika Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForums = forumDiskusi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(forumDiskusi.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <NavbarDashboardComponent />
      <HeaderPageComponent
        title="Forum Diskusi & Pendidikan Politik"
        iconClassclassName="fas fa-users"
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

        <ForumFilterForm
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          authUser={authUser}
        />

        {authUser && (
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-start mb-6">
            <a
              href="/forum-diskusi/create" // Ganti dengan route React yang sesuai
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i>
              <span>Buat Forum Baru</span>
            </a>
            <button
              onClick={() =>
                handleFilterChange({
                  ...filters,
                  creator: filters.creator === "mine" ? "" : "mine",
                })
              }
              className={`w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center ${
                filters.creator === "mine" ? "ring-2 ring-green-300" : ""
              }`}
            >
              <i className="fas fa-user mr-2"></i>
              <span>Forum Saya</span>
            </button>
          </div>
        )}

        {authUser && filters.creator === "mine" && (
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

        <QuickNavs />

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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
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
                  href="/forum-diskusi/create" // Ganti dengan route React yang sesuai
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
