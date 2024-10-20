// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import "hardhat/console.sol";

contract ChainSageOApp is OApp {
    struct Strategy {
        string name;
        uint256 apy;
        uint256 risk;
        uint256 liquidity;
        uint256 volatility;
    }

    mapping(uint32 => Strategy[]) public strategies;
    mapping(uint32 => uint256) public strategyCount;
    mapping(uint256 => uint32) public chainIdToEid;
    mapping(uint32 => uint256) public eidToChainId;

    event StrategyOptimized(uint32 srcEid, uint32 dstEid, string strategyName, uint256 apy);

    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) {}

    function setChainIdMapping(uint256 _chainId, uint32 _eid) external onlyOwner {
        chainIdToEid[_chainId] = _eid;
        eidToChainId[_eid] = _chainId;
    }

    function addStrategy(uint32 _eid, string memory _name, uint256 _apy, uint256 _risk, uint256 _liquidity, uint256 _volatility) external onlyOwner {
        strategies[_eid].push(Strategy(_name, _apy, _risk, _liquidity, _volatility));
        strategyCount[_eid]++;
    }

function optimizeStrategy(uint32 _dstEid, bytes calldata _options) external payable {
    require(chainIdToEid[block.chainid] != 0, "Source chain not configured");
    
    uint32 srcEid = chainIdToEid[block.chainid];
    bytes memory payload = abi.encode(srcEid, strategies[srcEid]);
    
    MessagingFee memory fee = MessagingFee(msg.value, 0);
    console.log("from contract before lzSend: ");
    _lzSend(_dstEid, payload, _options, fee, payable(msg.sender));
}

function optimizeZircuitStrategy(uint32 _dstEid, bytes calldata _options) external payable {
    require(chainIdToEid[block.chainid] != 0, "Source chain not configured");
    
    uint32 srcEid = chainIdToEid[block.chainid];
    Strategy[] memory zircuitStrategies = strategies[srcEid];
    
    // Apply 5% APY bonus to Zircuit strategies
    for (uint i = 0; i < zircuitStrategies.length; i++) {
        zircuitStrategies[i].apy = zircuitStrategies[i].apy * 105 / 100;
    }
    
    bytes memory payload = abi.encode(srcEid, zircuitStrategies);
    
    MessagingFee memory fee = MessagingFee(msg.value, 0);
    _lzSend(_dstEid, payload, _options, fee, payable(msg.sender));
}

function _lzReceive(
    Origin calldata _origin,
    bytes32 _guid,
    bytes calldata _message,
    address _executor,
    bytes calldata _extraData
) internal override {
    console.log("_lzReceive called");
    (uint32 srcEid, Strategy[] memory srcStrategies) = abi.decode(_message, (uint32, Strategy[]));
    console.log("Decoded message. srcEid:", srcEid);
    console.log("Number of strategies:", srcStrategies.length);
    
    Strategy memory bestStrategy = findBestStrategy(srcStrategies);
    console.log("Best strategy found. Name:", bestStrategy.name);
    console.log("Best strategy APY:", bestStrategy.apy);
    
    emit StrategyOptimized(_origin.srcEid, uint32(block.chainid), bestStrategy.name, bestStrategy.apy);
    console.log("StrategyOptimized event emitted");
}
    function findBestStrategy(Strategy[] memory _strategies) internal pure returns (Strategy memory) {
        require(_strategies.length > 0, "No strategies available");
        Strategy memory best = _strategies[0];
        for (uint256 i = 1; i < _strategies.length; i++) {
            if (calculateStrategyScore(_strategies[i]) > calculateStrategyScore(best)) {
                best = _strategies[i];
            }
        }
        return best;
    }

    function calculateStrategyScore(Strategy memory _strategy) internal pure returns (uint256) {
        return _strategy.apy * (100 - _strategy.risk) * _strategy.liquidity / (100 * _strategy.volatility);
    }

    function compareStrategiesAcrossChains(uint32[] memory _chainIds) public view returns (Strategy memory bestStrategy, uint32 bestChainId) {
        uint256 highestScore = 0;
        for (uint256 i = 0; i < _chainIds.length; i++) {
            Strategy memory currentBest = findBestStrategy(strategies[_chainIds[i]]);
            uint256 currentScore = calculateStrategyScore(currentBest);
            if (currentScore > highestScore) {
                highestScore = currentScore;
                bestStrategy = currentBest;
                bestChainId = _chainIds[i];
            }
        }
    }

    function getStrategiesData(uint32 _eid) public view returns (Strategy[] memory) {
        return strategies[_eid];
    }
}