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


    function registration ( address cont, string memory code) public {
        codetoadd[code] = cont;
        ContDetails storage c = contenderdet[cont];
        c.code = code;
        c.votersNo = 0;

        emit contRegistered ( cont, code);

    }

    function vote ( string memory code) public payable {
        address sender = msg.sender;
        require(voted[sender] == false, "user already voted");
        voted[sender] = true;
        address c = codetoadd[code];
        voter2cont[sender] = c;
        ContDetails storage m = contenderdet[c];
        m.votersNo += 1;
        emit voteSuccess(sender, c, code);
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