import React from "react";
import "../styles/StrategyDisplay.css";

const StrategyItem = React.memo(({ strategy, isOptimized }) => (
  <div className={`strategy-item ${isOptimized ? "optimized" : ""}`}>
    <h4>{strategy.name}</h4>
    <div className="strategy-details">
      <p>
        <strong>APY:</strong> {strategy.apy?.toString() || "N/A"}%
      </p>
      <p>
        <strong>Risk:</strong> {strategy.risk?.toString() || "N/A"}
      </p>
      <p>
        <strong>Liquidity:</strong> $
        {strategy.liquidity
          ? Number(strategy.liquidity).toLocaleString()
          : "N/A"}
      </p>
      <p>
        <strong>Volatility:</strong> {strategy.volatility?.toString() || "N/A"}%
      </p>
    </div>
  </div>
));

function StrategyDisplay({ strategies, optimizedStrategy }) {
  return (
    <div className="strategy-display">
      <div className="strategies-list">
        <h3>Available Strategies</h3>
        {strategies.map((strategy, index) => (
          <StrategyItem key={index} strategy={strategy} />
        ))}
      </div>
      {optimizedStrategy && (
        <div className="optimized-strategy">
          <h3>AI Optimized Strategy</h3>
          <StrategyItem strategy={optimizedStrategy} isOptimized={true} />
        </div>
      )}
    </div>
  );
}

export default React.memo(StrategyDisplay);
