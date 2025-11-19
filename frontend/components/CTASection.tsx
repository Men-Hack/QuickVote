'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Start Voting?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join the decentralized voting revolution. Create transparent elections or participate in existing ones.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/vote"
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 hover:bg-blue-50"
          >
            Start Voting Now →
          </Link>
          <a
            href="https://sepolia.basescan.org/address/0x0c8cF958759f547a9Cc53Edceb428a8244aF4586"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200"
          >
            View Contract
          </a>
        </div>
      </div>
    </section>
  );
}

