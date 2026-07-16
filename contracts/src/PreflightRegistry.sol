// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PreflightRegistry {

    struct Reputation {
        uint256 riskScore;
        string reason;
        bool flagged;
        uint256 updatedAt;
    }

    mapping(address => Reputation) private reputations;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addFlaggedAddress(
        address target,
        uint256 score,
        string calldata reason
    )
        external
        onlyOwner
    {
        require(score <= 100, "Invalid score");

        reputations[target] = Reputation({
            riskScore: score,
            reason: reason,
            flagged: true,
            updatedAt: block.timestamp
        });
    }

    function getReputation(address target)
        external
        view
        returns(Reputation memory)
    {
        return reputations[target];
    }

    function removeFlag(
        address target
    )
        external
        onlyOwner
    {
        delete reputations[target];
    }
}