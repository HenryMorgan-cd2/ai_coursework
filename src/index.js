// // T - mean daily temperature in celcius
// // W - wind speed in mph
// // SR - solar radiation in Langleys
// // DSP - Air Pressure in kPa
// // DRH - Humidity in %
// // PanE - Pan Evaporation (the predictand) in mm/day
// //
// // "You should use the five predictors (T,W,SR,DSP,DRH) to model PanE"
// //
// // "The data represent daily environmental factors at a site in California, USA"

// // import normalizedData from "./normalizedData"
// import fs from "fs"

// const sum = (a = 0, b = 0) => a + b

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
// const ConvolutionalLayer = require("./network/ConvolutionalLayer").default
// const PoolingLayer = require("./network/PoolingLayer").default
// const LinearLayer = require("./network/LinearLayer").default
// const SigmoidLayer = require("./network/SigmoidLayer").default
// const SoftmaxLayer = require("./network/SoftmaxLayer").default

// const network = new Network()
// // network.addLayer(new PoolingLayer({ inW: 32, inH: 32, filterSize: 4, stride: 4 }))
// // network.addLayer(new ConvolutionalLayer({ inW: 8, inH: 8, filters: 2 }))
// // network.addLayer(new PoolingLayer({ inW: 4, inH: 4, filterSize: 2, stride: 2 }))
// network.addLayer(new LinearLayer(32 * 32, 30))
// network.addLayer(new SigmoidLayer())
// network.addLayer(new LinearLayer(30, 30))
// network.addLayer(new SigmoidLayer())
// network.addLayer(new LinearLayer(30, 10))
// network.addLayer(new SoftmaxLayer())

// function run() {
//   getData().then(({ digits, labels }) => {
//     const trainingData = digits.slice(0, 1000)
//     const trainingLabels = labels.slice(0, 1000)

//     const testData = digits.slice(1000, 1010)
//     const testLabels = labels.slice(1000, 1010)

//     // let inp = eval(
//     //   "[[0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,0,0,1,1,0,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0]]",
//     // )

//     // const out = network.forward(inp)
//     // let outGrad = []
//     // const f1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] // filter 1
//     // // const f2 = [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16] // filter 2
//     // outGrad[0] = [...f1, ...f1]

//     // const x = network.layers[1].getInputGradient(out, outGrad)
//     // console.log(x)

//     const before = network.classify(testData)

//     console.time("TRAINING_TIME")
//     network.train(trainingData, trainingLabels, {
//       batchSize: 32,
//       noOfIterations: 5,
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

import fs from "fs"
import { PNG } from "pngjs2"
import Matrix from "./network/Matrix"

class Song {
  // pixels in a second
  X_INTERVAL = 50
  SECTION_WIDTH = 1000 / this.X_INTERVAL

  constructor(data, label) {
    this.label = label
    this.data = data
  }

  get genre() {
    return this.constructor.labelNames[this.label]
  }

  getOneHotLabel() {
    const zeros = Array(this.constructor.labelNames.length).fill(0)
    zeros[this.label] = 1
    return zeros
  }

  getSplitData() {
    const sections = []
    for (let i = 0; i < this.data[0].length; i += this.SECTION_WIDTH) {
      sections.push(this.data.map(row => row.slice(i, i + this.SECTION_WIDTH)))
    }
    const flattenedSections = sections.map(section => Matrix.flatten(section))
    return flattenedSections
  }
}

function loadSong(path, label) {
  return new Promise(resolve => {
    fs
      .createReadStream(path)
      .pipe(new PNG())
      .on("parsed", function() {
        const mat = Matrix.create(this.height, this.width, (x, y) => {
          const idx = (this.width * y + x) * 4
          return this.data[idx] / 255
        })
        resolve(new Song(mat, label))
      })
  })
}

async function loadData() {
  const spectogramPath = "./src/spectograms"
  const songs = []

  const genres = fs.readdirSync(spectogramPath)

  Song.labelNames = genres
  genres.forEach((g, i) => (Song.labelNames[g] = i))

  await Promise.all(
    genres.map(async (genre, labelName) => {
      const path = `${spectogramPath}/${genre}`
      await Promise.all(
        fs.readdirSync(path).map(async (fileName, i) => {
          if (i > 3) return
          const song = await loadSong(`${path}/${fileName}`, labelName)
          songs.push(song)
        }),
      )
    }),
  )

  return songs
}

import Network from "./network/Network"
import SigmoidLayer from "./network/SigmoidLayer"
import LinearLayer from "./network/LinearLayer"
import SoftmaxLayer from "./network/SoftmaxLayer"

function buildNetwork() {
  const network = new Network()

  network.addLayer(new LinearLayer(10260, 512))
  network.addLayer(new SigmoidLayer())
  network.addLayer(new LinearLayer(512, 512))
  network.addLayer(new SigmoidLayer())
  network.addLayer(new LinearLayer(512, 512))
  network.addLayer(new SigmoidLayer())
  network.addLayer(new LinearLayer(512, 512))
  network.addLayer(new SigmoidLayer())
  network.addLayer(new LinearLayer(512, 10))
  network.addLayer(new SoftmaxLayer())

  return network
}

async function run() {
  const songs = await loadData()

  const trainingSplit = Math.floor(songs.length * 0.1)
  const testingSplit = Math.floor(songs.length * 0.8)

  const trainingData = songs.slice(0, trainingSplit)
  const trainingLabels = trainingData.map(song => song.label)

  const testingData = songs.slice(trainingSplit, testingSplit)
  const testingLabels = trainingData.map(song => song.label)

  const validationData = songs.slice(testingSplit)
  const validationLabels = trainingData.map(song => song.label)

  const network = buildNetwork()

  trainingData.forEach((song, i) => {
    const data = song.getSplitData()
    const labels = Array(data.length)
      .fill(0)
      .map(_ => song.getOneHotLabel())

    console.time(`training song ${i}`)
    network.train(data, labels, {
      noOfIterations: 1,
      batchSize: 64,
      learningRate: 0.1,
    })
    console.timeEnd(`training song ${i}`)

    console.log("FINISHED TRAINING")

    console.time(`song ${i}`)
    const results = network.classify(data)
    console.timeEnd(`song ${i}`)
    console.log(song.label)
    console.log(results)
  })

  console.log("GETTING REULTS")

  trainingData.forEach((song, i) => {
    const label = song.label
    const data = song.getSplitData()

    console.time(`song ${i}`)
    const results = network.classify(data)
    console.timeEnd(`song ${i}`)
    console.log(song.label)
    console.log(results)
  })
}

run()
