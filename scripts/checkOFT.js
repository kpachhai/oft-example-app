const hre = require('hardhat');

async function main() {
    const OFT_ADDRESS = '0xf102Ed5E39f6241645EA2e1fDd5209A20F73D7dB';
    const [signer] = await hre.ethers.getSigners();

    console.log('Network:', hre.network.name);
    console.log('Your address:', signer.address);
    console.log('Contract address:', OFT_ADDRESS);

    const oft = await hre.ethers.getContractAt('MyOFT', OFT_ADDRESS, signer);

    try {
        // Get contract details
        const name = await oft.name();
        const symbol = await oft.symbol();
        const decimals = await oft.decimals();
        const totalSupply = await oft.totalSupply();
        const owner = await oft.owner();

        console.log('\n📋 Contract Details:');
        console.log('- Name:', name);
        console.log('- Symbol:', symbol);
        console.log('- Decimals:', decimals);
        console.log('- Total Supply:', hre.ethers.utils.formatUnits(totalSupply, decimals));
        console.log('- Owner:', owner);
        console.log('- You are owner:', owner.toLowerCase() === signer.address.toLowerCase());

        // Check your balance
        const balance = await oft.balanceOf(signer.address);
        console.log('\n💰 Your Balance:', hre.ethers.utils.formatUnits(balance, decimals));

        // Check owner's balance (if different from your address)
        if (owner.toLowerCase() !== signer.address.toLowerCase()) {
            const ownerBalance = await oft.balanceOf(owner);
            console.log('Owner Balance:', hre.ethers.utils.formatUnits(ownerBalance, decimals));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
