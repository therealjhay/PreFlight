// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {PreflightRegistry} from "../src/PreflightRegistry.sol";

contract PreflightRegistryScript is Script {
    PreflightRegistry public preFlightRegistry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        preFlightRegistry = new PreflightRegistry();

        vm.stopBroadcast();
    }
}
