# ChainSage: AI-Powered DeFi Strategy Optimizer

ChainSage is a decentralized application (dApp) that leverages artificial intelligence to optimize DeFi investment strategies across multiple chains. It utilizes smart contracts on the Zircuit testnet and a React frontend to provide users with AI-driven insights for their DeFi investments.

## Problem Statement

In the rapidly evolving DeFi landscape, investors face challenges in identifying optimal investment strategies across multiple chains. ChainSage addresses this by:

1. Aggregating DeFi strategies from various chains
2. Utilizing AI to analyze and recommend optimal strategies based on user preferences
3. Providing a user-friendly interface for strategy comparison and selection
4. Enabling cross-chain strategy optimization through LayerZero's interoperability protocol

## Features

- Connect to Zircuit testnet using MetaMask
- Fetch and display DeFi strategies from smart contracts
- Use AI to analyze and recommend optimal strategies
- Interactive user interface for viewing strategies and AI recommendations
- Cross-chain strategy optimization using LayerZero

## Technology Stack

- Frontend: React.js
- Smart Contracts: Solidity
- AI Model: TensorFlow.js
- Blockchain: Zircuit Testnet
- Cross-chain Messaging: LayerZero
- Confidential Computing: Phala Network
- Deployment: Vercel

## Integrations

### LayerZero

ChainSage leverages LayerZero's cross-chain messaging protocol to enable strategy optimization across multiple chains. This integration allows users to compare and select strategies from different networks seamlessly.

### Zircuit

Our smart contracts are deployed on the Zircuit Testnet, taking advantage of its high-performance, EVM-compatible environment. Contract addresses:

- Zircuit OApp: [0xD12b1AA4dc3B67344BCa78595B6aB18649DE1c22](https://explorer.testnet.zircuit.com/address/0xD12b1AA4dc3B67344BCa78595B6aB18649DE1c22#code)
- OP Sepolia OApp: [0x47837D3715F5B46B0BC470c202b644e3Cf6B99B2](https://explorer.testnet.zircuit.com/address/0x47837D3715F5B46B0BC470c202b644e3Cf6B99B2#code)

### Phala Network

ChainSage utilizes Phala Network's confidential computing capabilities to ensure the privacy and security of our AI model. This integration allows us to perform strategy optimizations in a Trusted Execution Environment (TEE).

### Vercel Deployment

Our frontend is deployed on Vercel, ensuring fast and reliable hosting for the ChainSage dApp. You can access the live version at [\[Your Vercel URL\]](https://chain-sage-8a6iv5zlx-jak18000s-projects.vercel.app/).

## Deployment

To deploy updates:

1. Push changes to the main branch of the GitHub repository
2. Vercel will automatically detect changes and redeploy the site

## Team

- Akash Jagannathan - Full Stack Blockchain Developer

## Testing Instructions

1. Visit our deployed app at [\[Your Vercel URL\]](https://chain-sage-8a6iv5zlx-jak18000s-projects.vercel.app/)
2. Connect your wallet (ensure you're on the Zircuit Testnet)
3. Explore available DeFi strategies
4. Use the AI optimization feature to get personalized strategy recommendations

## Feedback on Building with Zircuit

Our experience building on Zircuit has been positive. The network's compatibility with Ethereum tools made development straightforward, while its high performance allowed for quick transaction confirmations. The integration with LayerZero for cross-chain messaging was seamless, enabling us to create a truly interoperable DeFi strategy optimizer.
