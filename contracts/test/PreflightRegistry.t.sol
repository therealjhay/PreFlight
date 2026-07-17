// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PreflightRegistry.sol";

contract PreflightRegistryTest is Test {

    PreflightRegistry registry;
    address owner = address(this);
    address attacker = address(0xBEEF);
    address target1 = address(0x123);
    address target2 = address(0x456);

    function setUp() public {
        registry = new PreflightRegistry();
    }

    function testFlagAddress() public {
        registry.flagAddress(target1, 95, "Fake token approval");

        PreflightRegistry.Reputation memory data = registry.getReputation(target1);

        assertEq(data.riskScore, 95);
        assertTrue(data.flagged);
        assertEq(data.reason, "Fake token approval");
        assertEq(data.reporter, owner);
        assertTrue(data.updatedAt > 0);
    }

    function testUnflagAddress() public {
        registry.flagAddress(target1, 95, "Malicious");
        assertTrue(registry.isFlagged(target1));

        registry.unflagAddress(target1);
        assertFalse(registry.isFlagged(target1));

        PreflightRegistry.Reputation memory data = registry.getReputation(target1);
        assertEq(data.riskScore, 0);
        assertFalse(data.flagged);
    }

    function testGetRiskScore() public {
        registry.flagAddress(target1, 75, "Phishing contract");
        assertEq(registry.getRiskScore(target1), 75);
    }

    function testReportCountIncrements() public {
        assertEq(registry.reportCount(target1), 0);

        registry.flagAddress(target1, 50, "First report");
        assertEq(registry.reportCount(target1), 1);

        registry.flagAddress(target1, 80, "Updated report");
        assertEq(registry.reportCount(target1), 2);
    }

    function testBatchFlag() public {
        address[] memory targets = new address[](2);
        targets[0] = target1;
        targets[1] = target2;

        uint256[] memory scores = new uint256[](2);
        scores[0] = 60;
        scores[1] = 90;

        string[] memory reasons = new string[](2);
        reasons[0] = "Suspicious";
        reasons[1] = "Known scam";

        registry.batchFlag(targets, scores, reasons);

        assertTrue(registry.isFlagged(target1));
        assertTrue(registry.isFlagged(target2));
        assertEq(registry.getRiskScore(target1), 60);
        assertEq(registry.getRiskScore(target2), 90);
    }

    function testRevertOnZeroAddress() public {
        vm.expectRevert("Invalid address");
        registry.flagAddress(address(0), 50, "Test");
    }

    function testRevertOnInvalidScore() public {
        vm.expectRevert("Score must be 0-100");
        registry.flagAddress(target1, 101, "Too high");
    }

    function testRevertOnEmptyReason() public {
        vm.expectRevert("Reason required");
        registry.flagAddress(target1, 50, "");
    }

    function testRevertOnUnflagWhenNotFlagged() public {
        vm.expectRevert("Address not flagged");
        registry.unflagAddress(target1);
    }

    function testRevertOnNonOwnerFlag() public {
        vm.prank(attacker);
        vm.expectRevert();
        registry.flagAddress(target1, 50, "Unauthorized");
    }

    function testRevertOnNonOwnerUnflag() public {
        registry.flagAddress(target1, 50, "Test");

        vm.prank(attacker);
        vm.expectRevert();
        registry.unflagAddress(target1);
    }

    function testRevertOnBatchLengthMismatch() public {
        address[] memory targets = new address[](2);
        targets[0] = target1;
        targets[1] = target2;

        uint256[] memory scores = new uint256[](1);
        scores[0] = 50;

        string[] memory reasons = new string[](2);
        reasons[0] = "Test";
        reasons[1] = "Test";

        vm.expectRevert("Length mismatch");
        registry.batchFlag(targets, scores, reasons);
    }

    function testRevertOnBatchTooMany() public {
        address[] memory targets = new address[](51);
        uint256[] memory scores = new uint256[](51);
        string[] memory reasons = new string[](51);

        for (uint256 i = 0; i < 51; i++) {
            targets[i] = address(uint160(i + 1));
            scores[i] = 50;
            reasons[i] = "Test";
        }

        vm.expectRevert("Too many targets");
        registry.batchFlag(targets, scores, reasons);
    }

    function testEventsEmitted() public {
        vm.expectEmit(true, false, false, true);
        emit PreflightRegistry.AddressFlagged(
            target1,
            95,
            "Malicious",
            owner,
            block.timestamp
        );

        registry.flagAddress(target1, 95, "Malicious");
    }

    function testOwnershipTransfer() public {
        address newOwner = address(0xCAFE);
        registry.transferOwnership(newOwner);

        vm.prank(newOwner);
        registry.flagAddress(target1, 50, "Transferred ownership works");

        assertTrue(registry.isFlagged(target1));
    }
}
