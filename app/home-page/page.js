import React from "react";
// pages/index.js
import HomePageHeader from "@/component/HomePageHeader";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomePageHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-auto">
          <div className="flex flex-col lg:flex-row items-center w-full">
            {/* Left Content */}
            <div className="flex-1 flex flex-col lg:pr-12 mb-12 lg:mb-0">
              <div className="flex flex-col mb-8">
                <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  <div className="mb-2">Transform Your Health</div>
                  <div className="text-gray-600 mb-2">with</div>
                  <div className="text-green-500">Personalized Nutrition</div>
                </h1>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Professional meal planning and macro tracking designed by
                registered dietitians. Get custom nutrition plans that fit your
                lifestyle and deliver real results.
              </p>

              <div className="flex flex-col sm:flex-row mb-8">
                <Link
                  href="/start-transformation"
                  className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors text-center mb-4 sm:mb-0 sm:mr-4"
                >
                  Start Your Transformation
                </Link>
                <Link
                  href="/learn-more"
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap pt-8">
                <div className="flex flex-col items-center mr-8 mb-4">
                  <div className="text-3xl font-bold text-green-500">5000+</div>
                  <div className="text-sm text-gray-600">Success Stories</div>
                </div>
                <div className="flex flex-col items-center mr-8 mb-4">
                  <div className="text-3xl font-bold text-green-500">98%</div>
                  <div className="text-sm text-gray-600">
                    Client Satisfaction
                  </div>
                </div>
                <div className="flex flex-col items-center mb-4">
                  <div className="text-3xl font-bold text-green-500">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative bg-gradient-to-br from-green-100 to-green-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  {/* Meal prep containers image placeholder */}
                  <div className="w-full h-96 bg-gradient-to-br from-green-200 via-green-100 to-blue-100 flex items-center justify-center relative">
                    {/* Kitchen countertop scene */}
                    <div className="absolute inset-0 bg-gray-100 flex flex-col">
                      {/* Top section with plants and utensils */}
                      <div className="flex-1 relative">
                        {/* Plants */}
                        <div className="absolute top-12 left-12 w-8 h-12 bg-green-500 rounded-full"></div>
                        <div className="absolute top-8 left-16 w-12 h-16 bg-green-600 rounded-full"></div>

                        {/* Kitchen utensils hanging */}
                        <div className="absolute top-8 right-12 w-2 h-16 bg-gray-800 rounded-full"></div>
                        <div className="absolute top-8 right-16 w-2 h-20 bg-gray-700 rounded-full"></div>
                      </div>

                      {/* Bottom section with containers */}
                      <div className="h-24 relative">
                        {/* Counter surface */}
                        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-gray-300 to-gray-200"></div>

                        {/* Meal prep containers */}
                        <div className="absolute bottom-24 flex w-full px-8 justify-between">
                          <div className="w-32 h-20 bg-white rounded-lg shadow-md border-2 border-gray-200">
                            {/* Colorful vegetables */}
                            <div className="p-2 flex flex-col h-full justify-center">
                              <div className="flex mb-1">
                                <div className="w-4 h-4 bg-green-400 rounded-full mr-1"></div>
                                <div className="w-4 h-4 bg-orange-400 rounded-full mr-1"></div>
                                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                              </div>
                              <div className="flex">
                                <div className="w-6 h-3 bg-green-500 rounded mr-1"></div>
                                <div className="w-6 h-3 bg-yellow-400 rounded"></div>
                              </div>
                            </div>
                          </div>

                          <div className="w-32 h-20 bg-white rounded-lg shadow-md border-2 border-gray-200">
                            {/* Grains and proteins */}
                            <div className="p-2 flex flex-col h-full justify-center">
                              <div className="w-full h-3 bg-amber-600 rounded mb-1"></div>
                              <div className="flex">
                                <div className="w-8 h-6 bg-pink-300 rounded mr-1"></div>
                                <div className="w-8 h-6 bg-green-300 rounded"></div>
                              </div>
                            </div>
                          </div>

                          <div className="w-20 h-16 bg-gradient-to-br from-amber-200 to-amber-400 rounded-lg shadow-md">
                            {/* Grains container */}
                            <div className="p-2 h-full flex items-center justify-center">
                              <div className="w-full h-full bg-amber-600 rounded opacity-60"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating nutrition icons */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <div className="absolute top-20 right-20 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <div className="absolute top-32 right-8 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-white text-xs font-bold">F</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
