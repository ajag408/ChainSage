import { ethers } from "ethers";
import { phat } from "@phala/sdk";

class PhalaAIModel {
  constructor(contractAddress, abi, provider) {
    this.contract = new ethers.Contract(contractAddress, abi, provider);
    // this.model = phat.connect("your_phat_contract_id");
  }

  // async optimizeStrategies(strategies) {
  //   const result = await this.model.query('optimizeStrategies', strategies);
  //   return result;
  // }
  async optimizeStrategy(strategies) {
    // Simulate Phala AI optimization
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time

    // For now, just return the strategy with the highest APY
    return strategies.reduce((prev, current) =>
      prev.apy > current.apy ? prev : current
    );
  }
}

export default PhalaAIModel;
