// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

contract VotingContract {
    event ContenderRegistered(
        address indexed contender,
        string code
    );

    event VoteSuccess(
        address indexed voter, 
        address indexed contender, 
        string code
    ); 

    event VotingEnded(
        address[] winners,
        uint32 highestVotes
    );

    address public immutable registrar;
    uint256 public votingStartTime;
    uint256 public votingEndTime;
    uint256 public constant VOTING_DURATION = 7 days;
    bool public votingActive;
    bool public votingEnded;

    struct ContDetails {
        address contender;
        string code;
        uint32 votersNo;
        bool exists;
    }

    address[] public contendersList;
    mapping(address => bool) public voted;
    mapping(string => address) public codeToAddress;
    mapping(address => address) public voterToContender;
    mapping(address => ContDetails) public contenderDetails;

    modifier onlyRegistrar() {
        require(msg.sender == registrar, "Only registrar can call this");
        _;
    }

    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        require(block.timestamp >= votingStartTime, "Voting has not started");
        require(block.timestamp <= votingEndTime, "Voting period has ended");
        _;
    }

    modifier votingNotStarted() {
        require(!votingActive, "Voting already started");
        _;
    }

    constructor() {
        registrar = msg.sender;
    }

    // Register a single contender
    function registerContender(address cont, string memory code) public onlyRegistrar votingNotStarted {
        require(cont != address(0), "Invalid contender address");
        require(bytes(code).length > 0, "Code cannot be empty");
        require(codeToAddress[code] == address(0), "Code already exists");
        require(!contenderDetails[cont].exists, "Contender already registered");

        codeToAddress[code] = cont;
        contendersList.push(cont);
        
        ContDetails storage c = contenderDetails[cont];
        c.contender = cont;
        c.code = code;
        c.votersNo = 0;
        c.exists = true;

        emit ContenderRegistered(cont, code);
    }

    // Register multiple contenders at once
    function registerMultipleContenders(
        address[] memory contenders, 
        string[] memory codes
    ) public onlyRegistrar votingNotStarted {
        require(contenders.length == codes.length, "Arrays length mismatch");
        require(contenders.length > 0, "No contenders provided");

        for (uint256 i = 0; i < contenders.length; i++) {
            registerContender(contenders[i], codes[i]);
        }
    }

    // Start the voting process
    function startVoting() public onlyRegistrar votingNotStarted {
        require(contendersList.length > 0, "No contenders registered");
        
        votingActive = true;
        votingStartTime = block.timestamp;
        votingEndTime = block.timestamp + VOTING_DURATION;
    }

    // Cast a vote
    function vote(string memory code) public votingIsActive {
        address sender = msg.sender;
        require(!voted[sender], "User already voted");
        
        address contender = codeToAddress[code];
        require(contender != address(0), "Invalid contender code");
        require(contenderDetails[contender].exists, "Contender does not exist");

        voted[sender] = true;
        voterToContender[sender] = contender;
        
        ContDetails storage m = contenderDetails[contender];
        m.votersNo += 1;
        
        emit VoteSuccess(sender, contender, code);
    }

    // End voting and determine winners
    function endVoting() public onlyRegistrar {
        require(votingActive, "Voting is not active");
        require(block.timestamp > votingEndTime || votingEnded, "Voting period not ended");
        
        votingActive = false;
        votingEnded = true;

        // Find highest vote count
        uint32 highestVotes = 0;
        for (uint256 i = 0; i < contendersList.length; i++) {
            uint32 votes = contenderDetails[contendersList[i]].votersNo;
            if (votes > highestVotes) {
                highestVotes = votes;
            }
        }

        // Collect all winners (in case of tie)
        address[] memory winners = new address[](contendersList.length);
        uint256 winnerCount = 0;
        
        for (uint256 i = 0; i < contendersList.length; i++) {
            if (contenderDetails[contendersList[i]].votersNo == highestVotes) {
                winners[winnerCount] = contendersList[i];
                winnerCount++;
            }
        }

        // Resize winners array
        address[] memory finalWinners = new address[](winnerCount);
        for (uint256 i = 0; i < winnerCount; i++) {
            finalWinners[i] = winners[i];
        }

        emit VotingEnded(finalWinners, highestVotes);
    }

    // Get contender details by code
    function getContender(string memory code) public view returns(ContDetails memory) {
        address cont = codeToAddress[code];
        require(cont != address(0), "Contender not found");
        return contenderDetails[cont];
    }

    // Get contender details by address
    function getContenderByAddress(address cont) public view returns(ContDetails memory) {
        require(contenderDetails[cont].exists, "Contender not found");
        return contenderDetails[cont];
    }

    // Get all contenders
    function getAllContenders() public view returns(address[] memory) {
        return contendersList;
    }

    // Get vote counts for all contenders
    function getVoteCounts() public view returns(address[] memory, uint32[] memory) {
        uint256 length = contendersList.length;
        address[] memory addresses = new address[](length);
        uint32[] memory votes = new uint32[](length);

        for (uint256 i = 0; i < length; i++) {
            addresses[i] = contendersList[i];
            votes[i] = contenderDetails[contendersList[i]].votersNo;
        }

        return (addresses, votes);
    }

    // Get winners (can be called after voting ends)
    function getWinners() public view returns(address[] memory, uint32) {
        require(votingEnded, "Voting has not ended");

        uint32 highestVotes = 0;
        for (uint256 i = 0; i < contendersList.length; i++) {
            uint32 votes = contenderDetails[contendersList[i]].votersNo;
            if (votes > highestVotes) {
                highestVotes = votes;
            }
        }

        address[] memory winners = new address[](contendersList.length);
        uint256 winnerCount = 0;
        
        for (uint256 i = 0; i < contendersList.length; i++) {
            if (contenderDetails[contendersList[i]].votersNo == highestVotes) {
                winners[winnerCount] = contendersList[i];
                winnerCount++;
            }
        }

        address[] memory finalWinners = new address[](winnerCount);
        for (uint256 i = 0; i < winnerCount; i++) {
            finalWinners[i] = winners[i];
        }

        return (finalWinners, highestVotes);
    }

    // Check if voting time has expired
    function hasVotingExpired() public view returns(bool) {
        return votingActive && block.timestamp > votingEndTime;
    }

    // Get time remaining for voting
    function getTimeRemaining() public view returns(uint256) {
        if (!votingActive || block.timestamp >= votingEndTime) {
            return 0;
        }
        return votingEndTime - block.timestamp;
    }
}