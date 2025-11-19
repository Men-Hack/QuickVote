'use client';

const features = [
  {
    icon: '🔒',
    title: 'Secure & Transparent',
    description: 'All votes are recorded on the blockchain, ensuring complete transparency and immutability. No votes can be altered or deleted.',
  },
  {
    icon: '⚡',
    title: 'Fast & Efficient',
    description: 'Built on Base network for low gas fees and instant transactions. Vote in seconds without waiting for long confirmation times.',
  },
  {
    icon: '👥',
    title: 'Decentralized',
    description: 'No central authority controls the voting process. Everything is managed by smart contracts that execute automatically.',
  },
  {
    icon: '📊',
    title: 'Real-time Results',
    description: 'See voting results update in real-time as votes are cast. Live countdown timers show exactly when voting ends.',
  },
  {
    icon: '✅',
    title: 'One Vote Per Person',
    description: 'Blockchain ensures each wallet address can only vote once, preventing duplicate voting and maintaining election integrity.',
  },
  {
    icon: '🎯',
    title: 'Time-Based Voting',
    description: 'Set voting periods with start and end times. Voting automatically ends when the deadline is reached, with results immediately available.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">QuickVote</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern voting solution that combines blockchain security with user-friendly design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

