import React from "react";

function StrategyDisplay({ strategies, optimizedStrategy }) {
  return (
    <div>
      <h2>Current Strategies</h2>
      <ul>
        {strategies.map((strategy, index) => (
          <li key={index}>
            {strategy.name}: APY {strategy.apy}%, Risk {strategy.risk},
            Liquidity {strategy.liquidity}, Volatility {strategy.volatility}
          </li>
        ))}
      </ul>
      <h2>AI Recommended Strategy</h2>
      {optimizedStrategy && (
        <p>
          The AI recommends: {optimizedStrategy.name} with a score of{" "}
          {parseFloat(optimizedStrategy.score).toFixed(2)}
        </p>
      )}
    </div>
  );
}

export default StrategyDisplay;
