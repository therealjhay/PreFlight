// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PreflightRegistry is Ownable {

    struct Reputation {
        uint256 riskScore;
        string reason;
        bool flagged;
        uint256 updatedAt;
        address reporter;
    }

    mapping(address => Reputation) private reputations;
    mapping(address => uint256) public reportCount;

    event AddressFlagged(
        address indexed target,
        uint256 riskScore,
        string reason,
        address indexed reporter,
        uint256 timestamp
    );

    event AddressUnflagged(
        address indexed target,
        address indexed removedBy,
        uint256 timestamp
    );

    event ReputationUpdated(
        address indexed target,
        uint256 oldScore,
        uint256 newScore,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function flagAddress(
        address target,
        uint256 score,
        string calldata reason
    )
        external
        onlyOwner
    {
        _flagAddress(target, score, reason);
    }

    function _flagAddress(
        address target,
        uint256 score,
        string calldata reason
    )
        internal
    {
        require(target != address(0), "Invalid address");
        require(score <= 100, "Score must be 0-100");
        require(bytes(reason).length > 0, "Reason required");

        uint256 oldScore = reputations[target].riskScore;

        reputations[target] = Reputation({
            riskScore: score,
            reason: reason,
            flagged: true,
            updatedAt: block.timestamp,
            reporter: msg.sender
        });

        reportCount[target]++;

        emit AddressFlagged(target, score, reason, msg.sender, block.timestamp);

        if (oldScore > 0) {
            emit ReputationUpdated(target, oldScore, score, block.timestamp);
        }
    }

    function unflagAddress(address target)
        external
        onlyOwner
    {
        require(reputations[target].flagged, "Address not flagged");

        delete reputations[target];

        emit AddressUnflagged(target, msg.sender, block.timestamp);
    }

    function getReputation(address target)
        external
        view
        returns(Reputation memory)
    {
        return reputations[target];
    }

    function isFlagged(address target)
        external
        view
        returns(bool)
    {
        return reputations[target].flagged;
    }

    function getRiskScore(address target)
        external
        view
        returns(uint256)
    {
        return reputations[target].riskScore;
    }

    function batchFlag(
        address[] calldata targets,
        uint256[] calldata scores,
        string[] calldata reasons
    )
        external
        onlyOwner
    {
        require(targets.length == scores.length, "Length mismatch");
        require(targets.length == reasons.length, "Length mismatch");
        require(targets.length <= 50, "Too many targets");

        for (uint256 i = 0; i < targets.length; i++) {
            _flagAddress(targets[i], scores[i], reasons[i]);
        }
    }
}
