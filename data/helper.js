function containsWord (str, word) {
  let contains = false

  if (str) {
    let splitStr = str.split(' ')
    splitStr.forEach(titleWord => {
      if (titleWord.toLowerCase() === word) {
        contains = true
      }
    })
  }
  return contains
}

module.exports = {
  containsWord
}
