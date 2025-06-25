const hre = require('hardhat');
const { ethers } = hre;

const { Options, addressToBytes32 } = require('@layerzerolabs/lz-v2-utilities');

async function main() {
    const OFT_ADDRESS = '0x1F4C069e4530E0F2eE844eb34c7F39Afe80E60Da';
    const TO = '0x65c477E7225167D361304292ce3030EeD5729CB6';
    const DST_EID = 40285; // Hedera testnet
    const AMOUNT = hre.ethers.utils.parseUnits('1', 18);

    const [signer] = await hre.ethers.getSigners();
    console.log('🚀 Sending with corrected configuration...');
    console.log('From:', signer.address);
    console.log('Network:', hre.network.name);

    const oft = await hre.ethers.getContractAt('MyOFT', OFT_ADDRESS, signer);

    try {
        // Check configuration first
        const peer = await oft.peers(DST_EID);
        console.log('Peer for EID', DST_EID + ':', peer);

        if (peer === '0x0000000000000000000000000000000000000000000000000000000000000000') {
            console.log('❌ No peer configured for EID', DST_EID);
            console.log('Run: npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts');
            return;
        }

        const balance = await oft.balanceOf(signer.address);
        console.log('Your balance:', hre.ethers.utils.formatUnits(balance, 18));

        if (balance.lt(AMOUNT)) {
            console.log('❌ Insufficient balance');
            return;
        }

        // Create send parameters
        const sendParam = {
            dstEid: DST_EID,
            to: addressToBytes32(TO),
            amountLD: AMOUNT,
            minAmountLD: AMOUNT,
            extraOptions: Options.newOptions().addExecutorLzReceiveOption(3000000, 0).toBytes(),
            composeMsg: ethers.utils.arrayify('0x'),
            oftCmd: ethers.utils.arrayify('0x'),
        };

        console.log('\n📋 Send Parameters:');
        console.log('- Destination EID:', DST_EID);
        console.log('- To:', TO);
        console.log('- Amount:', hre.ethers.utils.formatUnits(AMOUNT, 18));

        console.log('\n📤 Sending...');
        const tx = await oft.send(sendParam, { nativeFee: '1000000000000000', lzTokenFee: 0 }, signer.address, {
            value: '1000000000000000',
            gasLimit: 1_000_000,
        });

        console.log('✅ Transaction submitted!');
        console.log('TX Hash:', tx.hash);
        console.log('⏳ Waiting for confirmation...');

        const receipt = await tx.wait();

        if (receipt.status === 1) {
            console.log('✅ SUCCESS!');
            console.log('Block:', receipt.blockNumber);
            console.log('Gas used:', receipt.gasUsed.toString());
            console.log('\n🎉 Cross-chain transfer initiated!');
            console.log('Check BSC testnet for received tokens in a few minutes.');
        } else {
            console.log('❌ Transaction failed');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main().catch(console.error);
