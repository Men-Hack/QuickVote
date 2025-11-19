'use client';

interface WinnerDisplayProps {
  winner?: {
    address: string;
    code: string;
    voteCount: number;
  };
}

export default function WinnerDisplay({ winner }: WinnerDisplayProps) {
  if (!winner) return null;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-xl shadow-2xl p-8 border-4 border-yellow-300">
      <div className="text-center">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-white mb-2">Winner!</h2>
        <div className="bg-white/90 rounded-lg p-6 mt-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{winner.code}</h3>
          <p className="text-sm text-gray-600 font-mono mb-4">
            {formatAddress(winner.address)}
          </p>
          <div className="text-4xl font-bold text-orange-600">
            {winner.voteCount} {winner.voteCount === 1 ? 'Vote' : 'Votes'}
          </div>
        </div>
      </div>
    </div>
  );
}

