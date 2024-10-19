async function main() {
  const DeFiStrategyOptimizer = await ethers.getContractFactory(
    "DeFiStrategyOptimizer"
  );
  const optimizer = await DeFiStrategyOptimizer.deploy();
  await optimizer.deployed();
  console.log("DeFiStrategyOptimizer deployed to:", optimizer.address);

  // Add some initial strategies
  await optimizer.addStrategy("Strategy A", 500, 3, 1000, 2);
  await optimizer.addStrategy("Strategy B", 700, 4, 800, 3);
  await optimizer.addStrategy("Strategy C", 600, 2, 1200, 1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
