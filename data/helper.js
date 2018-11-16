function formatJson (obj) {
  return JSON.stringify(JSON.parse(obj), null, 4)
}

function exportObj (name, obj) {
  let fs = require('fs')

  fs.writeFile(name + '-export.json', formatJson(obj), err => {
    if (err) throw err
    console.log(`${name}-export.json written`)
  })
}

function exportArr (name, arr) {
  let fs = require('fs')
  let obj = JSON.stringify(arr, null, 4)
  fs.writeFile(name + '-export.json', obj, err => {
    if (err) throw err
    console.log(`${name}-export.json written`)
  })
}

function containsWord (str, word) {
  let splitStr = str.split(' ')
  let contains = false
  splitStr.forEach(titleWord => {
    if (titleWord.toLowerCase() === word) {
      contains = true
    }
  })
  return contains
}

module.exports = {
  exportObj,
  exportArr,
  containsWord
}
