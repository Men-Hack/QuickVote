'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import WalletButton from './WalletButton';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QuickVote
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Decentralized Voting</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/vote"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Vote Now
            </Link>
          </div>

          <WalletButton />
        </div>
      </div>
    </nav>
  );
}

