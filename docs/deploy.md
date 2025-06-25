```bash
npx hardhat compile
```

```bash
npx hardhat lz:deploy

Network: hedera-testnet
Deployer: 0x65c477E7225167D361304292ce3030EeD5729CB6
Network: bsc-testnet
Deployer: 0x65c477E7225167D361304292ce3030EeD5729CB6
Deployed contract: MyOFT, network: bsc-testnet, address: 0x1F4C069e4530E0F2eE844eb34c7F39Afe80E60Da
Deployed contract: MyOFT, network: hedera-testnet, address: 0xf102Ed5E39f6241645EA2e1fDd5209A20F73D7dB
info:    ✓ Your contracts are now deployed
```

```bash
npx hardhat lz:oapp:config:init --oapp-config layerzero.config.ts --contract-name MyOFT
```

```bash
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

// Mint some tokens on Hedera 
```bash
kiranpachhai@C5P40GC7J9 oft-example-app % npx hardhat console --network hedera-testnet
WARNING: You are currently using Node.js v23.11.0, which is not supported by Hardhat. This can lead to unexpected behavior. See https://hardhat.org/nodejs-versions


Welcome to Node.js v23.11.0.
Type ".help" for more information.
> const oft = await ethers.getContractAt("MyOFT","0xf102Ed5E39f6241645EA2e1fDd5209A20F73D7dB")
undefined
> const [signer] = await ethers.getSigners()
undefined
> await oft.mint(signer.address, ethers.utils.parseUnits("100", 18))
{
  hash: '0x3556ef1ac1bbeb666a2cd7852a3484a67e265b3d86d99c95e80fd16518cd2b3b',
  type: 2,
  accessList: [],
  blockHash: '0x99d696254b394ae96ce06d09bcbe27c0121e541def89c857f66d27aaa59ce4c2',
  blockNumber: 21411407,
  transactionIndex: 7,
  confirmations: 1,
  from: '0x65c477E7225167D361304292ce3030EeD5729CB6',
  gasPrice: BigNumber { value: "0" },
  maxPriorityFeePerGas: BigNumber { value: "0" },
  maxFeePerGas: BigNumber { value: "69" },
  gasLimit: BigNumber { value: "70722" },
  to: '0xf102Ed5E39f6241645EA2e1fDd5209A20F73D7dB',
  value: BigNumber { value: "0" },
  nonce: 17,
  data: '0x40c10f1900000000000000000000000065c477e7225167d361304292ce3030eed5729cb60000000000000000000000000000000000000000000000056bc75e2d63100000',
  r: '0x69f520795dde3bae0be56e888d0a7eed4042ebbc2a9b050649d80cfda9612885',
  s: '0x0de4e24ab9f5fbfd4dacd9d480b806f690218b7e6c9c60d770a9ba404b60e831',
  v: 1,
  creates: null,
  chainId: 296,
  wait: [Function (anonymous)]
}
```

// Check balance
```bash
kiranpachhai@C5P40GC7J9 oft-example-app % npx hardhat run --network hedera-testnet scripts/checkOFT.js 
WARNING: You are currently using Node.js v23.11.0, which is not supported by Hardhat. This can lead to unexpected behavior. See https://hardhat.org/nodejs-versions


Network: hedera-testnet
Your address: 0x65c477E7225167D361304292ce3030EeD5729CB6
Contract address: 0xf102Ed5E39f6241645EA2e1fDd5209A20F73D7dB

📋 Contract Details:
- Name: MyOFT
- Symbol: MOFT
- Decimals: 18
- Total Supply: 100.0
- Owner: 0x65c477E7225167D361304292ce3030EeD5729CB6
- You are owner: true

💰 Your Balance: 100.0
```

// Send token from Hedera to BSC
```bash
npx hardhat run --network hedera-testnet scripts/sendOFTFromHederaToBSC.js

🚀 Sending with corrected configuration...
From: 0x65c477E7225167D361304292ce3030EeD5729CB6
Network: hedera-testnet
Peer for EID 40102: 0x0000000000000000000000001f4c069e4530e0f2ee844eb34c7f39afe80e60da
Your balance: 100.0

📋 Send Parameters:
- Destination EID: 40102
- To: 0x65c477E7225167D361304292ce3030EeD5729CB6
- Amount: 1.0

📤 Sending...
✅ Transaction submitted!
TX Hash: 0x6bcd2108105e59cd2cc79072d93caca2761b36b0b3362f408b5121bb7860941f
⏳ Waiting for confirmation...
✅ SUCCESS!
Block: 21413077
Gas used: 8000000

🎉 Cross-chain transfer initiated!
Check BSC testnet for received tokens in a few minutes.
```

// Send token from BSC to Hedera
```bash
npx hardhat run --network bsc-testnet ./scripts/sendOFTFromBSCToHedera.js


```



