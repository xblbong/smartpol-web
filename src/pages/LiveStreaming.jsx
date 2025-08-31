import React from "react";
import NavbarComponent from "../components/layouts/NavbarComponent";
import { NavbarDashboardComponent } from "../components/layouts/NavbarDashboardComponent";
import FooterComponent from "../components/layouts/FooterComponent";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../components/ButtonComponent";

function LiveStreaming() {
  // Mengganti nama variabel dummy menjadi yang akan digunakan
  const authUser = { isWakilRakyat: true, isPimpinanDaerah: false };
  const liveStreams = [];
  const upcomingStreams = [];
  const recentStreams = [];

  const navigate = useNavigate();

  // Helper function to check user roles, sekarang menggunakan `authUser` yang benar
  const isWakilRakyatOrPimpinanDaerah =
    authUser && (authUser.isWakilRakyat || authUser.isPimpinanDaerah);

  const getTypeDisplayName = (stream) =>
    stream.type.charAt(0).toUpperCase() + stream.type.slice(1); // Simple example, replace with actual logic
  const getStatusDisplayName = (stream) =>
    stream.status.charAt(0).toUpperCase() + stream.status.slice(1); // Simple example, replace with actual logic
  const getDuration = (stream) => "01:30:00";

  return (
    <>
      <NavbarDashboardComponent />
      {/* content start */}
      <section className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-r from-[#1e3a8a] to-[#f97316] text-white py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-[#f97316] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-0 right-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-6 backdrop-blur-sm">
                <i className="fas fa-video text-[#f97316] mr-2"></i>
                <span className="text-sm font-medium text-white">
                  Platform Live Streaming
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Live Streaming
                <span className="text-[#f97316]"> Interaktif</span>
              </h1>

              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Saksikan siaran langsung rapat dewan, dialog warga, dan
                berpartisipasi dalam Q&A interaktif untuk transparansi maksimal
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonComponent
                  onClick={() => navigate("#live-section")} // Placeholder for scrolling, adjust if using react-scroll or similar
                  className="w-full sm:w-auto bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center justify-center"
                >
                  <i className="fas fa-play mr-2"></i>
                  Tonton Sekarang
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => navigate("#upcoming-section")} // Placeholder for scrolling
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#1e3a8a] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 whitespace-nowrap flex items-center justify-center"
                >
                  <i className="fas fa-calendar mr-2"></i>
                  Jadwal Mendatang
                </ButtonComponent>
              </div>

              {isWakilRakyatOrPimpinanDaerah && (
                <div className="mt-8">
                  <ButtonComponent
                    onClick={() => navigate("/live-streaming/create")}
                    className="inline-flex items-center px-8 py-4 bg-white text-[#1e3a8a] font-bold rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
                  >
                    <i className="fas fa-plus mr-3 text-lg"></i>
                    Buat Live Streaming
                  </ButtonComponent>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Sedang Live Section */}
          {liveStreams.length > 0 && (
            <div className="mb-12 md:mb-16" id="live-section">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Sedang Live
                    </h2>
                    <p className="text-gray-600">
                      Siaran langsung yang sedang berlangsung saat ini
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {liveStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-200 hover:border-red-300 overflow-hidden group"
                  >
                    <div className="relative">
                      {stream.thumbnail ? (
                        <img
                          src={stream.thumbnail}
                          alt={stream.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-[#1e3a8a] to-[#f97316] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <i className="fas fa-video text-white text-5xl"></i>
                        </div>
                      )}

                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                          LIVE
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                          <i className="fas fa-eye mr-2 text-red-400"></i>
                          {new Intl.NumberFormat().format(stream.viewers_count)}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-[#1e3a8a] transition-colors duration-300 line-clamp-2">
                        {stream.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                        {stream.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                          {getTypeDisplayName(stream)}
                        </span>
                        <span className="font-medium text-right truncate">
                          {stream.user.name}
                        </span>
                      </div>

                      <ButtonComponent
                        onClick={() => navigate(`/live-streaming/${stream.id}`)}
                        className="block w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-center py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg group-hover:scale-105"
                      >
                        <i className="fas fa-play mr-2"></i>Tonton Sekarang
                      </ButtonComponent>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Akan Datang Section */}
          {upcomingStreams.length > 0 && (
            <div className="mb-12 md:mb-16" id="upcoming-section">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-clock text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Akan Datang
                  </h2>
                  <p className="text-gray-600">
                    Jadwal live streaming yang akan segera dimulai
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#1e3a8a]/20 overflow-hidden group"
                  >
                    <div className="relative">
                      {stream.thumbnail ? (
                        <img
                          src={stream.thumbnail}
                          alt={stream.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <i className="fas fa-video text-white text-5xl"></i>
                        </div>
                      )}

                      <div className="absolute top-4 left-4">
                        <span className="bg-[#1e3a8a] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          {getStatusDisplayName(stream)}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                          <div className="text-sm font-medium text-gray-900">
                            <i className="fas fa-calendar mr-2 text-[#1e3a8a]"></i>
                            {new Date(stream.scheduled_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}{" "}
                            WIB
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-[#1e3a8a] transition-colors duration-300 line-clamp-2">
                        {stream.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                        {stream.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                          {getTypeDisplayName(stream)}
                        </span>
                        <span className="font-medium text-right truncate">
                          {stream.user.name}
                        </span>
                      </div>

                      <ButtonComponent
                        onClick={() => navigate(`/live-streaming/${stream.id}`)}
                        className="block w-full bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1e3a8a] text-white text-center py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg group-hover:scale-105"
                      >
                        <i className="fas fa-info-circle mr-2"></i>Lihat Detail
                      </ButtonComponent>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rekaman Terbaru Section */}
          {recentStreams.length > 0 && (
            <div className="mb-12 md:mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-history text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Rekaman Terbaru
                  </h2>
                  <p className="text-gray-600">
                    Live streaming yang telah selesai dan dapat ditonton ulang
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-300 overflow-hidden group"
                  >
                    <div className="relative">
                      {stream.thumbnail ? (
                        <img
                          src={stream.thumbnail}
                          alt={stream.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <i className="fas fa-video text-white text-5xl"></i>
                        </div>
                      )}

                      <div className="absolute top-4 left-4">
                        <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          <i className="fas fa-check-circle mr-2"></i>Selesai
                        </span>
                      </div>

                      {getDuration(stream) && (
                        <div className="absolute bottom-4 right-4">
                          <span className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                            <i className="fas fa-clock mr-2"></i>
                            {getDuration(stream)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-[#1e3a8a] transition-colors duration-300 line-clamp-2">
                        {stream.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                        {stream.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                          {getTypeDisplayName(stream)}
                        </span>
                        <span className="font-medium text-right truncate">
                          {stream.user.name}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-calendar mr-2 text-gray-500"></i>
                        <span className="font-medium">
                          {new Date(stream.ended_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}{" "}
                          WIB
                        </span>
                      </div>

                      <ButtonComponent
                        onClick={() => navigate(`/live-streaming/${stream.id}`)}
                        className="block w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-center py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg group-hover:scale-105"
                      >
                        <i className="fas fa-play mr-2"></i>Tonton Ulang
                      </ButtonComponent>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Live Streams Message */}
          {liveStreams.length === 0 &&
            upcomingStreams.length === 0 &&
            recentStreams.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-video text-gray-300 text-5xl"></i>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Belum Ada Live Streaming
                  </h3>
                  <p className="text-gray-600 mb-8 text-base sm:text-lg">
                    Saat ini belum ada live streaming yang tersedia. Silakan cek
                    kembali nanti.
                  </p>

                  {isWakilRakyatOrPimpinanDaerah && (
                    <ButtonComponent
                      onClick={() => navigate("/live-streaming/create")}
                      className="inline-flex items-center px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <i className="fas fa-plus mr-3 text-lg"></i>
                      Buat Live Streaming Pertama
                    </ButtonComponent>
                  )}
                </div>
              </div>
            )}
        </div>
      </section>
      {/* content end */}
      <FooterComponent />
    </>
  );
}

export default LiveStreaming;
