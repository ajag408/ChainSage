const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeFiStrategyOptimizer", function () {
  it("Should return the optimal strategy", async function () {
    const DeFiStrategyOptimizer = await ethers.getContractFactory(
      "DeFiStrategyOptimizer"
    );
    const optimizer = await DeFiStrategyOptimizer.deploy();
    await optimizer.deployed();

    await optimizer.addStrategy("Strategy A", 500, 3);
    await optimizer.addStrategy("Strategy B", 700, 4);
    await optimizer.addStrategy("Strategy C", 600, 2);

    const optimalStrategy = await optimizer.getOptimalStrategy();
    expect(optimalStrategy[0]).to.equal("Strategy B");
    expect(optimalStrategy[1]).to.equal(700);
  });
});
