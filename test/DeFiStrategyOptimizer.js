const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Options } = require("@layerzerolabs/lz-v2-utilities");

function addressToBytes32(address) {
  return ethers.utils.hexZeroPad(address, 32);
}

async function waitForTransaction(provider, txHash, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Attempt ${i + 1} to get transaction receipt...`);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt) {
      return receipt;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds between attempts
  }
  throw new Error(`Transaction not mined after ${maxAttempts} attempts`);
}

describe("ChainSageOApp", function () {
  this.timeout(120000); // Increase timeout to 2 minutes
  let ChainSageOApp;
  let chainSageOApp;
  let owner;
  let user;
  let endpointV2Mock;

  const ZIRCUIT_TESTNET_EID = 40282;
  const DESTINATION_EID = 40232;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy ChainSageOApp
    ChainSageOApp = await ethers.getContractFactory("ChainSageOApp");
    chainSageOApp = await ChainSageOApp.deploy(
      "0x6EDCE65403992e310A62460808c4b910D972f10f",
      owner.address
    );
    await chainSageOApp.deployed();
    console.log("ChainSageOApp deployed to:", chainSageOApp.address);

    opchainSageOApp = await ChainSageOApp.deploy(
      "0x6EDCE65403992e310A62460808c4b910D972f10f",
      owner.address
    );

    await opchainSageOApp.deployed();
    console.log(
      "Destination ChainSageOApp deployed to:",
      opchainSageOApp.address
    );
  });

  it("Should add strategies", async function () {
    await chainSageOApp
      .connect(owner)
      .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy A", 500, 3, 1000, 2);
    await chainSageOApp
      .connect(owner)
      .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy B", 700, 4, 800, 3);

    const strategies = await chainSageOApp.getStrategiesData(
      ZIRCUIT_TESTNET_EID
    );
    expect(strategies.length).to.equal(2);
    expect(strategies[0].name).to.equal("Strategy A");
    expect(strategies[1].apy).to.equal(700);
  });

  it("Should set chain ID mappings", async function () {
    await chainSageOApp
      .connect(owner)
      .setChainIdMapping(48899, ZIRCUIT_TESTNET_EID);
    await chainSageOApp
      .connect(owner)
      .setChainIdMapping(11155420, DESTINATION_EID); //optimism sepolia

    expect(await chainSageOApp.chainIdToEid(48899)).to.equal(
      ZIRCUIT_TESTNET_EID
    );
    expect(await chainSageOApp.eidToChainId(DESTINATION_EID)).to.equal(
      11155420
    );
  });

  it.only("Should optimize strategy across chains", async function () {
    const balance = await ethers.provider.getBalance(owner.address);
    console.log("Account balance:", ethers.utils.formatEther(balance));

    await chainSageOApp
      .connect(owner)
      .setChainIdMapping(
        await ethers.provider.getNetwork().then((n) => n.chainId),
        ZIRCUIT_TESTNET_EID
      );
    console.log("Chain ID mapping set");

    await chainSageOApp
      .connect(owner)
      .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy A", 500, 3, 1000, 2);
    await chainSageOApp
      .connect(owner)
      .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy B", 700, 4, 800, 3);
    await chainSageOApp
      .connect(owner)
      .addStrategy(DESTINATION_EID, "Strategy C", 800, 3, 900, 2);
    console.log("Strategies added");

    await chainSageOApp
      .connect(owner)
      .setPeer(DESTINATION_EID, addressToBytes32(opchainSageOApp.address));
    await opchainSageOApp
      .connect(owner)
      .setPeer(ZIRCUIT_TESTNET_EID, addressToBytes32(chainSageOApp.address));
    console.log("Peers set");

    const options = Options.newOptions()
      .addExecutorLzReceiveOption(200000, 0)
      .toHex()
      .toString();

    console.log("options: ", options);

    console.log("Optimizing strategy...");
    const tx = await chainSageOApp
      .connect(owner)
      .optimizeStrategy(DESTINATION_EID, options, {
        value: ethers.utils.parseEther("0.01"),
        gasLimit: 500000,
      });

    console.log("Transaction hash:", tx.hash);

    console.log("Waiting for transaction receipt...");
    const receipt = await waitForTransaction(ethers.provider, tx.hash);
    console.log("Transaction mined. Gas used:", receipt.gasUsed.toString());

    console.log("Transaction logs:", receipt.logs);

    const decodedLogs = receipt.logs
      .map((log) => {
        try {
          return chainSageOApp.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    console.log("Decoded logs:", decodedLogs);

    const strategyOptimizedEvent = decodedLogs.find(
      (log) => log.name === "StrategyOptimized"
    );

    if (strategyOptimizedEvent) {
      console.log(
        "StrategyOptimized event found:",
        strategyOptimizedEvent.args
      );
      expect(strategyOptimizedEvent).to.not.be.undefined;
    } else {
      console.log("StrategyOptimized event not found");
      const contractLogs = await ethers.provider.getLogs({
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber,
        address: chainSageOApp.address,
      });
      console.log("Contract logs:", contractLogs);
    }

    // Check if the strategies were actually added
    const strategiesOnSource = await chainSageOApp.getStrategiesData(
      ZIRCUIT_TESTNET_EID
    );
    console.log("Strategies on source chain:", strategiesOnSource);

    const strategiesOnDestination = await opchainSageOApp.getStrategiesData(
      DESTINATION_EID
    );
    console.log("Strategies on destination chain:", strategiesOnDestination);
  });

  it("Should compare strategies across chains", async function () {
    await chainSageOApp
      .connect(owner)
      .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy A", 500, 3, 1000, 2);
    await chainSageOApp
      .connect(owner)
      .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy B", 700, 4, 800, 3);
    await chainSageOApp
      .connect(owner)
      .addStrategy(DESTINATION_EID, "Strategy C", 800, 3, 900, 2);

    const [bestStrategy, bestChainId] =
      await chainSageOApp.compareStrategiesAcrossChains([
        ZIRCUIT_TESTNET_EID,
        DESTINATION_EID,
      ]);

    expect(bestStrategy.name).to.equal("Strategy C");
    expect(bestChainId).to.equal(DESTINATION_EID);
  });

  // it("Should optimize Zircuit strategy with bonus", async function () {
  //   await chainSageOApp
  //     .connect(owner)
  //     .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy A", 1000, 3, 1000, 2);

  //   await chainSageOApp
  //     .connect(user)
  //     .optimizeZircuitStrategy(
  //       ZIRCUIT_TESTNET_EID,
  //       ethers.utils.defaultAbiCoder.encode(["uint16", "uint256"], [1, 200000]),
  //       { value: ethers.utils.parseEther("0.1") }
  //     );

  //   const strategies = await chainSageOApp.getStrategiesData(
  //     ZIRCUIT_TESTNET_EID
  //   );
  //   expect(strategies[0].apy).to.equal(1050); // 5% bonus applied
  // });

  // it("Should optimize strategy using Phala simulation", async function () {
  //   await chainSageOApp
  //     .connect(owner)
  //     .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy A", 500, 3, 1000, 2);
  //   await chainSageOApp
  //     .connect(owner)
  //     .addStrategy(ZIRCUIT_TESTNET_EID, "Strategy B", 700, 4, 800, 3);

  //   await expect(
  //     chainSageOApp.connect(user).optimizeWithPhala(ZIRCUIT_TESTNET_EID)
  //   )
  //     .to.emit(chainSageOApp, "StrategyOptimized")
  //     .withArgs(ZIRCUIT_TESTNET_EID, ZIRCUIT_TESTNET_EID, "Strategy B", 700);
  // });
});
