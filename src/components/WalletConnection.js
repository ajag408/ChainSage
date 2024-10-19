import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function WalletConnection({ onConnect }) {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        console.log("network: ", network);
        if (network.chainId !== 48899) {
          // Zircuit testnet chain ID
          alert("Please connect to the Zircuit testnet");
          return;
        }
        const signer = provider.getSigner();
        let address;
        try {
          address = await signer.getAddress();
        } catch (error) {
          console.error("Failed to get address:", error);
          address = "Unknown";
        }
        setAccount(address);
        onConnect(provider, network);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <div>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default WalletConnection;
