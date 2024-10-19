const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeFiStrategyOptimizer", function () {
  it("Should return all strategies", async function () {
    const DeFiStrategyOptimizer = await ethers.getContractFactory(
      "DeFiStrategyOptimizer"
    );
    const optimizer = await DeFiStrategyOptimizer.deploy();
    await optimizer.deployed();

    await optimizer.addStrategy("Strategy A", 500, 3, 1000, 2);
    await optimizer.addStrategy("Strategy B", 700, 4, 800, 3);
    await optimizer.addStrategy("Strategy C", 600, 2, 1200, 1);

    const strategies = await optimizer.getStrategiesData();
    expect(strategies.length).to.equal(3);
    expect(strategies[0].name).to.equal("Strategy A");
    expect(strategies[1].apy).to.equal(700);
    expect(strategies[2].risk).to.equal(2);
  });
});
