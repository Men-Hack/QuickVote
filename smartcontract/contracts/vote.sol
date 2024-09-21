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

    address voter;

    struct ContDetails {
        address contender;
        string code;
        uint32 votersNo;
    }  
    mapping (address => bool) voted;
    mapping (string => address) codetoadd;
    mapping (address => address) voter2cont;
    mapping (address => ContDetails) contenderdet;


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