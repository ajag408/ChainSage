import React, { useState, useEffect } from "react";
import AIModel from "../AIModel";
import StrategyDisplay from "./StrategyDisplay";
import { ethers } from "ethers";
import DeFiStrategyOptimizerABI from "../artifacts/contracts/DeFiStrategyOptimizer.sol/DeFiStrategyOptimizer.json";

const contractAddress = "0x9317ce9c06a8f69ACB3bf47f11ce4026ebD7cB84";

function AIOptimizer({ provider, network }) {
  const [strategies, setStrategies] = useState([]);
  const [aiModel, setAiModel] = useState(null);
  const [optimizedStrategy, setOptimizedStrategy] = useState(null);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const contract = new ethers.Contract(
          contractAddress,
          DeFiStrategyOptimizerABI.abi,
          provider
        );
        console.log("Contract instance created");
        const fetchedStrategies = await contract.getStrategiesData();
        const processedStrategies = fetchedStrategies.map((strategy) => ({
          name: strategy.name,
          apy: strategy.apy.toString(),
          risk: strategy.risk.toString(),
          liquidity: strategy.liquidity.toString(),
          volatility: strategy.volatility.toString(),
        }));
        console.log("Fetched strategies:", processedStrategies);
        setStrategies(processedStrategies);
      } catch (error) {
        console.error("Error fetching strategies:", error);
        setStrategies([]);
      }
    };

    if (provider && network) {
      fetchStrategies();
      setAiModel(new AIModel());
    }
  }, [provider, network]);

  useEffect(() => {
    if (aiModel && strategies.length > 0) {
      const timer = setTimeout(() => {
        trainAndPredict();
      }, 1000); // Delay of 1 second
      return () => clearTimeout(timer);
    }
  }, [aiModel, strategies]);

  const trainAndPredict = async () => {
    if (isTraining) return;
    setIsTraining(true);
    try {
      const trainingData = strategies.map((s) => [
        parseFloat(s.apy),
        parseFloat(s.risk),
        parseFloat(s.liquidity),
        parseFloat(s.volatility),
      ]);
      const labels = strategies.map((s) => [parseFloat(s.apy)]);

      await aiModel.train(trainingData, labels);

      const predictions = strategies.map((s) => ({
        name: s.name,
        score: aiModel.predict([
          parseFloat(s.apy),
          parseFloat(s.risk),
          parseFloat(s.liquidity),
          parseFloat(s.volatility),
        ]),
      }));

      const bestStrategy = predictions.reduce((prev, current) =>
        prev.score > current.score ? prev : current
      );

      setOptimizedStrategy(bestStrategy);
    } catch (error) {
      console.error("Error in trainAndPredict:", error);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div>
      <h2>DeFi Strategy Optimizer</h2>
      <StrategyDisplay
        strategies={strategies}
        optimizedStrategy={optimizedStrategy}
      />
    </div>
  );
}

export default AIOptimizer;
