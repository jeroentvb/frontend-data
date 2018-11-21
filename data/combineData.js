const Helper = require('jeroentvb-helper')

const western = require('./western-export.json')
const humor = require('./humor-export.json')
const sport = require('./sport-export.json')

const genres = [
  western,
  humor,
  sport
]

const data = {
  "name": "genres",
  "children": [
    {
      "name": "Western",
      "children": []
    },
    {
      "name": "Humor",
      "children": []
    },
    {
      "name": "Sport",
      "children": []
    }
  ]
}

genres.forEach((genre, index) => {
  genre.splice(0, 2)
  data.children[index].children = genre
})

Helper.exportToFile('data', data)
