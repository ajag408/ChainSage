import React from "react";

const StrategyItem = React.memo(({ strategy }) => (
  <div>
    <p>Name: {strategy.name}</p>
    <p>APY: {strategy.apy.toString()}%</p>
    <p>Risk: {strategy.risk.toString()}</p>
    <p>Liquidity: {strategy.liquidity.toString()}</p>
    <p>Volatility: {strategy.volatility.toString()}</p>
  </div>
));

function StrategyDisplay({ strategies, optimizedStrategy }) {
  return (
    <div>
      <h3>Available Strategies:</h3>
      {strategies.map((strategy, index) => (
        <StrategyItem key={index} strategy={strategy} />
      ))}
      {optimizedStrategy && (
        <div>
          <h3>Optimized Strategy:</h3>
          <StrategyItem strategy={optimizedStrategy} />
        </div>
      )}
    </div>
  );
}

export default React.memo(StrategyDisplay);
