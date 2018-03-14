// T - mean daily temperature in celcius
// W - wind speed in mph
// SR - solar radiation in Langleys
// DSP - Air Pressure in kPa
// DRH - Humidity in %
// PanE - Pan Evaporation (the predictand) in mm/day
//
// "You should use the five predictors (T,W,SR,DSP,DRH) to model PanE"
//
// "The data represent daily environmental factors at a site in California, USA"

// import normalizedData from "./normalizedData"
import fs from "fs"

const sum = (a = 0, b = 0) => a + b

import data from "./data.csv"
import chris_data from "./shuffledData.csv"

function getData() {
  const digits = []
  const labels = []
  const d = data.slice(0, data.length - 1)

  let arrEnd = d.length
  while (arrEnd) {
    const idx = Math.floor(Math.random() * arrEnd--)

    let temp
    temp = d[arrEnd]
    d[arrEnd] = d[idx]
    d[idx] = temp
  }
  d.forEach(datum => {
    digits.push(datum.slice(0, 5).map(Number))
    labels.push(datum.slice(5, 6).map(Number))
  })

  return { digits, labels }
}

const Network = require("network/Network").default

const network = new Network()
network.addLayer("linear", [5, 10])
network.addLayer("relu")
network.addLayer("linear", [10, 10])
network.addLayer("relu")
network.addLayer("linear", [10, 10])
network.addLayer("relu")
network.addLayer("linear", [10, 1])
network.addLayer("sigmoid")

import Matrix from "network/Matrix"
import { arraySub } from "network/utils"

// network.layers[0].b = [
//   -0.7477937915359704,
//   -0.7477937915359704,
//   -0.7477937915359704,
//   -0.7477937915359704,
//   -0.7477937915359704,
//   -0.7477937915359704,
//   -0.7477937915359704,
//   -0.7477937915359704,
//   -0.7477937915359704,
//   -0.7477937915359704,
// ]

// network.layers[0].w = [
//   [
//     0.8925700498271425,
//     0.8925700498271425,
//     0.8925700498271425,
//     0.8925700498271425,
//     0.8925700498271425,
//     0.8925700498271425,
//     0.8925700498271425,
//     0.8925700498271425,
//     0.8925700498271425,
//     0.8925700498271425,
//   ],
//   [
//     0.6308021029000977,
//     0.6308021029000977,
//     0.6308021029000977,
//     0.6308021029000977,
//     0.6308021029000977,
//     0.6308021029000977,
//     0.6308021029000977,
//     0.6308021029000977,
//     0.6308021029000977,
//     0.6308021029000977,
//   ],
//   [
//     1.016354830675005,
//     1.016354830675005,
//     1.016354830675005,
//     1.016354830675005,
//     1.016354830675005,
//     1.016354830675005,
//     1.016354830675005,
//     1.016354830675005,
//     1.016354830675005,
//     1.016354830675005,
//   ],
//   [
//     -0.24718239413506882,
//     -0.24718239413506882,
//     -0.24718239413506882,
//     -0.24718239413506882,
//     -0.24718239413506882,
//     -0.24718239413506882,
//     -0.24718239413506882,
//     -0.24718239413506882,
//     -0.24718239413506882,
//     -0.24718239413506882,
//   ],
//   [
//     -0.4777803516977479,
//     -0.4777803516977479,
//     -0.4777803516977479,
//     -0.4777803516977479,
//     -0.4777803516977479,
//     -0.4777803516977479,
//     -0.4777803516977479,
//     -0.4777803516977479,
//     -0.4777803516977479,
//     -0.4777803516977479,
//   ],
// ]

// network.layers[2].b = [-5.3527010676647365]

// network.layers[2].w = [
//   [0.8780190753552403],
//   [0.8780190753552403],
//   [0.8780190753552403],
//   [0.8780190753552403],
//   [0.8780190753552403],
//   [0.8780190753552403],
//   [0.8780190753552403],
//   [0.8780190753552403],
//   [0.8780190753552403],
//   [0.8780190753552403],
// ]

function run() {
  const { digits, labels } = getData()
  const trainingSplitIdx = Math.floor(digits.length * 0.6)
  const validationSplitIdx = Math.floor(digits.length * 0.8)

  const trainingData = digits.slice(0, trainingSplitIdx)
  const trainingLabels = labels.slice(0, trainingSplitIdx)

  const validationData = digits.slice(trainingSplitIdx, validationSplitIdx)
  const validationLabels = labels.slice(trainingSplitIdx, validationSplitIdx)

  const testData = digits.slice(validationSplitIdx)
  const testLabels = labels.slice(validationSplitIdx)
  // const activs = network.forward(trainingData.slice(0, 1))
  // // console.log(activs)
  // console.log(activs.map(a => a.output))
  // return

  // const trainingData = digits.slice(0, 10)
  // const trainingLabels = labels.slice(0, 10)
  // const testData = digits.slice(0, 10)
  // const testLabels = labels.slice(0, 10)

  class Thang {
    constructor(predicted, labels) {
      this.predicted = predicted
      this.labels = labels
    }

    percentage() {
      let errors = Matrix.divide(predicted, this.labels)
      // errors = Matrix.map(errors, Math.abs);
      // errors = Matrix.divide(errors, actual);
      let tot = 0
      let cnt = 0

      Matrix.map(errors, (el, x, y) => {
        if (el === Infinity) return
        el *= 100
        tot += el > 100 ? 200 - el : el
        cnt++
      })
      return tot / cnt
    }

    rmse() {
      let sums = []
      this.predicted.forEach((ps, i) => {
        const as = this.labels[i]
        sums.push(
          arraySub(ps, as)
            .map(x => x ** 2)
            .reduce((a, b) => a + b, 0) / ps.length,
        ) ** 0.5
      })
      return sums.reduce((a, b) => a + b, 0) / sums.length
    }
  }

  const before = network.classify(testData)

  console.time("TRAINING_TIME")
  network.train(trainingData, trainingLabels, {
    batchSize: 4,
    noOfIterations: 500,
    momentum: 0.9,
    learningRate: 1.3,
  })
  console.timeEnd("TRAINING_TIME")
  console.log(JSON.stringify(network.toJSON()))
  // return

  const after = network.classify(testData)

  console.log("RESULTS")

  console.log("============")
  console.log("TEST SET")
  // console.log(JSON.stringify(testLabels.map(l => l.join(",")), null, " "))
  console.log("before")
  console.log("accuracy: ", JSON.stringify(new Thang(before, testLabels).percentage()))
  // console.log("predicted: ", JSON.stringify(before.map(l => l.join(",")), null, " "))
  console.log("----------------")
  console.log("after")
  console.log("accuracy: ", JSON.stringify(new Thang(after, testLabels).percentage()))
  // console.log("predicted: ", JSON.stringify(after.map(l => l.join(",")), null, " "))
  console.log("----------------")

  // const predicted = network.classify(testData.slice(0, 1))
  // const actual = testLabels.slice(0, 1)

  // console.log({ predicted, actual })
}

run()

// const x = cost([[100]], [[101]])
// console.log(x)
