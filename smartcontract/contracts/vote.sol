// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

contract VotingContract{
    event contRegistered(
        address indexed contender,
        string indexed code
    );

    event voteSuccess(
        address indexed voter, 
        address indexed contender, 
        string indexed code
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

    function getContender (string memory code) public view returns(ContDetails memory)  {
        address c = codetoadd[code];
        ContDetails storage m = contenderdet[c];

        return (m);
    }

    //register all 3 conteners at once(make sure that the registrar has power over the election they created)
    //time frame for the voting process(given that the voting starts immediately after contenders registration) and 
    //Counting of vote for each contenders
    //automation to stop the voting when it time and paste winners accordinng to number of votes they got.
}