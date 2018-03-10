import dataset from "./dataset.csv"

function shuffleArray(arr) {
  const shuffled = []
  while (arr.length) {
    const idx = Math.floor(Math.random() * arr.length)
    shuffled.push(arr.splice(idx, 1)[0])
  }
  return shuffled
}

let data = shuffleArray(dataset.slice(1))

const expected = []
const normalized = []

data.forEach(row => {
  expected.push(row[row.length - 1])
  normalized.push(row.slice(1, 6))
})

const trainingEndIndex = Math.floor(normalized.length * 0.8)
const validationEndIndex = trainingEndIndex + Math.floor(normalized.length * 0.1)

const training = {
  data: normalized.slice(0, trainingEndIndex),
  expected: expected.slice(0, trainingEndIndex),
}

const validation = {
  data: normalized.slice(trainingEndIndex, validationEndIndex),
  expected: expected.slice(trainingEndIndex, validationEndIndex),
}

const testing = {
  data: normalized.slice(validationEndIndex),
  expected: expected.slice(validationEndIndex),
}

export default {
  training,
  validation,
  testing,
}
