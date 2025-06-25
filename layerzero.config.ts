import { EndpointId } from '@layerzerolabs/lz-definitions'
const bsc_testnetContract = {
    eid: EndpointId.BSC_V2_TESTNET,
    contractName: 'MyOFT',
}
const hedera_testnetContract = {
    eid: EndpointId.HEDERA_V2_TESTNET,
    contractName: 'MyOFT',
}
export default {
    contracts: [{ contract: bsc_testnetContract }, { contract: hedera_testnetContract }],
    connections: [
        {
            from: bsc_testnetContract,
            to: hedera_testnetContract,
            config: {
                sendLibrary: '0x55f16c442907e86D764AFdc2a07C2de3BdAc8BB7',
                receiveLibraryConfig: { receiveLibrary: '0x188d4bbCeD671A7aA2b5055937F79510A32e9683', gracePeriod: 0 },
                sendConfig: {
                    executorConfig: { maxMessageSize: 10000, executor: '0x31894b190a8bAbd9A067Ce59fde0BfCFD2B18470' },
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ['0x0eE552262f7B562eFcED6DD4A7e2878AB897d405'],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 1,
                        requiredDVNs: ['0x0eE552262f7B562eFcED6DD4A7e2878AB897d405'],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
            },
        },
        {
            from: hedera_testnetContract,
            to: bsc_testnetContract,
            config: {
                sendLibrary: '0x1707575F7cEcdC0Ad53fde9ba9bda3Ed5d4440f4',
                receiveLibraryConfig: { receiveLibrary: '0xc0c34919A04d69415EF2637A3Db5D637a7126cd0', gracePeriod: 0 },
                sendConfig: {
                    executorConfig: { maxMessageSize: 10000, executor: '0xe514D331c54d7339108045bF4794F8d71cad110e' },
                    ulnConfig: {
                        confirmations: 1,
                        requiredDVNs: ['0xEc7Ee1f9e9060e08dF969Dc08EE72674AfD5E14D'],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 5,
                        requiredDVNs: ['0xEc7Ee1f9e9060e08dF969Dc08EE72674AfD5E14D'],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
            },
        },
    ],
}
