// Generates a random alphanumeric sequence
const randomAlphanumericSequence = (pattern) => {
  return pattern.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

module.exports = {
  randomAlphanumericSequence
}
