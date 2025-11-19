'use client';

const steps = [
  {
    number: '01',
    title: 'Connect Wallet',
    description: 'Connect your MetaMask or any Web3 wallet to the Base Sepolia network. Make sure you have testnet ETH for transaction fees.',
    icon: '🔗',
  },
  {
    number: '02',
    title: 'Register Contenders',
    description: 'As the election owner, register up to 3 contenders with unique codes. You can register all at once or individually.',
    icon: '📝',
  },
  {
    number: '03',
    title: 'Start Voting',
    description: 'Set a voting duration and start the election. Once started, all registered wallets can cast their vote for their preferred contender.',
    icon: '🚀',
  },
  {
    number: '04',
    title: 'Cast Your Vote',
    description: 'Select your preferred contender and cast your vote. Each wallet can only vote once, and votes are immediately recorded on-chain.',
    icon: '✓',
  },
  {
    number: '05',
    title: 'View Results',
    description: 'Watch results update in real-time. Once voting ends, the winner is automatically determined based on the highest vote count.',
    icon: '🏆',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with QuickVote in just a few simple steps
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 to-purple-200 top-0" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-8' : 'lg:text-left lg:pl-8'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full text-white text-2xl mb-4">
                      {step.icon}
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mb-2">STEP {step.number}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Timeline Circle */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number.slice(-1)}
                  </div>
                </div>

                {/* Empty Space */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

