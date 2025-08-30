import ButtonComponent from "../ButtonComponent";

const HeaderHomeComponent = () => {
  return (
    <header className="gradient-bg text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/images/kota-malang.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(0.2px) brightness(0.7)",
          transform: "scale(1.1)",
            zIndex: -1,
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full p-4" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
              <i className="fas fa-map-marked-alt text-4xl text-white"></i>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Web GIS Kota Malang
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Sistem Informasi Geografis untuk Data KPU, Pemetaan Wilayah, dan
            Analisis Pemilu Kota Malang
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonComponent
              type="primary"
              href="#peta"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <i className="fas fa-map mr-2"></i>
              Lihat Peta
            </ButtonComponent>
            <ButtonComponent
              href="#statistik"
              className="glass-effect text-white border-1 border-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <i className="fas fa-chart-bar mr-2"></i>
              Statistik KPU
            </ButtonComponent>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderHomeComponent;
