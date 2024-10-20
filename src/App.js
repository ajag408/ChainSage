import React, { useState } from "react";
import AIOptimizer from "./components/AIOptimizer";
import WalletConnection from "./components/WalletConnection";
import "./styles/App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState(null);

  const handleWalletConnect = (connectedProvider, connectedNetwork) => {
    setProvider(connectedProvider);
    setNetwork(connectedNetwork);
  };

  return (
    <div className="App">
      <h1>ChainSage DeFi Strategy Optimizer</h1>
      <p className="intro">
        Welcome to ChainSage! We use AI to optimize your DeFi investment
        strategies across multiple chains. Connect your wallet to get started
        and explore personalized recommendations.
      </p>
      <WalletConnection onConnect={handleWalletConnect} />
      {provider && network ? (
        <AIOptimizer provider={provider} network={network} />
      ) : (
        <p className="instruction">
          Please connect your wallet to the Zircuit Testnet to view and optimize
          DeFi strategies.
        </p>
      )}
    </div>
  );
}

export default App;
