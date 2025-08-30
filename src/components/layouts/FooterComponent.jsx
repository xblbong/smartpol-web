
const FooterComponent = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Kolom 1: Logo dan Deskripsi */}
                    <div>
                        <img
                            src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
                            alt="SMARTPOL UB Logo"
                            className="h-16 w-auto mb-4"
                        />
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Platform berbasis AI yang memfasilitasi komunikasi dua arah antara warga negara dan wakil rakyat untuk transparansi dan akuntabilitas.
                        </p>
                    </div>

                    {/* Kolom 2: Fitur Utama */}
                    <div>
                        <h3 className="font-semibold mb-4 text-[#1e3a8a]">Fitur Utama</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/wakil-rakyat" className="hover:text-[#f97316] cursor-pointer transition-colors">Profil Wakil Rakyat</a></li>
                            <li><a href="/kotak-aspirasi" className="hover:text-[#f97316] cursor-pointer transition-colors">Kotak Aspirasi</a></li>
                            <li><a href="/transparansi-kebijakan" className="hover:text-[#f97316] cursor-pointer transition-colors">Transparansi Kebijakan</a></li>
                            <li><a href="/peta-aspirasi" className="hover:text-[#f97316] cursor-pointer transition-colors">Peta Aspirasi</a></li>
                        </ul>
                    </div>

                    {/* Kolom 3: Layanan */}
                    <div>
                        <h3 className="font-semibold mb-4 text-[#1e3a8a]">Layanan</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-[#f97316] cursor-pointer transition-colors">Forum Diskusi</a></li>
                            <li><a href="/survei-polling" className="hover:text-[#f97316] cursor-pointer transition-colors">Survei & Polling</a></li>
                            <li><a href="#" className="hover:text-[#f97316] cursor-pointer transition-colors">Live Streaming</a></li>
                        </ul>
                    </div>

                    {/* Kolom 4: Kontak */}
                    <div>
                        <h3 className="font-semibold mb-4 text-[#1e3a8a]">Kontak</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p className="flex items-center">
                                 <i className="fas fa-envelope mr-2 text-[#f97316]"></i>
                                info@smartpolub.go.id
                            </p>
                            <p className="flex items-center">
                                <i className="fas fa-phone mr-2 text-[#f97316]"></i>
                                (0341) 551-312
                            </p>
                            <p className="flex items-center">
                               <i className="fas fa-map-marker-alt mr-2 text-[#f97316]"></i>
                                Universitas Brawijaya, Malang
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bagian Bawah Footer: Hak Cipta dan Tautan Lain */}
                <div className="border-t border-gray-200 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <p className="text-sm text-gray-500">
                            © 2024 SMARTPOL UB. Semua hak dilindungi undang-undang.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
                            <a href="#" className="text-sm text-gray-500 hover:text-[#f97316] cursor-pointer transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="text-sm text-gray-500 hover:text-[#f97316] cursor-pointer transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;