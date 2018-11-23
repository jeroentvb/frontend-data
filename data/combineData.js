const Helper = require('jeroentvb-helper')

const western = require('./western-export.json')
const humor = require('./humor-export.json')
const sport = require('./sport-export.json')
const thriller = require('./thriller-export.json')
const bijbelsVerhaal = require('./bijbels-verhaal-export.json')
const erotiek = require('./erotiek-export.json')
const school = require('./school-export.json')
const detective = require('./detective-export.json')

const genres = [
  western,
  humor,
  sport,
  thriller,
  bijbelsVerhaal,
  erotiek,
  school,
  detective
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
    },
    {
      "name": "Thriller",
      "children": []
    },
    {
      "name": "Bijbels-verhaal",
      "children": []
    },
    {
      "name": "Erotiek",
      "children": []
    },
    {
      "name": "School",
      "children": []
    },
    {
      "name": "Detective",
      "children": []
    }
  ]
}

genres.forEach((genre, index) => {
  genre.splice(0, 2)
  data.children[index].children = genre
})

Helper.exportToFile('data', data)
