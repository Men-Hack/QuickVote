import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

// Base Sepolia network configuration
export const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
}

// Get project ID from environment variable or use default
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ''

// Create metadata
const metadata = {
  name: 'QuickVote',
  description: 'Decentralized Voting Platform on Base',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://quickvote.app',
  icons: [`${typeof window !== 'undefined' ? window.location.origin : ''}/favicon.ico`],
}

// Create Ethers adapter
const ethersAdapter = new EthersAdapter()

// Initialize AppKit
createAppKit({
  adapters: [ethersAdapter],
  networks: [baseSepolia],
  projectId,
  metadata,
  features: {
    analytics: true, // Optional
  },
  themeMode: 'light',
})

export { ethersAdapter }


