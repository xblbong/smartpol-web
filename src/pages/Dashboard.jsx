import FooterComponent from "../components/layouts/FooterComponent"
import { NavbarDashboardComponent } from "../components/layouts/NavbarDashboardComponent"

function Dashboard({ user }) {
  return (
    <>
      <NavbarDashboardComponent />
      {/* Content start*/}
      <main>
            <section className="relative min-h-screen flex items-center bg-white overflow-hidden py-20 lg:py-0">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-[#1e3a8a] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-0 right-4 w-72 h-72 bg-[#f97316] rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-gray-900 text-center lg:text-left">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 mb-6">
                                <i className="fas fa-tachometer-alt text-[#f97316] mr-2"></i>
                                <span className="text-sm font-medium text-gray-700">Dashboard Pribadi</span>
                            </div>

                            {user ? (
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                                    Selamat Datang,
                                    <span className="text-[#f97316] capitalize">{user.name}</span>
                                    <br />
                                    <span className="text-[#1e3a8a]">di SMARTPOL UB</span>
                                </h1>
                            ) : (
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                                    Selamat Datang
                                    <br />
                                    <span className="text-[#1e3a8a]">di SMARTPOL UB</span>
                                </h1>
                            )}

                            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Akses semua fitur platform demokrasi digital. Sampaikan aspirasi, pantau kebijakan,
                                dan berpartisipasi aktif dalam proses demokrasi.
                            </p>

                            {user && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                        <div className="text-lg sm:text-2xl font-bold text-[#1e3a8a] mb-1 truncate">{user.username}</div>
                                        <div className="text-sm text-gray-500">Username Anda</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                        <div className="text-lg sm:text-2xl font-bold text-[#f97316] mb-1">{user.role?.display_name ?? 'User'}</div>
                                        <div className="text-sm text-gray-500">Role Anda</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                        <div className="text-lg sm:text-2xl font-bold text-[#1e3a8a] mb-1">{new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                        <div className="text-sm text-gray-500">Bergabung Sejak</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a href="#fitur" className="inline-block">
                                    <button className="w-full sm:w-auto bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center justify-center">
                                        <i className="fas fa-rocket mr-2"></i>
                                        Jelajahi Fitur
                                    </button>
                                </a>
                                <a href="/kotak-aspirasi" className="inline-block">
                                    <button className="w-full sm:w-auto border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg whitespace-nowrap transition-all duration-300 flex items-center justify-center">
                                        <i className="fas fa-envelope mr-2"></i>
                                        Kirim Aspirasi
                                    </button>
                                </a>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <img
                                src="https://readdy.ai/api/search-image?query=Indonesian%20parliament%20members%20DPR%20discussing%20in%20session%2C%20diverse%20group%20of%20professional%20politicians%20in%20formal%20business%20attire%2C%20Indonesian%20flag%20in%20background%2C%20modern%20parliament%20chamber%20interior%2C%20clean%20white%20background%20with%20navy%20blue%20and%20orange%20accents%2C%20professional%20government%20atmosphere%2C%20democratic%20discussion%20scene%2C%20formal%20political%20meeting%2C%20bright%20natural%20lighting%2C%20high%20quality%20professional%20photography&width=600&height=700&seq=dpr_members_dashboard&orientation=portrait"
                                alt="Dashboard SMARTPOL UB"
                                className="w-full h-auto rounded-2xl shadow-xl object-cover border border-gray-100" />
                            <div className="absolute -top-4 -left-4 bg-[#f97316] p-4 rounded-xl shadow-lg">
                                <i className="fas fa-user-check text-2xl text-white"></i>
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-[#1e3a8a] p-4 rounded-xl shadow-lg">
                                <i className="fas fa-chart-line text-2xl text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="fitur" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-16">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 mb-6 shadow-sm">
                            <i className="fas fa-star text-[#f97316] mr-2"></i>
                            <span className="text-sm font-medium text-gray-700">Fitur Dashboard</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Akses Fitur <span className="text-[#1e3a8a]">SMARTPOL UB</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Manfaatkan semua fitur platform demokrasi digital sesuai dengan role dan kebutuhan Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200">
                            <div className="relative p-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e3a8a] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-user text-2xl text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#1e3a8a] transition-colors duration-300">
                                    Profil Wakil Rakyat
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Kenali wakil rakyat Anda, lihat rekam jejak, agenda, dan cara menghubungi mereka secara langsung
                                </p>
                                <div className="flex items-center text-[#1e3a8a] font-semibold group-hover:text-[#f97316] transition-colors duration-300">
                                    <span className="mr-2">Jelajahi Fitur</span>
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1e3a8a] group-hover:to-[#f97316] transition-all duration-300"></div>
                        </div>
                        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200">
                            <div className="relative p-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f97316] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-envelope text-2xl text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#1e3a8a] transition-colors duration-300">
                                    Kotak Aspirasi Digital
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Sampaikan aspirasi dengan mudah, dapatkan dukungan warga lain, dan lihat tanggapan wakil rakyat
                                </p>
                                <a href="/kotak-aspirasi" className="inline-flex items-center text-[#f97316] font-semibold group-hover:text-[#1e3a8a] transition-colors duration-300">
                                    <span className="mr-2">Mulai Sekarang</span>
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                                </a>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1e3a8a] group-hover:to-[#f97316] transition-all duration-300"></div>
                        </div>
                        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200">
                            <div className="relative p-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e3a8a] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-file-alt text-2xl text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#1e3a8a] transition-colors duration-300">
                                    Transparansi Kebijakan
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Akses ringkasan dan analisis kebijakan terbaru dengan penjelasan yang mudah dipahami
                                </p>
                                <div className="flex items-center text-[#1e3a8a] font-semibold group-hover:text-[#f97316] transition-colors duration-300">
                                    <span className="mr-2">Jelajahi Fitur</span>
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1e3a8a] group-hover:to-[#f97316] transition-all duration-300"></div>
                        </div>
                        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200">
                            <div className="relative p-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f97316] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-map text-2xl text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#1e3a8a] transition-colors duration-300">
                                    Peta Aspirasi Interaktif
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Visualisasi aspirasi dan isu daerah dalam peta interaktif untuk memahami kebutuhan setiap wilayah
                                </p>
                                <a href="/peta-aspirasi" className="inline-flex items-center text-[#f97316] font-semibold group-hover:text-[#1e3a8a] transition-colors duration-300">
                                    <span className="mr-2">Lihat Peta</span>
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                                </a>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1e3a8a] group-hover:to-[#f97316] transition-all duration-300"></div>
                        </div>
                        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200">
                            <div className="relative p-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e3a8a] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-chart-bar text-2xl text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#1e3a8a] transition-colors duration-300">
                                    Survei & Polling Publik
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Berpartisipasi dalam survei kebijakan dan lihat hasil polling dalam bentuk grafik yang informatif
                                </p>
                                <div className="flex items-center text-[#1e3a8a] font-semibold group-hover:text-[#f97316] transition-colors duration-300">
                                    <span className="mr-2">Jelajahi Fitur</span>
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1e3a8a] group-hover:to-[#f97316] transition-all duration-300"></div>
                        </div>
                        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200">
                            <div className="relative p-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f97316] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-video text-2xl text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#1e3a8a] transition-colors duration-300">
                                    Live Streaming Interaktif
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Saksikan rapat dewan secara langsung dengan fitur tanya jawab real-time untuk transparansi maksimal
                                </p>
                                <div className="flex items-center text-[#1e3a8a] font-semibold group-hover:text-[#f97316] transition-colors duration-300">
                                    <span className="mr-2">Jelajahi Fitur</span>
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1e3a8a] group-hover:to-[#f97316] transition-all duration-300"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-16">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 border border-gray-200 mb-6">
                            <i className="fas fa-shield-alt mr-2 text-[#f97316]"></i>
                            <span className="text-sm font-medium text-gray-700">Keunggulan Platform</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Mengapa Memilih <span className="text-[#1e3a8a]">SMARTPOL UB</span>?
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Platform yang mengedepankan transparansi, keamanan, dan kemudahan akses untuk semua warga
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group text-center p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-[#1e3a8a]/20 hover:shadow-lg">
                            <div className="bg-[#1e3a8a] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <i className="fas fa-shield-alt text-white text-3xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#1e3a8a] transition-colors">Keamanan Terjamin</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Verifikasi identitas dengan NIK/email/OTP dan moderasi AI untuk mencegah hoaks serta melindungi data pribadi
                            </p>
                        </div>
                        <div className="group text-center p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-[#f97316]/20 hover:shadow-lg">
                            <div className="bg-[#f97316] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <i className="fas fa-eye text-white text-3xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#f97316] transition-colors">Transparansi Penuh</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Semua aspirasi dan tanggapan wakil rakyat dapat dilihat secara terbuka untuk membangun akuntabilitas
                            </p>
                        </div>
                        <div className="group text-center p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-[#1e3a8a]/20 hover:shadow-lg">
                            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#f97316] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <i className="fas fa-mobile-alt text-white text-3xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#1e3a8a] transition-colors">Mudah Diakses</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Responsif di semua platform mobile dan web dengan antarmuka yang intuitif dan mudah dipahami
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Mulai Berpartisipasi <span className="text-[#f97316]">Sekarang</span>
                        </h2>
                        <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed">
                            Bergabunglah dengan ribuan warga yang sudah menyalurkan aspirasinya dan berkontribusi untuk perubahan positif
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <a href="#fitur">
                                <button className="w-full sm:w-auto bg-[#f97316] hover:bg-[#ea580c] text-white px-10 py-4 rounded-2xl font-bold text-xl hover:shadow-xl transition-all duration-300 whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-rocket mr-2"></i>
                                    Jelajahi Fitur
                                </button>
                            </a>
                            <a href="#kontak">
                                <button className="w-full sm:w-auto border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    Hubungi Kami
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="kontak" className="py-24 bg-gradient-to-br from-[#1e3a8a] via-[#2448bf] to-[#153ca9] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                            <i className="fas fa-comments text-white mr-2"></i>
                            <span className="text-sm font-medium text-white">Hubungi Kami</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Mari <span className="text-[#f97316]">Terhubung</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            Punya pertanyaan, saran, atau butuh bantuan? Tim SMARTPOL UB siap membantu Anda 24/7
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="group text-center">
                            <div className="relative">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#f97316] transition-all duration-300 group-hover:scale-110">
                                    <i className="fas fa-phone text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                                </div>
                                <div className="absolute -inset-2 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors duration-300">Telepon</h3>
                            <p className="text-blue-100 text-lg">+62 341 551611</p>
                            <p className="text-blue-200 text-sm mt-2">Senin - Jumat, 08:00 - 17:00</p>
                        </div>
                        <div className="group text-center">
                            <div className="relative">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#f97316] transition-all duration-300 group-hover:scale-110">
                                    <i className="fas fa-map-marker-alt text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                                </div>
                                <div className="absolute -inset-2 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors duration-300">Alamat</h3>
                            <p className="text-blue-100 text-lg">Universitas Brawijaya</p>
                            <p className="text-blue-200 text-sm mt-2">Jl. Veteran, Ketawanggede, Kec. Lowokwaru, Kota Malang</p>
                        </div>
                        <div className="group text-center">
                            <div className="relative">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#f97316] transition-all duration-300 group-hover:scale-110">
                                    <i className="fas fa-home text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                                </div>
                                <div className="absolute -inset-2 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors duration-300">Website</h3>
                            <p className="text-blue-100 text-lg">www.ub.ac.id</p>
                            <p className="text-blue-200 text-sm mt-2">Portal Resmi Universitas Brawijaya</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <button className="group inline-flex items-center px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <i className="fas fa-paper-plane mr-3 group-hover:translate-x-1 transition-transform duration-300"></i>
                            <span>Kirim Pesan</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
      {/* Content end */}
      <FooterComponent />
    </>
  )
}

export default Dashboard
