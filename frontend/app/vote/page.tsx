'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WalletButton from '@/components/WalletButton';
import AdminPanel from '@/components/AdminPanel';
import VotingStatus from '@/components/VotingStatus';
import ContenderCard from '@/components/ContenderCard';
import WinnerDisplay from '@/components/WinnerDisplay';
import { useVotingContract } from '@/hooks/useVotingContract';
import type { ContDetails } from '@/lib/contract';

interface Contender {
  code: string;
  address: string;
  voteCount: number;
}

export default function VotePage() {
  const {
    address,
    isConnected,
    loading,
    error,
    isOwner,
    getVotingStatus,
    getAllContendersWithDetails,
    getWinner,
    hasVoted: checkHasVoted,
    vote,
    getTotalVotes,
  } = useVotingContract();

  const [contenders, setContenders] = useState<Contender[]>([]);
  const [votingActive, setVotingActive] = useState(false);
  const [votingStartTime, setVotingStartTime] = useState<number>(0);
  const [votingEndTime, setVotingEndTime] = useState<number>(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [winner, setWinner] = useState<{ address: string; code: string; voteCount: number } | undefined>();
  const [isOwnerValue, setIsOwnerValue] = useState(false);

  // Load voting status
  useEffect(() => {
    if (!isConnected) return;

    const loadStatus = async () => {
      const status = await getVotingStatus();
      if (status) {
        setVotingActive(status.active);
        setVotingStartTime(Number(status.startTime));
        setVotingEndTime(Number(status.endTime));
      }

      const owner = await isOwner();
      setIsOwnerValue(owner || false);

      if (address) {
        const voted = await checkHasVoted();
        setHasVoted(voted || false);
      }
    };

    loadStatus();
  }, [isConnected, address, getVotingStatus, isOwner, checkHasVoted]);

  // Load contenders
  useEffect(() => {
    if (!isConnected) return;

    const loadContenders = async () => {
      const contenderDetails = await getAllContendersWithDetails();
      
      if (contenderDetails && contenderDetails.length > 0) {
        const mapped: Contender[] = contenderDetails.map((detail) => ({
          code: detail.code,
          address: detail.contender,
          voteCount: detail.votersNo,
        }));
        setContenders(mapped);
      } else {
        setContenders([]);
      }

      const total = await getTotalVotes();
      setTotalVotes(Number(total || 0));
    };

    loadContenders();
    
    // Refresh every 5 seconds when voting is active
    const interval = votingActive ? setInterval(loadContenders, 5000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, getAllContendersWithDetails, getTotalVotes, votingActive]);

  // Load winner if voting is not active
  useEffect(() => {
    if (votingActive) return;

    const loadWinner = async () => {
      if (!isConnected) return;
      const winnerData = await getWinner();
      if (winnerData) {
        setWinner({
          address: winnerData.winner,
          code: winnerData.code,
          voteCount: Number(winnerData.voteCount),
        });
      }
    };

    loadWinner();
  }, [votingActive, isConnected, getWinner]);

  const handleVote = async (code: string) => {
    if (!isConnected || hasVoted) return;

    try {
      const tx = await vote(code);
      if (tx) {
        setHasVoted(true);
        // Reload contender data
        const status = await getVotingStatus();
        if (status) {
          setVotingActive(status.active);
        }
        // Refresh page data
        window.location.reload();
      }
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  QuickVote
                </h1>
                <p className="text-xs text-gray-500">Voting Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors hidden sm:block"
              >
                ← Back to Home
              </Link>
            <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-800 text-center">
            <p className="font-semibold">Processing transaction...</p>
          </div>
        )}

        {/* Status Bar */}
        <div className="mb-8">
          <VotingStatus
            isActive={votingActive}
            startTime={votingStartTime}
            endTime={votingEndTime}
          />
        </div>

        {/* Winner Display */}
        {winner && (
          <div className="mb-8">
            <WinnerDisplay winner={winner} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Admin Panel */}
          <div className="lg:col-span-1">
            {isConnected && isOwnerValue && (
              <div className="mb-6">
                <AdminPanel isOwner={isOwnerValue} />
              </div>
            )}

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Voting Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Votes:</span>
                  <span className="font-semibold">{totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contenders:</span>
                  <span className="font-semibold">{contenders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-semibold text-blue-600">Base Sepolia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contenders */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Contenders</h2>
              <p className="text-gray-600">
                {votingActive
                  ? hasVoted
                    ? "You've already voted. Thanks for participating!"
                    : 'Select a contender to vote'
                  : 'Voting is not active yet'}
              </p>
            </div>

            {contenders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
                <p className="text-gray-600 text-lg">
                  No contenders registered yet.
                  {isOwnerValue && ' Use the admin panel to register contenders.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contenders.map((contender) => (
                  <ContenderCard
                    key={contender.code}
                    code={contender.code}
                    address={contender.address}
                    voteCount={contender.voteCount}
                    totalVotes={totalVotes}
                    hasVoted={hasVoted}
                    onVote={handleVote}
                    isVotingActive={votingActive}
                  />
                ))}
              </div>
            )}

            {!isConnected && (
              <div className="mt-8 text-center bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-blue-600 mb-4">
                  Connect your wallet to participate in voting
                </p>
                <WalletButton />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

