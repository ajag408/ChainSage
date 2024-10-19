# ChainSage DeFi Strategy Optimizer

ChainSage is a decentralized application (dApp) that uses artificial intelligence to optimize DeFi investment strategies. It leverages smart contracts on the Zircuit testnet and a React frontend to provide users with AI-driven insights for their DeFi investments.

## Features

- Connect to Zircuit testnet using MetaMask
- Fetch and display DeFi strategies from a smart contract
- Use AI to analyze and recommend optimal strategies
- Interactive user interface for viewing strategies and AI recommendations

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask browser extension
- A wallet with some testnet ZIR tokens

## Setup Instructions

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/chainsage.git
   cd chainsage
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your private key:

   ```
   PRIVATE_KEY=your_private_key_here
   ```

4. Compile the smart contracts:

   ```
   npx hardhat compile
   ```

5. Deploy the smart contract to the Zircuit testnet:

   ```
   npx hardhat run scripts/deploy.js --network zircuitTestnet
   ```

6. Update the contract address in `src/components/AIOptimizer.js`:

7. Start the development server:

   ```
   npm start
   ```

8. Open your browser and navigate to `http://localhost:3000`

## Running Tests

To run the test suite:

```
npx hardhat test
```

## Building for Production

To create a production build:

```
npm run build
```

This will generate a `build` folder with optimized production-ready files.

## License

This project is licensed under the MIT License.
