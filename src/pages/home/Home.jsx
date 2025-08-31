import { useState } from "react";
import HeaderHomeComponent from "../../components/layouts/HeaderComponent";
import NavbarComponent from "../../components/layouts/NavbarComponent";
import MapSectionComponent from "../../components/MapSectionComponent";
import CategoryDistributionChart from "../../components/CategoryDistributionChart";
import FooterComponent from "../../components/layouts/FooterComponent";

const Home = () => {
  const stats = [
    {
      label: "Total Aspirasi",
      value: "1,247",
      icon: "fas fa-comments",
      color: "blue",
    },
    {
      label: "Ditindaklanjuti",
      value: "892",
      icon: "fas fa-check-circle",
      color: "green",
    },
    {
      label: "Dalam Proses",
      value: "255",
      icon: "fas fa-clock",
      color: "orange",
    },
    {
      label: "Wilayah Aktif",
      value: "57",
      icon: "fas fa-map-marker-alt",
      color: "purple",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    {
      name: "Semua",
      key: "all",
      icon: "fas fa-globe",
      count: "1,247",
      color: "gray",
    },
    {
      name: "Infrastruktur",
      key: "infrastruktur",
      icon: "fas fa-road",
      count: "342",
      color: "blue",
    },
    {
      name: "Pendidikan",
      key: "pendidikan",
      icon: "fas fa-graduation-cap",
      count: "198",
      color: "green",
    },
    {
      name: "Kesehatan",
      key: "kesehatan",
      icon: "fas fa-heartbeat",
      count: "156",
      color: "red",
    },
    {
      name: "Lingkungan",
      key: "lingkungan",
      icon: "fas fa-leaf",
      count: "287",
      color: "green",
    },
    {
      name: "Ekonomi",
      key: "ekonomi",
      icon: "fas fa-chart-line",
      count: "264",
      color: "yellow",
    },
  ];

  const handleFilterClick = (categoryKey) => {
    setActiveCategory(categoryKey);
    // onFilterChange(categoryKey);
  };

  // about section
  const features = [
    {
      icon: "fas fa-map-marked-alt",
      title: "Visualisasi Geografis",
      description:
        "Menampilkan aspirasi masyarakat dalam bentuk peta interaktif untuk memudahkan analisis spasial",
    },
    {
      icon: "fas fa-filter",
      title: "Filter Kategori",
      description:
        "Memfilter aspirasi berdasarkan kategori seperti infrastruktur, pendidikan, kesehatan, dan lainnya",
    },
    {
      icon: "fas fa-chart-bar",
      title: "Analisis Data",
      description:
        "Menyediakan statistik dan analisis mendalam tentang pola aspirasi masyarakat per wilayah",
    },
  ];

  return (
    <>
      <HeaderHomeComponent
        image="/images/kota-malang.jpg"
        title="Web GIS Kota Malang"
        description="Sistem Informasi Geografis untuk Data KPU, Pemetaan Wilayah, dan Analisis Pemilu Kota Malang"
      />
      
      <NavbarComponent />

      <section id="statistik" className="mb-16">
        <div className="container text-center pt-12 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            <i className="fas fa-chart-pie text-blue-600 mr-3"></i>
            Statistik Aspirasi Masyarakat
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Data terkini aspirasi dan isu yang disampaikan masyarakat Kota
            Malang
          </p>
        </div>
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`stat-card bg-white rounded-2xl p-6 shadow-lg border-l-4 border-${stat.color}-500`}
            >
              <div className="flex items-center">
                <div className={`bg-${stat.color}-100 rounded-full p-3 mr-4`}>
                  <i
                    className={`${stat.icon} text-${stat.color}-600 text-xl`}
                  ></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="kategori" className="mb-8">
        <div className="container bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-filter text-blue-600 mr-3"></i>
            Filter Kategori Aspirasi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className={`category-filter border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${
                  activeCategory === cat.key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleFilterClick(cat.key)}
              >
                <i
                  className={`${cat.icon} text-2xl ${
                    cat.color === "gray"
                      ? "text-gray-600"
                      : `text-${cat.color}-600`
                  } mb-2`}
                ></i>
                <p className="text-sm font-semibold text-gray-700">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-500">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MapSectionComponent />
      <CategoryDistributionChart />

      <section id="tentang" className="mb-16">
        <div
          className="container bg-gradient-to-r from-blue-600 to-blue-800  rounded-2xl p-8 text-white"
          data-aos="fade-up"
        >
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <i className="fas fa-info-circle mr-3"></i>
              Tentang Peta Aspirasi Interaktif
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div
                    className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <i className={`${feature.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FooterComponent />
    </>
  );
};

export default Home;
