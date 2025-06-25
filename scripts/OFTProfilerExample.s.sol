// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/// @title OFTProfilerExtension
/// @notice Mocks OFT transfer payloads and profiles their gas usage on multiple mainnet networks.
/// @dev This script generates fuzzed payloads for OFT transfers and profiles the gas consumption of these transfers on specified mainnet networks using LayerZero's `lzReceive` function.

import "forge-std/Script.sol";
import { GasProfilerScript, TestParams } from "./GasProfiler.s.sol";

// Import the OFT contract interfaces and libraries.
import { SendParam } from "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";
import { OFTMsgCodec } from "@layerzerolabs/oft-evm/contracts/libs/OFTMsgCodec.sol";

// Import the OptionsBuilder library for building OFT transfer options.
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";

contract OFTProfilerExample is Script {
    using OptionsBuilder for bytes;

    /// @notice Instance of GasProfilerScript used for profiling gas usage.
    GasProfilerScript public profiler;

    /// @notice Struct to hold configuration details for each target chain.
    struct ChainConfig {
        string rpcUrl; // RPC URL of the destination blockchain.
        address endpoint; // Address of the destination LayerZero EndpointV2 contract.
        uint32 srcEid; // Source Endpoint ID.
        uint32 dstEid; // Destination Endpoint ID.
        address sender; // Sender address.
        address receiver; // Receiver address.
        uint256 numOfRuns; // Number of profiling runs per payload.
    }

    /// @notice Array of configurations for each target chain.
    ChainConfig[] public chainConfigs;

    /// @notice Entry point for the script. Generates fuzzed payloads and profiles gas usage on multiple networks.
    /// @param numberOfPayloads The number of payloads to generate and profile.
    function run(uint256 numberOfPayloads) external {
        // Step 1: Deploy the GasProfilerScript contract which handles gas profiling.
        profiler = new GasProfilerScript();

        // Step 2: Generate fuzzed payloads based on the specified count.
        bytes[] memory payloads = _generateFuzzedPayloads(numberOfPayloads);

        // Step 3: Define configurations for each target chain.
        _configureChains();

        // Step 4: Iterate over each chain configuration and execute gas profiling.
        for (uint256 i = 0; i < chainConfigs.length; i++) {
            ChainConfig memory config = chainConfigs[i];

            // Step 4a: Define test parameters for the current chain.
            TestParams memory testParams = TestParams({
                srcEid: config.srcEid,
                sender: bytes32(uint256(uint160(config.sender))),
                dstEid: config.dstEid,
                receiver: config.receiver,
                payloads: payloads,
                msgValue: 0, // Ether value sent with the message.
                numOfRuns: config.numOfRuns
            });

            // Step 4b: Execute gas profiling for the current chain's lzReceive function.
            profiler.run_lzReceive(config.rpcUrl, config.endpoint, testParams);
        }
    }

    /// @notice Configures the target chains for profiling by populating the `chainConfigs` array.
    /// @dev Add or remove chain configurations as needed.
    function _configureChains() internal {
        // Example Configuration for Hedera Network
        chainConfigs.push(
            ChainConfig({
                rpcUrl: "http://localhost:7546",
                endpoint: 0x1a44076050125825900e736c501f859c50fE728c,
                srcEid: 40285, // Source Endpoint ID for Hedera
                dstEid: 40102, // Destination Endpoint ID for BSC
                sender: 0x65c477E7225167D361304292ce3030EeD5729CB6, // Sender address
                receiver: 0x65c477E7225167D361304292ce3030EeD5729CB6, // Receiver address
                numOfRuns: 1 // Number of profiling runs per payload
            })
        );

        // Example Configuration for BSC Network
        chainConfigs.push(
            ChainConfig({
                rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
                endpoint: 0x1a44076050125825900e736c501f859c50fE728c,
                srcEid: 40102, // Source Endpoint ID for BSC
                dstEid: 40285, // Destination Endpoint ID for Hedera
                sender: 0x65c477E7225167D361304292ce3030EeD5729CB6, // Sender address
                receiver: 0x65c477E7225167D361304292ce3030EeD5729CB6, // Receiver address
                numOfRuns: 1 // Number of profiling runs per payload
            })
        );
        // Add additional chain configurations here as needed.
    }

    /// @notice Generates an array of fuzzed payloads for OFT transfers.
    /// @param count The number of payloads to generate.
    /// @return payloads The array of fuzzed payloads.
    function _generateFuzzedPayloads(uint256 count) internal returns (bytes[] memory payloads) {
        payloads = new bytes[](count);

        for (uint256 i = 0; i < count; i++) {
            // Step 1: Generate fuzzed parameters.
            uint256 fuzzAmount = vm.randomUint(1e12, type(uint64).max);
            bytes32 fuzzToAddress = bytes32(uint256(uint160(vm.randomAddress())));

            // Step 2: Create SendParam struct with fuzzed values.
            SendParam memory sendParam = SendParam({
                dstEid: 30110, // Destination endpoint ID (can be varied if needed)
                to: fuzzToAddress, // Recipient address
                amountLD: fuzzAmount, // Amount to transfer
                minAmountLD: fuzzAmount, // Minimum amount
                extraOptions: OptionsBuilder.newOptions(), // Extra options for the transfer
                composeMsg: vm.randomBytes(vm.randomUint(0, 10000)), // simulate random message between 0 and 10_000 bytes
                oftCmd: ""
            });

            // Step 3: Encode the fuzzed message using OFTMsgCodec.
            (bytes memory message, ) = OFTMsgCodec.encode(
                sendParam.to,
                uint64(sendParam.amountLD),
                sendParam.composeMsg
            );

            // Step 4: Assign the encoded message to the payloads array.
            payloads[i] = message;
        }

        return payloads;
    }
}
