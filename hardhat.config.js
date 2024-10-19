require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    zircuitTestnet: {
      url: "https://zircuit1-testnet.p2pify.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
