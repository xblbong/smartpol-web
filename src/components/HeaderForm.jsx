import React from "react";

export default function HeaderForm() {
  return (
    <>
      <div className="flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* <!-- Logo --> */}
          <div className="text-center mb-8">
            <a href="/">
              <img
                src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
                alt="SMARTPOL UB Logo"
                className="h-16 w-auto mx-auto cursor-pointer"
              />
            </a>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">SMARTPOL UB</h1>
            <p className="text-gray-600 mt-2">Platform Demokrasi Digital</p>
          </div>
        </div>
      </div>
    </>
  );
}
