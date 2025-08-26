import React from "react";

export default function HeaderForm() {
  return (
    <>
      <div class="flex flex-col items-center justify-center px-4">
        <div class="w-full max-w-md">
          {/* <!-- Logo --> */}
          <div class="text-center mb-8">
            <a href="/">
              <img
                src="https://static.readdy.ai/image/4554a88b1bd23a4b3c8a3f81efcb924d/f39293d6dabaa3c62e79193546be7fd7.png"
                alt="SMARTPOL UB Logo"
                class="h-16 w-auto mx-auto cursor-pointer"
              />
            </a>
            <h1 class="text-2xl font-bold text-gray-900 mt-4">SMARTPOL UB</h1>
            <p class="text-gray-600 mt-2">Platform Demokrasi Digital</p>
          </div>
        </div>
      </div>
    </>
  );
}
