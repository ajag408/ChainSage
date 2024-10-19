import React, { useState, useEffect } from "react";
import AIModel from "../AIModel";
import { ethers } from "ethers";
import DeFiStrategyOptimizerABI from "../artifacts/contracts/DeFiStrategyOptimizer.sol/DeFiStrategyOptimizer.json";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function AIOptimizer() {
  const [strategies, setStrategies] = useState([]);
  const [aiModel, setAiModel] = useState(null);
  const [optimizedStrategy, setOptimizedStrategy] = useState(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        DeFiStrategyOptimizerABI.abi,
        provider
      );
      const fetchedStrategies = await contract.getStrategiesData();
      setStrategies(fetchedStrategies);
    };

    fetchStrategies();
    setAiModel(new AIModel());
  }, []);

  useEffect(() => {
    if (aiModel && strategies.length > 0) {
      trainAndPredict();
    }
  }, [aiModel, strategies]);

  const trainAndPredict = async () => {
    const trainingData = strategies.map((s) => [
      s.apy,
      s.risk,
      s.liquidity,
      s.volatility,
    ]);
    const labels = strategies.map((s) => [s.apy]); // Using APY as the target variable

    await aiModel.train(trainingData, labels);

    const predictions = strategies.map((s) => ({
      name: s.name,
      score: aiModel.predict([s.apy, s.risk, s.liquidity, s.volatility]),
    }));

    const bestStrategy = predictions.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );

    setOptimizedStrategy(bestStrategy);
  };

  return (
    <div>
      <h2>AI Optimized Strategy</h2>
      {optimizedStrategy && (
        <p>
          The AI recommends: {optimizedStrategy.name} with a score of{" "}
          {optimizedStrategy.score.toFixed(2)}
        </p>
      )}
    </div>
  );
}

export default AIOptimizer;
