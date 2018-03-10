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

// function getData() {
//   return new Promise((resolve, reject) => {
//     let digits = []
//     const labels = []
//     var lineReader = require("readline").createInterface({
//       input: require("fs").createReadStream("/home/henry/work/ai_coursework/build/digits.txt"),
//     })

//     let actualLineNum = 1
//     let lineNum = 1
//     let digit = []
//     lineReader.on("line", function(line) {
//       if (lineNum < 33) {
//         digit = digit.concat(line.split("").map(Number))
//         lineNum++
//       } else {
//         digits.push(digit)
//         digit = []
//         const klass = Number(line)
//         const label = Array(10).fill(0)
//         label[klass] = 1
//         labels.push(label)
//         lineNum = 1
//       }
//       actualLineNum++
//     })

//     lineReader.on("close", function(line) {
//       resolve({ digits, labels })
//     })
//   })
// }

// const Network = require("./network/Network").default
// const LinearLayer = require("./network/LinearLayer").default
// const SigmoidLayer = require("./network/SigmoidLayer").default

// const network = new Network()
// network.addLayer(new LinearLayer(1024, 30))
// network.addLayer(new SigmoidLayer())
// network.addLayer(new LinearLayer(30, 30))
// network.addLayer(new SigmoidLayer())
// network.addLayer(new LinearLayer(30, 30))
// network.addLayer(new SigmoidLayer())
// network.addLayer(new LinearLayer(30, 10))
// network.addLayer(new SigmoidLayer())

// function run() {
//   getData().then(({ digits, labels }) => {
//     const trainingData = digits.slice(0, 1000)
//     const trainingLabels = labels.slice(0, 1000)

//     const testData = digits.slice(1000, 1010)
//     const testLabels = labels.slice(1000, 1010)

//     const before = network.classify(testData)

//     console.time("TRAINING_TIME")
//     network.train(trainingData, trainingLabels, {
//       batchSize: 32,
//       noOfIterations: 100,
//       learningRate: 0.1,
//     })
//     console.timeEnd("TRAINING_TIME")

//     const after = network.classify(testData)

//     console.log("RESULTS")

//     console.log("============")
//     console.log("TEST SET")
//     console.log(JSON.stringify(testLabels.map(l => l.join(",")), null, " "))
//     console.log("before")
//     console.log("cost: ", JSON.stringify(cost(before, testLabels)))
//     console.log("predicted: ", JSON.stringify(before.map(l => l.join(",")), null, " "))
//     console.log("----------------")
//     console.log("after")
//     console.log("cost: ", JSON.stringify(cost(after, testLabels)))
//     console.log("predicted: ", JSON.stringify(after.map(l => l.join(",")), null, " "))
//     console.log("----------------")
//   })
// }

// run()

// import Matrix from "./network/Matrix"
// function cost(predicted, actual) {
//   let errors = Matrix.sub(actual, predicted)
//   return errors.map(err => err.reduce((acc, e) => acc + e ** 2, 0))
// }

// objNetwork.layers[0].w = [[3, 6], [4, 5]]
// objNetwork.layers[0].b = [1, -6]
// objNetwork.layers[2].w = [[2], [4]]
// objNetwork.layers[2].b = [-3.92]

// const before = objNetwork.classify([[1, 0]])

// console.time("training")
// objNetwork.train([[0, 0], [0, 1], [1, 0], [1, 1]], [[0], [1], [1], [0]], {
//   batchSize: 4,
//   noOfIterations: 30000,
//   learningRate: 0.1,
// })
// console.timeEnd("training")

// const after = objNetwork.classify([[0, 0], [0, 1], [1, 0], [1, 1]])
// console.log({ before, after })

// console.log("-------------")
// console.log(JSON.stringify(objNetwork.layers.map(({ w, b }) => ({ w, b })), null, " "))

import data from "./data.csv"

function getData() {
  const digits = []
  const labels = []
  const d = data.slice(1, data.length - 1)

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

const Network = require("./network/Network").default
const LinearLayer = require("./network/LinearLayer").default
const SigmoidLayer = require("./network/SigmoidLayer").default

const network = new Network()
network.addLayer(new LinearLayer(5, 3))
network.addLayer(new SigmoidLayer())
network.addLayer(new LinearLayer(3, 1))
network.addLayer(new SigmoidLayer())

function run() {
  const { digits, labels } = getData()
  const splitIdx = Math.floor(digits.length * 0.9)

  const trainingData = digits.slice(0, splitIdx)
  const trainingLabels = labels.slice(0, splitIdx)

  const testData = digits.slice(splitIdx, digits.length)
  const testLabels = labels.slice(splitIdx, digits.length)

  // const activs = network.forward(trainingData.slice(0, 1))
  // // console.log(activs)
  // console.log(activs.map(a => a.output))
  // return

  // const trainingData = digits.slice(0, 10)
  // const trainingLabels = labels.slice(0, 10)
  // const testData = digits.slice(0, 10)
  // const testLabels = labels.slice(0, 10)

  const before = network.classify(testData)

  console.time("TRAINING_TIME")
  network.train(trainingData, trainingLabels, {
    batchSize: 32,
    noOfIterations: 500,
    learningRate: 0.5,
  })
  console.timeEnd("TRAINING_TIME")

  const after = network.classify(testData)

  console.log("RESULTS")

  console.log("============")
  console.log("TEST SET")
  // console.log(JSON.stringify(testLabels.map(l => l.join(",")), null, " "))
  console.log("before")
  console.log("accuracy: ", JSON.stringify(cost(before, testLabels)))
  // console.log("predicted: ", JSON.stringify(before.map(l => l.join(",")), null, " "))
  console.log("----------------")
  console.log("after")
  console.log("accuracy: ", JSON.stringify(cost(after, testLabels)))
  // console.log("predicted: ", JSON.stringify(after.map(l => l.join(",")), null, " "))
  console.log("----------------")

  // const predicted = network.classify(testData.slice(0, 1))
  // const actual = testLabels.slice(0, 1)

  // console.log({ predicted, actual })
}

run()

import Matrix from "./network/Matrix"
function cost(predicted, actual) {
  let errors = Matrix.divide(actual, predicted)
  // errors = Matrix.map(errors, Math.abs);
  // errors = Matrix.divide(errors, actual);
  let tot = 0
  let cnt = 0

  Matrix.map(errors, el => {
    if (el === Infinity) return
    el *= 100
    tot += el > 100 ? 200 - el : el
    cnt++
  })
  return tot / cnt

  return errors.map(err => err.reduce((acc, e) => acc + e ** 2, 0))
}
