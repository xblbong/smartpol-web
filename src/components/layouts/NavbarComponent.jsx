import { useState } from 'react';
import ButtonComponent from '../ButtonComponent';

const NavbarComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
                alt="SMARTPOL UB Logo"
                className="h-12 w-auto cursor-pointer"
              />
            </a>
          </div>

          <div className="hidden md:flex space-x-8">
            <a
              href="#peta"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Peta
            </a>
            <a
              href="#statistik"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Statistik
            </a>
            <a
              href="#kategori"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Kategori
            </a>
            <a
              href="#tentang"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Tentang
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {/* Dummy Auth state */}
            {true ? (
              <ButtonComponent
                href="/dashboard"
                className="!bg-orange-500 hover:!bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                <i className="fas fa-home mr-2"></i>
                Dashboard
              </ButtonComponent>
              
            ) : (
              <>
                <ButtonComponent
                  href="/register"
                  className="!bg-blue-600 hover:!bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <i className="fa-solid fa-user-plus mr-2"></i>
                  Register
                </ButtonComponent>
                <ButtonComponent
                  href="/login"
                  className="!bg-orange-500 hover:!bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <i className="fa-solid fa-right-to-bracket mr-2"></i>
                  Login
                </ButtonComponent>
              </>
            )}
          </div>

          <div className="md:hidden">
            <ButtonComponent
              onClick={toggleMobileMenu}
              className="text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              <i
                className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}
              ></i>
            </ButtonComponent>
          </div>
        </div>

        <div
          className={`md:hidden pb-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          id="mobile-menu"
        >
          <a
            href="#peta"
            onClick={toggleMobileMenu}
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
          >
            Peta
          </a>
          <a
            href="#statistik"
            onClick={toggleMobileMenu}
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
          >
            Statistik
          </a>
          <a
            href="#kategori"
            onClick={toggleMobileMenu}
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
          >
            Kategori
          </a>
          <a
            href="#tentang"
            onClick={toggleMobileMenu}
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
          >
            Tentang
          </a>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex flex-col space-y-3">
              {true ? ( 
                <ButtonComponent
                  href="/dashboard"
                  className="!bg-orange-500 hover:!bg-orange-600 text-white w-full text-center px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <i className="fas fa-home mr-2"></i>
                  Dashboard
                </ButtonComponent>
              ) : (
                <>
                  <ButtonComponent
                    href="/register"
                    className="!bg-blue-600 hover:!bg-blue-700 text-white w-full text-center px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <i className="fa-solid fa-user-plus mr-2"></i>
                    Register
                  </ButtonComponent>
                  <ButtonComponent
                    href="/login"
                    className="!bg-orange-500 hover:!bg-orange-600 text-white w-full text-center px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
};

export default NavbarComponent;