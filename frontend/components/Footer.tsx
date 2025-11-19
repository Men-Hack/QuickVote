'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">QuickVote</h3>
                <p className="text-gray-400 text-sm">Decentralized Voting Platform</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md">
              A transparent, secure, and immutable voting solution built on Base blockchain.
              Empowering communities with trustless elections.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/vote" className="hover:text-white transition-colors">Vote Now</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
            </ul>
          </div>

          {/* Contract Info */}
          <div>
            <h4 className="font-semibold mb-4">Contract</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="font-mono text-xs break-all">
                0x0c8cF958...4aF4586
              </li>
              <li>
                <a
                  href="https://sepolia.basescan.org/address/0x0c8cF958759f547a9Cc53Edceb428a8244aF4586"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-sm"
                >
                  View on BaseScan →
                </a>
              </li>
              <li className="text-sm">Network: Base Sepolia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 QuickVote. Built with ❤️ on Base Blockchain.</p>
        </div>
      </div>
    </footer>
  );
}

