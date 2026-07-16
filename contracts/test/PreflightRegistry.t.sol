// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PreflightRegistry.sol";


contract PreflightRegistryTest is Test {

    PreflightRegistry registry;


    function setUp() public {
        registry = new PreflightRegistry();
    }


    function testAddFlaggedAddress() public {

        address scam = address(0x123);

        registry.addFlaggedAddress(
            scam,
            95,
            "Fake token approval"
        );


        PreflightRegistry.Reputation memory data =
            registry.getReputation(scam);


        assertEq(data.riskScore,95);
        assertTrue(data.flagged);
    }
}