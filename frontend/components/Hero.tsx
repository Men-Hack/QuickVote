'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-blue-100 rounded-full text-blue-700 text-sm font-semibold">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
            Built on Base Sepolia • Fully Decentralized
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Decentralized Voting
            </span>
            <br />
            <span className="text-gray-800">Made Simple</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            QuickVote is a transparent, secure, and immutable voting platform built on the blockchain.
            Create elections, register contenders, and vote with complete trust in the process.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/vote"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Voting →
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Transparent</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">Secure</div>
              <div className="text-gray-600">Blockchain Powered</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-pink-600 mb-2">Instant</div>
              <div className="text-gray-600">Real-time Results</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

