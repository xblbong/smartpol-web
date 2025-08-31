import { useEffect, useRef, useState } from "react";
import ButtonComponent from "../ButtonComponent";
import { useNavigate } from "react-router-dom";

const Auth = {
  user: {
    name: "John Doe",
    role: { display_name: "Admin" },
    isFullyVerified: () => false, // Ganti dengan logika verifikasi sesungguhnya
  },
  // Ganti dengan status otentikasi sesungguhnya
  isAuthenticated: true,
};

// Placeholder untuk route helper functions
const route = (name) => {
  switch (name) {
    case "dashboard":
      return "/dashboard";
    case "kotak-aspirasi":
      return "/kotak-aspirasi";
    case "forum-diskusi":
      return "/forum-diskusi";
    case "transparansi-kebijakan":
      return "/transparansi-kebijakan";
    case "peta-aspirasi":
      return "/peta-aspirasi";
    case "survei-polling":
      return "/survei-polling";
    case "live-streaming":
      return "/live-streaming";
    case "verify.identity":
      return "/verify-identity";
    case "logout":
      return "/logout";
    default:
      return "#";
  }
};

export function NavbarDashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const navDropdownRef = useRef(null);
  const userButtonRef = useRef(null);
  const navButtonRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleNavDropdown = () => {
    setIsNavDropdownOpen(!isNavDropdownOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        navDropdownRef.current &&
        !navDropdownRef.current.contains(event.target) &&
        navButtonRef.current &&
        !navButtonRef.current.contains(event.target)
      ) {
        setIsNavDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    // Implementasi logout sesungguhnya di sini
    console.log("Logging out...");
    // Misalnya, redirect ke halaman login atau panggil API logout
    window.location.href = route("logout");
  };

  const Navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="px-4 lg:px-14">
        <div className="container mx-auto flex items-center justify-between h-20">
          <ButtonComponent
            onClick={() => Navigate(route("dashboard"))}
            className="flex-shrink-0"
          >
            <img
              src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
              alt="SMARTPOL UB Logo"
              className="h-12 w-auto cursor-pointer"
            />
          </ButtonComponent>

          <div className="flex items-center space-x-4 md:space-x-6">
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              <ButtonComponent
                onClick={() => Navigate(route("dashboard"))}
                className="text-gray-700 hover:text-[#1e3a8a] transition-colors"
              >
                Beranda
              </ButtonComponent>
              <ButtonComponent
                onClick={() => Navigate("/profil-wakil-rakyat")}
                className="text-gray-700 hover:text-[#1e3a8a] transition-colors"
              >
                Profil Wakil Rakyat
              </ButtonComponent>
              <ButtonComponent
                onClick={() => Navigate(route("kotak-aspirasi"))}
                className="text-gray-700 hover:text-[#1e3a8a] transition-colors"
              >
                Kotak Aspirasi
              </ButtonComponent>

              <div className="relative">
                <ButtonComponent
                  onClick={toggleNavDropdown}
                  ref={navButtonRef}
                  className="flex items-center text-gray-700 hover:text-[#1e3a8a] transition-colors"
                >
                  <span>Fitur Lainnya</span>
                  <i className="fas fa-chevron-down text-xs ml-2"></i>
                </ButtonComponent>

                <div
                  id="navDropdown"
                  ref={navDropdownRef}
                  className={`absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 ${
                    isNavDropdownOpen ? "" : "hidden"
                  }`}
                >
                  <ButtonComponent
                    onClick={() => Navigate(route("forum-diskusi"))}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]"
                  >
                    <i className="fas fa-comments text-xl text-gray-400 group-hover:text-[#1e3a8a]"></i>
                    <span>Forum Diskusi</span>
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => Navigate(route("transparansi-kebijakan"))}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]"
                  >
                    <i className="fas fa-file-alt w-5 text-center text-gray-400"></i>
                    <span>Transparansi Kebijakan</span>
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => Navigate(route("peta-aspirasi"))}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]"
                  >
                    <i className="fas fa-map w-5 text-center text-gray-400"></i>
                    <span>Peta Aspirasi</span>
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => Navigate(route("survei-polling"))}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]"
                  >
                    <i className="fas fa-poll w-5 text-center text-gray-400"></i>
                    <span>Survei & Polling</span>
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => Navigate(route("live-streaming"))}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]"
                  >
                    <i className="fas fa-video w-5 text-center text-gray-400"></i>
                    <span>Live Streaming</span>
                  </ButtonComponent>
                </div>
              </div>
            </nav>

            {Auth.isAuthenticated && (
              <div className="relative">
                <ButtonComponent
                  onClick={toggleUserDropdown}
                  ref={userButtonRef}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-600 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-white text-sm"></i>
                  </div>
                  <div className="hidden md:flex items-center">
                    <span className="text-gray-700 font-medium capitalize">
                      {Auth.user.name} |{" "}
                    </span>
                    <span className="text-sm font-medium text-[#1e3a8a]">
                      {Auth.user.role?.display_name ?? "User"}
                    </span>
                  </div>
                  <i class="fas fa-chevron-down text-gray-500 text-xs ml-1"></i>
                </ButtonComponent>

                <div
                  id="userDropdown"
                  ref={userDropdownRef}
                  className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 ${
                    isUserDropdownOpen ? "" : "hidden"
                  }`}
                >
                  <ButtonComponent
                    onClick={() => Navigate(route("pengaturan-profil"))}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i class="fas fa-user-cog"></i>
                    <span>Pengaturan Profil</span>
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => Navigate(route("verify.identity"))}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i class="fas fa-shield-alt text-blue-600"></i>
                    <span>Verifikasi Identitas</span>
                    {!Auth.user.isFullyVerified() && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                        !
                      </span>
                    )}
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => Navigate(route("notifikasi"))}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i class="fas fa-bell"></i>
                    <span>Notifikasi</span>
                  </ButtonComponent>
                  <div className="border-t border-gray-100 my-1"></div>
                  <form onSubmit={handleLogout} className="block">
                    <ButtonComponent
                      type="submit"
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <i class="fas fa-sign-out-alt"></i>
                      <span>Keluar</span>
                    </ButtonComponent>
                  </form>
                </div>
              </div>
            )}

            <ButtonComponent
              className="lg:hidden text-gray-700 w-10 h-10 flex items-center justify-center cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
              onClick={toggleSidebar}
            >
              <i class="fas fa-bars text-2xl"></i>
            </ButtonComponent>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <img
            src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
            alt="SMARTPOL UB Logo"
            className="h-10 w-auto"
          />
          <ButtonComponent
            className="text-gray-600 w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <i class="fas fa-times text-xl"></i>
          </ButtonComponent>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <ButtonComponent
              onClick={() => Navigate(route("dashboard"))}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <i class="fas fa-home text-xl text-gray-500 group-hover:text-[#1e3a8a]"></i>
              <span className="font-medium">Beranda</span>
            </ButtonComponent>
            <ButtonComponent
              onClick={() => Navigate("/profil-wakil-rakyat")}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <i class="fas fa-user text-xl text-gray-500 group-hover:text-[#1e3a8a]"></i>
              <span className="font-medium">Profil Wakil Rakyat</span>
            </ButtonComponent>
            <ButtonComponent
              onClick={() => Navigate(route("forum-diskusi"))}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <i class="fas fa-comments text-xl text-gray-500 group-hover:text-[#1e3a8a]"></i>
              <span className="font-medium">Forum Diskusi</span>
            </ButtonComponent>
            <ButtonComponent
              onClick={() => Navigate(route("kotak-aspirasi"))}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <i class="fas fa-envelope text-xl text-gray-500 group-hover:text-[#1e3a8a]"></i>
              <span className="font-medium">Kotak Aspirasi</span>
            </ButtonComponent>
            <ButtonComponent
              onClick={() => Navigate(route("transparansi-kebijakan"))}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <i class="fas fa-file-alt text-xl text-gray-500 group-hover:text-[#1e3a8a]"></i>
              <span className="font-medium">Transparansi Kebijakan</span>
            </ButtonComponent>
            <ButtonComponent
              onClick={() => Navigate(route("peta-aspirasi"))}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <i class="fas fa-map text-xl text-gray-500 group-hover:text-[#1e3a8a]"></i>
              <span className="font-medium">Peta Aspirasi</span>
            </ButtonComponent>
            <ButtonComponent
              onClick={() => Navigate(route("survei-polling"))}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <i class="fas fa-poll text-xl text-gray-500 group-hover:text-[#1e3a8a]"></i>
              <span className="font-medium">Survei & Polling</span>
            </ButtonComponent>
            <ButtonComponent
              onClick={() => Navigate(route("live-streaming"))}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <i class="fas fa-video text-xl text-gray-500 group-hover:text-[#1e3a8a]"></i>
              <span className="font-medium">Live Streaming</span>
            </ButtonComponent>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-blue-600 mb-2">
                Butuh Bantuan?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Hubungi tim support kami untuk mendapatkan bantuan
              </p>
              <ButtonComponent className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 whitespace-nowrap cursor-pointer text-sm font-medium">
                Hubungi Support
              </ButtonComponent>
            </div>
          </div>
        </nav>
      </div>
      {/* Overlay for sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </header>
  );
}
