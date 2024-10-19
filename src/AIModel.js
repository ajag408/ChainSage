import * as tf from "@tensorflow/tfjs";

class AIModel {
  constructor() {
    this.model = this.createModel();
  }

  createModel() {
    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 10, inputShape: [3], activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 1, activation: "linear" }));
    model.compile({ optimizer: "adam", loss: "meanSquaredError" });
    return model;
  }

  async train(data, labels, epochs = 100) {
    const xs = tf.tensor2d(data);
    const ys = tf.tensor2d(labels);
    await this.model.fit(xs, ys, { epochs });
  }

  predict(input) {
    const inputTensor = tf.tensor2d([input]);
    const prediction = this.model.predict(inputTensor);
    return prediction.dataSync()[0];
  }
}

export default AIModel;
