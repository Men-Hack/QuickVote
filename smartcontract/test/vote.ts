import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingContract } from "../typechain-types"; // Adjust path based on your project structure; assumes typechain generates types

describe("VotingContract", function () {
  let votingContract: VotingContract;
  let registrar: Awaited<ReturnType<typeof ethers.getSigners>>[0];
  let voter1: Awaited<ReturnType<typeof ethers.getSigners>>[1];
  let voter2: Awaited<ReturnType<typeof ethers.getSigners>>[2];
  let voter3: Awaited<ReturnType<typeof ethers.getSigners>>[3];
  let voter4: Awaited<ReturnType<typeof ethers.getSigners>>[4];
  let contender1: Awaited<ReturnType<typeof ethers.getSigners>>[5];
  let contender2: Awaited<ReturnType<typeof ethers.getSigners>>[6];
  let contender3: Awaited<ReturnType<typeof ethers.getSigners>>[7];

  const code1 = "CODE1";
  const code2 = "CODE2";
  const code3 = "CODE3";
  const votingDuration = BigInt(7 * 24 * 60 * 60); // Use BigInt directly for consistency

  beforeEach(async function () {
    [registrar, voter1, voter2, voter3, voter4, contender1, contender2, contender3] = await ethers.getSigners();

    const VotingContractFactory = await ethers.getContractFactory("VotingContract");
    votingContract = await VotingContractFactory.deploy();
    await votingContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the registrar to the deployer", async function () {
      expect(await votingContract.registrar()).to.equal(registrar.address);
    });

    it("Should initialize voting as not active and not ended", async function () {
      expect(await votingContract.votingActive()).to.be.false;
      expect(await votingContract.votingEnded()).to.be.false;
    });
  });

  describe("Contender Registration", function () {
    it("Should register a single contender by registrar", async function () {
      await expect(votingContract.connect(registrar).registerContender(contender1.address, code1))
        .to.emit(votingContract, "ContenderRegistered")
        .withArgs(contender1.address, code1);

      expect(await votingContract.codeToAddress(code1)).to.equal(contender1.address);
      expect(await votingContract.contendersList(0)).to.equal(contender1.address);

      const details = await votingContract.getContenderByAddress(contender1.address);
      expect(details.exists).to.be.true;
      expect(details.code).to.equal(code1);
      expect(details.votersNo).to.equal(0);
    });

    it("Should revert if non-registrar tries to register a contender", async function () {
      await expect(
        votingContract.connect(voter1).registerContender(contender1.address, code1)
      ).to.be.revertedWith("Only registrar can call this");
    });

    it("Should revert registration with invalid contender address", async function () {
      await expect(
        votingContract.connect(registrar).registerContender(ethers.ZeroAddress, code1)
      ).to.be.revertedWith("Invalid contender address");
    });

    it("Should revert registration with empty code", async function () {
      await expect(
        votingContract.connect(registrar).registerContender(contender1.address, "")
      ).to.be.revertedWith("Code cannot be empty");
    });

    it("Should revert registration with duplicate code", async function () {
      await votingContract.connect(registrar).registerContender(contender1.address, code1);
      await expect(
        votingContract.connect(registrar).registerContender(contender2.address, code1)
      ).to.be.revertedWith("Code already exists");
    });

    it("Should revert registration with duplicate contender", async function () {
      await votingContract.connect(registrar).registerContender(contender1.address, code1);
      await expect(
        votingContract.connect(registrar).registerContender(contender1.address, code2)
      ).to.be.revertedWith("Contender already registered");
    });

    it("Should register multiple contenders", async function () {
      const contenders = [contender1.address, contender2.address];
      const codes = [code1, code2];

      const tx = await votingContract.connect(registrar).registerMultipleContenders(contenders, codes);
      await tx.wait();

      const receipt = await tx.wait();
      expect(receipt!.logs!.length).to.equal(2); // Two ContenderRegistered events

      expect(await votingContract.contendersList(0)).to.equal(contender1.address);
      expect(await votingContract.contendersList(1)).to.equal(contender2.address);
      expect(await votingContract.codeToAddress(code1)).to.equal(contender1.address);
      expect(await votingContract.codeToAddress(code2)).to.equal(contender2.address);
    });

    it("Should revert multiple registration with mismatched array lengths", async function () {
      const contenders = [contender1.address];
      const codes = [code1, code2];

      await expect(
        votingContract.connect(registrar).registerMultipleContenders(contenders, codes)
      ).to.be.revertedWith("Arrays length mismatch");
    });

    it("Should revert multiple registration with empty arrays", async function () {
      const emptyContenders: string[] = [];
      const emptyCodes: string[] = [];

      await expect(
        votingContract.connect(registrar).registerMultipleContenders(emptyContenders, emptyCodes)
      ).to.be.revertedWith("No contenders provided");
    });

    it("Should revert registration after voting started", async function () {
      await votingContract.connect(registrar).registerContender(contender1.address, code1);
      await votingContract.connect(registrar).startVoting();

      await expect(
        votingContract.connect(registrar).registerContender(contender2.address, code2)
      ).to.be.revertedWith("Voting already started");
    });
  });

  describe("Starting Voting", function () {
    it("Should revert starting voting without registered contenders", async function () {
      await expect(votingContract.connect(registrar).startVoting()).to.be.revertedWith(
        "No contenders registered"
      );
    });

    describe("With registered contender", function () {
      beforeEach(async function () {
        await votingContract.connect(registrar).registerContender(contender1.address, code1);
      });

      it("Should start voting by registrar", async function () {
        const startTimeBefore = await votingContract.votingStartTime();
        const tx = await votingContract.connect(registrar).startVoting();
        await tx.wait();
        const startTimeAfter = await votingContract.votingStartTime();
        const endTime = await votingContract.votingEndTime();

        expect(await votingContract.votingActive()).to.be.true;
        expect(startTimeAfter).to.be.gt(0n);
        expect(endTime).to.equal(startTimeAfter + votingDuration);
      });

      it("Should revert if non-registrar tries to start voting", async function () {
        await expect(votingContract.connect(voter1).startVoting()).to.be.revertedWith(
          "Only registrar can call this"
        );
      });

      it("Should revert starting voting if already started", async function () {
        await votingContract.connect(registrar).startVoting();
        await expect(votingContract.connect(registrar).startVoting()).to.be.revertedWith(
          "Voting already started"
        );
      });
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await votingContract.connect(registrar).registerMultipleContenders(
        [contender1.address, contender2.address],
        [code1, code2]
      );
      await votingContract.connect(registrar).startVoting();
    });

    it("Should allow voting during active period", async function () {
      await expect(votingContract.connect(voter1).vote(code1))
        .to.emit(votingContract, "VoteSuccess")
        .withArgs(voter1.address, contender1.address, code1);

      const details = await votingContract.getContender(code1);
      expect(details.votersNo).to.equal(1);
      expect(await votingContract.voted(voter1.address)).to.be.true;
      expect(await votingContract.voterToContender(voter1.address)).to.equal(contender1.address);
    });

    it("Should revert voting after end time", async function () {
      // Advance time beyond end
      await ethers.provider.send("evm_increaseTime", [Number(votingDuration) + 1]);
      await ethers.provider.send("evm_mine");

      await expect(votingContract.connect(voter1).vote(code1)).to.be.revertedWith(
        "Voting period has ended"
      );
    });

    it("Should revert if user already voted", async function () {
      await votingContract.connect(voter1).vote(code1);
      await expect(votingContract.connect(voter1).vote(code2)).to.be.revertedWith(
        "User already voted"
      );
    });

    it("Should revert voting with invalid code", async function () {
      await expect(votingContract.connect(voter1).vote("INVALID")).to.be.revertedWith(
        "Invalid contender code"
      );
    });

    it("Should revert voting when not active", async function () {
      // Advance time to allow ending
      await ethers.provider.send("evm_increaseTime", [Number(votingDuration) + 1]);
      await ethers.provider.send("evm_mine");
      await votingContract.connect(registrar).endVoting();
      await expect(votingContract.connect(voter1).vote(code1)).to.be.revertedWith(
        "Voting is not active"
      );
    });
  });

  describe("Ending Voting and Winners", function () {
    beforeEach(async function () {
      await votingContract.connect(registrar).registerMultipleContenders(
        [contender1.address, contender2.address],
        [code1, code2]
      );
      await votingContract.connect(registrar).startVoting();
    });

    it("Should end voting by registrar after period", async function () {
      // Some votes
      await votingContract.connect(voter1).vote(code1);
      await votingContract.connect(voter2).vote(code1);

      // Advance time
      await ethers.provider.send("evm_increaseTime", [Number(votingDuration) + 1]);
      await ethers.provider.send("evm_mine");

      const tx = await votingContract.connect(registrar).endVoting();
      await tx.wait();

      expect(await votingContract.votingActive()).to.be.false;
      expect(await votingContract.votingEnded()).to.be.true;

      await expect(tx)
        .to.emit(votingContract, "VotingEnded")
        .withArgs([contender1.address], 2); // contender1 has 2 votes
    });

    it("Should revert if non-registrar tries to end voting", async function () {
      // Advance time
      await ethers.provider.send("evm_increaseTime", [Number(votingDuration) + 1]);
      await ethers.provider.send("evm_mine");

      await expect(votingContract.connect(voter1).endVoting()).to.be.revertedWith(
        "Only registrar can call this"
      );
    });

    it("Should revert ending voting before period ends", async function () {
      await expect(votingContract.connect(registrar).endVoting()).to.be.revertedWith(
        "Voting period not ended"
      );
    });

    it("Should revert ending voting if not active", async function () {
      // Advance time and end first
      await ethers.provider.send("evm_increaseTime", [Number(votingDuration) + 1]);
      await ethers.provider.send("evm_mine");
      await votingContract.connect(registrar).endVoting();

      await expect(votingContract.connect(registrar).endVoting()).to.be.revertedWith(
        "Voting is not active"
      );
    });

    it("Should handle ties in winners", async function () {
      await votingContract.connect(voter1).vote(code1);
      await votingContract.connect(voter2).vote(code2); // 1 each

      await ethers.provider.send("evm_increaseTime", [Number(votingDuration) + 1]);
      await ethers.provider.send("evm_mine");

      await votingContract.connect(registrar).endVoting();

      const [winners, highest] = await votingContract.getWinners();
      expect(winners.length).to.equal(2);
      expect(winners[0]).to.equal(contender1.address);
      expect(winners[1]).to.equal(contender2.address);
      expect(highest).to.equal(1);
    });

    it("Should return correct winners via getWinners after ending", async function () {
      await votingContract.connect(voter1).vote(code1);
      await votingContract.connect(voter2).vote(code1);

      await ethers.provider.send("evm_increaseTime", [Number(votingDuration) + 1]);
      await ethers.provider.send("evm_mine");

      await votingContract.connect(registrar).endVoting();

      const [winners, highest] = await votingContract.getWinners();
      expect(winners.length).to.equal(1);
      expect(winners[0]).to.equal(contender1.address);
      expect(highest).to.equal(2);
    });

    it("Should revert getWinners if voting not ended", async function () {
      await expect(votingContract.getWinners()).to.be.revertedWith("Voting has not ended");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await votingContract.connect(registrar).registerContender(contender1.address, code1);
    });

    it("Should get contender details by code", async function () {
      const details = await votingContract.getContender(code1);
      expect(details.exists).to.be.true;
      expect(details.code).to.equal(code1);
      expect(details.votersNo).to.equal(0);
    });

    it("Should revert getContender with invalid code", async function () {
      await expect(votingContract.getContender("INVALID")).to.be.revertedWith(
        "Contender not found"
      );
    });

    it("Should get contender details by address", async function () {
      const details = await votingContract.getContenderByAddress(contender1.address);
      expect(details.exists).to.be.true;
      expect(details.code).to.equal(code1);
      expect(details.votersNo).to.equal(0);
    });

    it("Should revert getContenderByAddress with invalid address", async function () {
      await expect(
        votingContract.getContenderByAddress(ethers.ZeroAddress)
      ).to.be.revertedWith("Contender not found");
    });

    it("Should get all contenders", async function () {
      await votingContract.connect(registrar).registerContender(contender2.address, code2);
      const allContenders = await votingContract.getAllContenders();
      expect(allContenders.length).to.equal(2);
      expect(allContenders[0]).to.equal(contender1.address);
      expect(allContenders[1]).to.equal(contender2.address);
    });

    it("Should get vote counts for all contenders", async function () {
      await votingContract.connect(registrar).registerContender(contender2.address, code2);
      await votingContract.connect(registrar).startVoting();
      await votingContract.connect(voter1).vote(code1);

      const [addresses, votes] = await votingContract.getVoteCounts();
      expect(addresses.length).to.equal(2);
      expect(votes[0]).to.equal(1); // contender1
      expect(votes[1]).to.equal(0); // contender2
    });

    it("Should check if voting has expired", async function () {
      await votingContract.connect(registrar).startVoting();
      expect(await votingContract.hasVotingExpired()).to.be.false;

      await ethers.provider.send("evm_increaseTime", [Number(votingDuration) + 1]);
      await ethers.provider.send("evm_mine");
      expect(await votingContract.hasVotingExpired()).to.be.true;
    });

    it("Should get time remaining correctly", async function () {
      await votingContract.connect(registrar).startVoting();
      const remaining = await votingContract.getTimeRemaining();
      expect(remaining).to.be.gt(0n);

      await ethers.provider.send("evm_increaseTime", [Number(votingDuration)]);
      await ethers.provider.send("evm_mine");
      expect(await votingContract.getTimeRemaining()).to.equal(0n);
    });
  });
});