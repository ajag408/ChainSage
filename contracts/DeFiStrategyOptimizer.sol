// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DeFiStrategyOptimizer {
    struct Strategy {
        string name;
        uint256 apy;
        uint256 risk;
        uint256 liquidity;
        uint256 volatility;
    }

    Strategy[] public strategies;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function addStrategy(string memory _name, uint256 _apy, uint256 _risk, uint256 _liquidity, uint256 _volatility) public {
        require(msg.sender == owner, "Only owner can add strategies");
        strategies.push(Strategy(_name, _apy, _risk, _liquidity, _volatility));
    }

    function getStrategiesData() public view returns (Strategy[] memory) {
        require(strategies.length > 0, "No strategies available");
        return strategies;
    }

    function getOptimalStrategy() public view returns (string memory, uint256, uint256) {
        require(strategies.length > 0, "No strategies available");
        uint256 highestApy = 0;
        uint256 optimalIndex = 0;

        for (uint256 i = 0; i < strategies.length; i++) {
            if (strategies[i].apy > highestApy) {
                highestApy = strategies[i].apy;
                optimalIndex = i;
            }
        }

        return (strategies[optimalIndex].name, strategies[optimalIndex].apy, strategies[optimalIndex].risk);
    }
}