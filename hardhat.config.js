require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@layerzerolabs/test-devtools-evm-hardhat");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    zircuitTestnet: {
      url: "https://zircuit1-testnet.p2pify.com",
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000, // 1 gwei
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    imports: ["./node_modules"],
  },
  etherscan: {
    apiKey: {
      zircuitTestnet: "436B1F8A864E8FE0A3CC7A72C02B167F7D",
    },
    customChains: [
      {
        network: "zircuitTestnet",
        chainId: 48899,
        urls: {
          apiURL:
            "https://explorer.testnet.zircuit.com/api/contractVerifyHardhat",
          browserURL: "https://explorer.testnet.zircuit.com/",
        },
      },
    ],
  },
};
