import React, { useState, useEffect } from "react";
import StrategyDisplay from "./StrategyDisplay";
import { ethers } from "ethers";
import ChainSageOAppABI from "../artifacts/contracts/ChainSageOApp.sol/ChainSageOApp.json";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import PhalaAIModel from "../PhalaAIModel";

const contractAddress = "0xD12b1AA4dc3B67344BCa78595B6aB18649DE1c22";
// 0x47837D3715F5B46B0BC470c202b644e3Cf6B99B2
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

function AIOptimizer({ provider, network }) {
  const [strategies, setStrategies] = useState([]);
  const [optimizedStrategy, setOptimizedStrategy] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const ZIRCUIT_TESTNET_EID = 40282;
  const DESTINATION_EID = 40232; // Example destination chain EID

  useEffect(() => {
    if (provider) {
      fetchStrategies();
    }
  }, [provider]);

  const fetchStrategies = async () => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ChainSageOAppABI.abi,
        provider
      );
      const fetchedStrategies = await contract.getStrategiesData(
        ZIRCUIT_TESTNET_EID
      );
      setStrategies(fetchedStrategies);
    } catch (error) {
      console.error("Error fetching strategies:", error);
    }
  };

  const optimizeStrategy = async () => {
    setIsOptimizing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        ChainSageOAppABI.abi,
        signer
      );

      const options = Options.newOptions()
        .addExecutorLzReceiveOption(200000, 0)
        .toHex()
        .toString();

      const tx = await contract.optimizeStrategy(DESTINATION_EID, options, {
        value: ethers.utils.parseEther("0.01"),
        gasLimit: 500000,
      });

      console.log("Waiting for transaction receipt...");
      const receipt = await waitForTransaction(provider, tx.hash);
      console.log("Transaction mined. Gas used:", receipt.gasUsed.toString());

      // Simulate StrategyOptimized event
      setTimeout(() => {
        const simulatedStrategy = {
          name: "Simulated Optimal Strategy",
          apy: (Math.random() * 1000).toFixed(2).toString(),
        };
        setOptimizedStrategy(simulatedStrategy);
        setIsOptimizing(false);
      }, 3000); // Simulate a 3-second delay
    } catch (error) {
      console.error("Error optimizing strategy:", error);
      alert("Error optimizing strategy. Please check the console for details.");
      setIsOptimizing(false);
    }
  };

  const optimizeZircuitStrategy = async () => {
    setIsOptimizing(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        ChainSageOAppABI.abi,
        signer
      );

      const options = Options.newOptions()
        .addExecutorLzReceiveOption(200000, 0)
        .toHex()
        .toString();

      const tx = await contract.optimizeStrategy(DESTINATION_EID, options, {
        value: ethers.utils.parseEther("0.01"),
        gasLimit: 500000,
      });

      console.log("Waiting for transaction receipt...");
      const receipt = await waitForTransaction(provider, tx.hash);
      console.log("Transaction confirmed:", receipt.transactionHash);

      // Simulate Zircuit-specific optimization
      setTimeout(() => {
        const zircuitStrategies = strategies.map((strategy) => ({
          ...strategy,
          apy: Math.floor(strategy.apy * 1.05), // 5% APY bonus
        }));
        const bestStrategy = zircuitStrategies.reduce((prev, current) =>
          prev.apy > current.apy ? prev : current
        );
        setOptimizedStrategy({
          name: `${bestStrategy.name}`,
          apy: bestStrategy.apy.toString(),
        });
        setIsOptimizing(false);
      }, 3000);
    } catch (error) {
      console.error("Error optimizing Zircuit strategy:", error);
      alert(
        "Error optimizing Zircuit strategy. Please check the console for details."
      );
      setIsOptimizing(false);
    }
  };

  const optimizeWithPhala = async () => {
    setIsOptimizing(true);
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ChainSageOAppABI.abi,
        provider
      );

      const phalaModel = new PhalaAIModel(
        contractAddress,
        ChainSageOAppABI.abi,
        provider
      );
      const optimizedStrategy = await phalaModel.optimizeStrategy(strategies);

      setOptimizedStrategy({
        name: optimizedStrategy.name,
        apy: optimizedStrategy.apy.toString(),
      });
      setIsOptimizing(false);
    } catch (error) {
      console.error("Error optimizing with Phala:", error);
      alert(
        "Error optimizing with Phala. Please check the console for details."
      );
      setIsOptimizing(false);
    }
  };

  return (
    <div>
      <h2>Cross-Chain DeFi Strategy Optimizer</h2>
      <StrategyDisplay
        strategies={strategies.map((strategy) => ({
          ...strategy,
          apy: strategy.apy.toString(),
          risk: strategy.risk.toString(),
          liquidity: strategy.liquidity.toString(),
          volatility: strategy.volatility.toString(),
        }))}
        optimizedStrategy={optimizedStrategy}
      />
      <button onClick={optimizeStrategy} disabled={isOptimizing}>
        {isOptimizing ? "Optimizing..." : "Optimize Strategy"}
      </button>
      <button onClick={optimizeZircuitStrategy} disabled={isOptimizing}>
        {isOptimizing ? "Optimizing..." : "Optimize Zircuit Strategy"}
      </button>
      <button onClick={optimizeWithPhala} disabled={isOptimizing}>
        {isOptimizing ? "Optimizing..." : "Optimize with Phala"}
      </button>
      {isOptimizing && <p>Optimizing strategy across chains. Please wait...</p>}
    </div>
  );
}

export default AIOptimizer;
