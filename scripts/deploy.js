const { ethers } = require("hardhat");
const { Options } = require("@layerzerolabs/lz-v2-utilities");
function addressToBytes32(address) {
  return ethers.utils.hexZeroPad(address, 32);
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ChainSageOApp = await ethers.getContractFactory("ChainSageOApp");
  const endpoint = "0x6EDCE65403992e310A62460808c4b910D972f10f"; // LayerZero Zircuit/OPSepolia Testnet Endpoint
  const optimizer = await ChainSageOApp.deploy(endpoint, deployer.address);

  await optimizer.deployed();

  console.log("ChainSageOApp deployed to:", optimizer.address);

  const opchainSageOApp = await ChainSageOApp.deploy(
    endpoint,
    deployer.address
  );

  await opchainSageOApp.deployed();
  console.log(
    "Destination ChainSageOApp deployed to:",
    opchainSageOApp.address
  );

  // Add some initial strategies
  await optimizer.addStrategy(40282, "Strategy A", 500, 3, 1000, 2);
  await optimizer.addStrategy(40282, "Strategy B", 700, 4, 800, 3);
  await optimizer.addStrategy(40282, "Strategy C", 600, 2, 1200, 1);

  // Set chain ID mappings
  await optimizer.setChainIdMapping(48899, 40282); // Zircuit Testnet
  await optimizer.setChainIdMapping(11155420, 40232); // Example destination chain (e.g., Optimism Sepolia)

  console.log("Initial strategies added and chain ID mappings set");

  //cross-chain optimization
  await optimizer.setPeer(40232, addressToBytes32(opchainSageOApp.address));
  await opchainSageOApp.setPeer(40282, addressToBytes32(optimizer.address));
  console.log("Peers set");

  //   // Demonstrate cross-chain optimization
  //   const options = Options.newOptions()
  //     .addExecutorLzReceiveOption(200000, 0)
  //     .toHex()
  //     .toString();

  //   const tx = await optimizer.optimizeStrategy(40232, options, {
  //     value: ethers.utils.parseEther("0.01"),
  //     gasLimit: 500000,
  //   });

  //   console.log("Cross-chain optimization transaction sent:", tx.hash);
  //   await tx.wait();
  //   console.log("Cross-chain optimization transaction confirmed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
