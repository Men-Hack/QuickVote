import hre from "hardhat";

async function main() {
  console.log("Deploying VotingContract to", hre.network.name, "...");

  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();

  await votingContract.waitForDeployment();

  const address = await votingContract.getAddress();
  console.log("VotingContract deployed to:", address);
  console.log("View on BaseScan:", `https://sepolia.basescan.org/address/${address}`);

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

