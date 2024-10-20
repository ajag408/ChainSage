import React from "react";

function StrategyDisplay({ strategies, optimizedStrategy }) {
  return (
    <div>
      <h3>Available Strategies:</h3>
      {strategies.map((strategy, index) => (
        <div key={index}>
          <p>Name: {strategy.name}</p>
          <p>APY: {strategy.apy}%</p>
          <p>Risk: {strategy.risk}</p>
          <p>Liquidity: {strategy.liquidity}</p>
          <p>Volatility: {strategy.volatility}</p>
        </div>
      ))}
      {optimizedStrategy && (
        <div>
          <h3>Optimized Strategy:</h3>
          <p>Name: {optimizedStrategy.name}</p>
          <p>APY: {optimizedStrategy.apy}%</p>
        </div>
      )}
    </div>
  );
}

export default StrategyDisplay;
