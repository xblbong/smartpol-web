import { useEffect, useState } from "react";
import ButtonComponent from "../ButtonComponent";
import { useNavigate } from "react-router-dom";



export default function NavbarComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  const handleLoginToggle = () => {
    setIsAuthenticated(!isAuthenticated);
    localStorage.setItem("isLoggedIn", (!isAuthenticated).toString());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <ButtonComponent href="/" className="flex items-center space-x-2">
              <img
                src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
                alt="SMARTPOL UB Logo"
                className="h-12 w-auto cursor-pointer"
              />
            </ButtonComponent>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <ButtonComponent
              href="#peta"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Peta
            </ButtonComponent>
            <ButtonComponent
              href="#statistik"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Statistik
            </ButtonComponent>
            <ButtonComponent
              href="#kategori"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Kategori
            </ButtonComponent>
            <ButtonComponent
              href="#tentang"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Tentang
            </ButtonComponent>
          </div>

          {/* Auth Buttons for Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <ButtonComponent
                  onClick={() => navigate("/dashboard")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-home mr-2"></i>
                  Dashboard
                </ButtonComponent>
                <ButtonComponent
                  onClick={handleLoginToggle}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <i className="fa-solid fa-right-from-bracket mr-2"></i>
                  Logout
                </ButtonComponent>
              </>
            ) : (
              <>
                <ButtonComponent
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <i className="fa-solid fa-user-plus mr-2"></i>
                  Register
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <i className="fa-solid fa-right-to-bracket mr-2"></i>
                  Login
                </ButtonComponent>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <ButtonComponent
              id="mobile-menu-button"
              className="text-gray-800 hover:text-blue-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <i
                id="mobile-menu-icon"
                className={`fas ${
                  isMobileMenuOpen ? "fa-times" : "fa-bars"
                } text-2xl`}
              ></i>
            </ButtonComponent>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden pb-4`}
        >
          <ButtonComponent
            href="#peta"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
            onClick={toggleMobileMenu}
          >
            Peta
          </ButtonComponent>
          <ButtonComponent
            href="#statistik"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
            onClick={toggleMobileMenu}
          >
            Statistik
          </ButtonComponent>
          <ButtonComponent
            href="#kategori"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
            onClick={toggleMobileMenu}
          >
            Kategori
          </ButtonComponent>
          <ButtonComponent
            href="#tentang"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
            onClick={toggleMobileMenu}
          >
            Tentang
          </ButtonComponent>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <ButtonComponent
                    onClick={() => navigate("/dashboard")}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full text-center px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <i className="fas fa-home mr-2"></i>
                    Dashboard
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => {
                      handleLoginToggle();
                      toggleMobileMenu();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white w-full text-center px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <i className="fa-solid fa-right-from-bracket mr-2"></i>
                    Logout
                  </ButtonComponent>
                </>
              ) : (
                <>
                  <ButtonComponent
                    onClick={() => navigate("/register")}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full text-center px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <i className="fa-solid fa-user-plus mr-2"></i>
                    Register
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => {
                    navigate("/login");
                  }}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full text-center px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <i className="fa-solid fa-right-to-bracket mr-2"></i>
                    Login
                  </ButtonComponent>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


// export function NavbarDashboardComponent() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
//     const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

//     const userDropdownRef = useRef(null);
//     const navDropdownRef = useRef(null);
//     const userButtonRef = useRef(null);
//     const navButtonRef = useRef(null);

//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     const toggleUserDropdown = () => {
//         setIsUserDropdownOpen(!isUserDropdownOpen);
//     };

//     const toggleNavDropdown = () => {
//         setIsNavDropdownOpen(!isNavDropdownOpen);
//     };

//     // Close dropdowns when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (userDropdownRef.current && !userDropdownRef.current.contains(event.target) &&
//                 userButtonRef.current && !userButtonRef.current.contains(event.target)) {
//                 setIsUserDropdownOpen(false);
//             }
//             if (navDropdownRef.current && !navDropdownRef.current.contains(event.target) &&
//                 navButtonRef.current && !navButtonRef.current.contains(event.target)) {
//                 setIsNavDropdownOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const handleLogout = (event) => {
//         event.preventDefault();
//         // Implementasi logout sesungguhnya di sini
//         console.log("Logging out...");
//         // Misalnya, redirect ke halaman login atau panggil API logout
//         window.location.href = route('logout');
//     };

//     return (
//         <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
//             <div className="px-4 lg:px-14">
//                 <div className="container mx-auto flex items-center justify-between h-20">
//                     <a href={route('dashboard')} className="flex-shrink-0">
//                         <img
//                             src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
//                             alt="SMARTPOL UB Logo"
//                             className="h-12 w-auto cursor-pointer"
//                         />
//                     </a>

//                     <div className="flex items-center space-x-4 md:space-x-6">
//                         <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
//                             <a href={route('dashboard')} className="text-gray-700 hover:text-[#1e3a8a] transition-colors">Beranda</a>
//                             <a href="wakil-rakyat" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">Profil Wakil Rakyat</a>
//                             <a href={route('kotak-aspirasi.index')} className="text-gray-700 hover:text-[#1e3a8a] transition-colors">Kotak Aspirasi</a>

//                             <div className="relative">
//                                 <button
//                                     onClick={toggleNavDropdown}
//                                     ref={navButtonRef}
//                                     className="flex items-center text-gray-700 hover:text-[#1e3a8a] transition-colors"
//                                 >
//                                     <span>Fitur Lainnya</span>
//                                     <FontAwesomeIcon icon={faChevronDown} className="text-xs ml-2" />
//                                 </button>

//                                 <div
//                                     id="navDropdown"
//                                     ref={navDropdownRef}
//                                     className={`absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 ${isNavDropdownOpen ? '' : 'hidden'}`}
//                                 >
//                                     <a href={route('forum-diskusi.index')} className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]">
//                                         <FontAwesomeIcon icon={faComments} className="w-5 text-center text-gray-400" />
//                                         <span>Forum Diskusi</span>
//                                     </a>
//                                     <a href={route('transparansi-kebijakan.index')} className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]">
//                                         <FontAwesomeIcon icon={faFileAlt} className="w-5 text-center text-gray-400" />
//                                         <span>Transparansi Kebijakan</span>
//                                     </a>
//                                     <a href={route('peta-aspirasi.index')} className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]">
//                                         <FontAwesomeIcon icon={faMap} className="w-5 text-center text-gray-400" />
//                                         <span>Peta Aspirasi</span>
//                                     </a>
//                                     <a href={route('survei-polling.index')} className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]">
//                                         <FontAwesomeIcon icon={faPoll} className="w-5 text-center text-gray-400" />
//                                         <span>Survei & Polling</span>
//                                     </a>
//                                     <a href={route('live-streaming.index')} className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]">
//                                         <FontAwesomeIcon icon={faVideo} className="w-5 text-center text-gray-400" />
//                                         <span>Live Streaming</span>
//                                     </a>
//                                 </div>
//                             </div>
//                         </nav>

//                         {Auth.isAuthenticated && (
//                             <div className="relative">
//                                 <button
//                                     onClick={toggleUserDropdown}
//                                     ref={userButtonRef}
//                                     className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 transition-all duration-200"
//                                 >
//                                     <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
//                                         <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
//                                     </div>
//                                     <div className="hidden md:flex items-center">
//                                         <span className="text-gray-700 font-medium capitalize">{Auth.user.name} | </span>
//                                         <span className="text-sm font-medium text-[#1e3a8a]">{Auth.user.role?.display_name ?? 'User'}</span>
//                                     </div>
//                                     <FontAwesomeIcon icon={faChevronDown} className="text-gray-500 text-xs ml-1" />
//                                 </button>

//                                 <div
//                                     id="userDropdown"
//                                     ref={userDropdownRef}
//                                     className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 ${isUserDropdownOpen ? '' : 'hidden'}`}
//                                 >
//                                     <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                                         <FontAwesomeIcon icon={faUserCog} />
//                                         <span>Pengaturan Profil</span>
//                                     </a>
//                                     <a href={route('verify.identity')} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                                         <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600" />
//                                         <span>Verifikasi Identitas</span>
//                                         {!Auth.user.isFullyVerified() && (
//                                             <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">!</span>
//                                         )}
//                                     </a>
//                                     <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                                         <FontAwesomeIcon icon={faBell} />
//                                         <span>Notifikasi</span>
//                                     </a>
//                                     <div className="border-t border-gray-100 my-1"></div>
//                                     <form onSubmit={handleLogout} className="block">
//                                         <button type="submit" className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
//                                             <FontAwesomeIcon icon={faSignOutAlt} />
//                                             <span>Keluar</span>
//                                         </button>
//                                     </form>
//                                 </div>
//                             </div>
//                         )}

//                         <button
//                             className="lg:hidden text-gray-700 w-10 h-10 flex items-center justify-center cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
//                             onClick={toggleSidebar}
//                         >
//                             <FontAwesomeIcon icon={faBars} className="text-2xl" />
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Sidebar */}
//             <div
//                 id="sidebar"
//                 className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
//             >
//                 <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                     <img
//                         src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
//                         alt="SMARTPOL UB Logo"
//                         className="h-10 w-auto"
//                     />
//                     <button
//                         className="text-gray-600 w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg hover:bg-gray-100"
//                         onClick={toggleSidebar}
//                     >
//                         <FontAwesomeIcon icon={faTimes} className="text-xl" />
//                     </button>
//                 </div>

//                 <nav className="p-4">
//                     <div className="space-y-2">
//                         <a href={route('dashboard')} className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group">
//                             <FontAwesomeIcon icon={faHome} className="text-xl text-gray-500 group-hover:text-[#1e3a8a]" />
//                             <span className="font-medium">Beranda</span>
//                         </a>
//                         <a href="wakil-rakyat" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group">
//                             <FontAwesomeIcon icon={faUser} className="text-xl text-gray-500 group-hover:text-[#1e3a8a]" />
//                             <span className="font-medium">Profil Wakil Rakyat</span>
//                         </a>
//                         <a href={route('forum-diskusi.index')} className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group">
//                             <FontAwesomeIcon icon={faComments} className="text-xl text-gray-500 group-hover:text-[#1e3a8a]" />
//                             <span className="font-medium">Forum Diskusi</span>
//                         </a>
//                         <a href={route('kotak-aspirasi.index')} className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group">
//                             <FontAwesomeIcon icon={faEnvelope} className="text-xl text-gray-500 group-hover:text-[#1e3a8a]" />
//                             <span className="font-medium">Kotak Aspirasi</span>
//                         </a>
//                         <a href={route('transparansi-kebijakan.index')} className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group">
//                             <FontAwesomeIcon icon={faFileAlt} className="text-xl text-gray-500 group-hover:text-[#1e3a8a]" />
//                             <span className="font-medium">Transparansi Kebijakan</span>
//                         </a>
//                         <a href={route('peta-aspirasi.index')} className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group">
//                             <FontAwesomeIcon icon={faMap} className="text-xl text-gray-500 group-hover:text-[#1e3a8a]" />
//                             <span className="font-medium">Peta Aspirasi</span>
//                         </a>
//                         <a href={route('survei-polling.index')} className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group">
//                             <FontAwesomeIcon icon={faPoll} className="text-xl text-gray-500 group-hover:text-[#1e3a8a]" />
//                             <span className="font-medium">Survei & Polling</span>
//                         </a>
//                         <a href={route('live-streaming.index')} className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group">
//                             <FontAwesomeIcon icon={faVideo} className="text-xl text-gray-500 group-hover:text-[#1e3a8a]" />
//                             <span className="font-medium">Live Streaming</span>
//                         </a>
//                     </div>

//                     <div className="mt-8 pt-6 border-t border-gray-200">
//                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                             <h3 className="font-semibold text-blue-600 mb-2">Butuh Bantuan?</h3>
//                             <p className="text-sm text-gray-600 mb-3">
//                                 Hubungi tim support kami untuk mendapatkan bantuan
//                             </p>
//                             <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 whitespace-nowrap cursor-pointer text-sm font-medium">
//                                 Hubungi Support
//                             </button>
//                         </div>
//                     </div>
//                 </nav>
//             </div>
//             {/* Overlay for sidebar */}
//             {isSidebarOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={toggleSidebar}
//                 ></div>
//             )}
//         </header>
//     );
// }

// const Exports = {
//   NavbarMain: NavbarComponent,
//   NavbarSecondary: NavbarDashboardComponent
// };

// export default Exports;