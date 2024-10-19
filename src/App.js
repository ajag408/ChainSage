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
      <WalletConnection onConnect={handleWalletConnect} />
      {provider && network && (
        <AIOptimizer provider={provider} network={network} />
      )}
    </div>
  );
}

export default App;
