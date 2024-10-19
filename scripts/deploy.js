async function main() {
  const DeFiStrategyOptimizer = await ethers.getContractFactory(
    "DeFiStrategyOptimizer"
  );
  const optimizer = await DeFiStrategyOptimizer.deploy();
  await optimizer.deployed();
  console.log("DeFiStrategyOptimizer deployed to:", optimizer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
