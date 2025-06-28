import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">AI</span>
              </div>
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">Main Line</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-red-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-red-600 transition-colors">How it Works</a>
              <a href="#download" className="text-gray-600 hover:text-red-600 transition-colors">Download</a>
            </div>
            <Link to="/sign-in">
              <button className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base min-h-[44px]">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Your Personal
              <span className="text-red-600 block">AI Emergency Assistant</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              A personal AI emergency assistant in your pocket. With one tap, it alerts 911, shares your exact location, 
              and medical info so even when you can't speak, dispatch knows exactly who you are and what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className="bg-red-600 text-white px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-red-700 transition-colors shadow-lg min-h-[48px]">
                Download Now
              </button>
              <button className="border-2 border-red-600 text-red-600 px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-red-600 hover:text-white transition-colors min-h-[48px]">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose SafeAlert?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Designed for emergencies when every second counts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">One-Tap Emergency</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Instantly alert 911 with a single tap. No need to unlock your phone or navigate through menus.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Precise Location</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Automatically shares your exact GPS coordinates with emergency services for faster response times.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Medical Profile</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Share critical medical information, allergies, and emergency contacts with first responders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Simple, fast, and reliable emergency response
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl font-bold">1</span>
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Setup Profile</h3>
              <p className="text-xs sm:text-sm text-gray-600 px-1">
                Enter your medical information, emergency contacts, and preferences
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl font-bold">2</span>
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">One Tap</h3>
              <p className="text-xs sm:text-sm text-gray-600 px-1">
                Tap the emergency button when you need help
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl font-bold">3</span>
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Auto Alert</h3>
              <p className="text-xs sm:text-sm text-gray-600 px-1">
                App automatically calls 911 and shares your location
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl font-bold">4</span>
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Help Arrives</h3>
              <p className="text-xs sm:text-sm text-gray-600 px-1">
                Emergency services arrive with all your critical information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-12 sm:py-16 lg:py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Don't Wait for an Emergency
          </h2>
          <p className="text-lg sm:text-xl text-red-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Download SafeAlert today and have peace of mind knowing help is just one tap away
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button className="bg-white text-red-600 px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors min-h-[48px]">
              Download for iOS
            </button>
            <button className="bg-white text-red-600 px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors min-h-[48px]">
              Download for Android
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">AI</span>
                </div>
                <span className="ml-2 text-lg sm:text-xl font-bold">Main Line</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Your personal safety companion, designed to keep you protected when it matters most.
              </p>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency Services</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
            <p>&copy; 2024 Main Line. All rights reserved. In case of emergency, call 911.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
