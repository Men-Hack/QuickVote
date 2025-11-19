import { BrowserProvider, Contract } from 'ethers';
import VotingContractABI from './contractABI.json';

export const CONTRACT_ADDRESS = '0x0c8cF958759f547a9Cc53Edceb428a8244aF4586';

export interface ContDetails {
  contender: string;
  code: string;
  votersNo: number;
  registered: boolean;
}

export function getVotingContract(provider: any) {
  const ethersProvider = new BrowserProvider(provider);
  return new Contract(CONTRACT_ADDRESS, VotingContractABI, ethersProvider);
}

export async function getVotingContractWithSigner(provider: any) {
  const ethersProvider = new BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  return new Contract(CONTRACT_ADDRESS, VotingContractABI, signer);
}

