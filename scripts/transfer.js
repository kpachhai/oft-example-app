const hre = require('hardhat');

async function main() {
    const OFT_ADDRESS = '0xf102Ed5E39f6241645EA2e1fDd5209A20F73D7dB';
    const AMOUNT = hre.ethers.utils.parseUnits('10', 18);

    // You'll need to use the owner's private key for this
    // Make sure the owner has tokens and you have access to the owner account
    const [signer] = await hre.ethers.getSigners();

    const oft = await hre.ethers.getContractAt('MyOFT', OFT_ADDRESS, signer);

    const owner = await oft.owner();
    console.log('Contract owner:', owner);
    console.log('Your address:', signer.address);

    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
        console.log('❌ You are not the owner. Cannot transfer tokens.');
        return;
    }

    // Transfer tokens to yourself
    const tx = await oft.transfer(signer.address, AMOUNT);
    console.log('Transfer tx:', tx.hash);
    await tx.wait();
    console.log('✅ Transferred tokens to yourself');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
