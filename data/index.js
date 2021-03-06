'use strict'

const OBA = require('oba-api')
const helper = require('./helper')
const Helper = require('jeroentvb-helper')
require('dotenv').config()

const client = new OBA({
  public: process.env.PUBLIC_KEY,
  secret: process.env.SECRET_KEY
})

function search (page, genre) {
  return new Promise((resolve, reject) => {
    client.get('search', {
      q: 'format:book',
      refine: true,
      librarian: true,
      facet: [`genre(${genre})`, 'language(dut)'],
      page: page
    })
      .then(res => {
        console.log(`Received a response for page ${page}`)
        let results = (JSON.parse(res)).aquabrowser
        resolve(results)
      })
      .catch(err => reject(err))
  })
}

function getAndParseData (pages, genre, books, words) {
  const excludedWords = [
    'de',
    'het',
    'een',
    'the',
    'van',
    'bij',
    'a',
    'en',
    'in',
    '&',
    'voor',
    'ik',
    'is',
    'je',
    'op',
    'met',
    'te',
    'mijn',
    'niet'
  ]

  return new Promise((resolve, reject) => {
    for (let i = 1; i < pages + 1; i++) {
      setTimeout(() => {
        search(i, genre)
          .then(results => {
            // Create array with books titles and their author
            let res = results.results.result
            res.forEach(book => {
              books.push({
                name: book['librarian-info'].record.marc.df200.df200 ? book['librarian-info'].record.marc.df200.df200[0].$t : undefined,
                author: book.authors ? book.authors['main-author']['search-term'] : undefined
              })
            })
            return books
          })
          .then(books => {
            // Create array with all words from the book titles
            books.forEach(book => {
              let title = book.name ? book.name.split(' ') : undefined
              if (title) {
                title.forEach(word => {
                  word = word.toLowerCase()
                  if (
                    excludedWords.indexOf(word) === -1 &&
                    isNaN(word)
                  ) {
                    words.push(word.toLowerCase())
                  }
                })
              }
            })
          })
          .then(() => {
            // If the loop end, resolve the promise and export the books array
            if (i === pages) {
              Helper.exportToFile('books', books)
              resolve(words)
            }
          })
          .catch(err => reject(err))
      }, i * 1000)
    }
  })
}

function getAllData (genre) {
  search(1, genre)
    .then(results => {
      let pages = Math.ceil(results.meta.count / 20)
      let words = []
      let books = []
      let data = []
      let count = 0

      getAndParseData(pages, genre, books, words)
        .then(words => {
          // Create array with all words an their count
          words.sort()
          words.forEach(word => {
            if (count === 0) {
              data.push({
                name: word,
                amount: 0,
                books: []
              })
              count++
            } else if (data[count] === undefined || data[count].name !== word) {
              count++
              data[count] = {
                name: word,
                amount: 0,
                books: []
              }
            }
          })
        })
        .then(() => {
          data.forEach((wordInfo, index) => {
            books.forEach(book => {
              if (helper.containsWord(book.name, wordInfo.name)) {
                data[index].books.push({
                  name: book.name,
                  author: book.author
                })
                data[index].amount++
              }
            })
          })
        })
        .then(() => {
          Helper.exportToFile('words', words)
          Helper.exportToFile(genre, data)
        })
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
}

function init () {
  const genres = [
    'stripverhaal'
  ]

  genres.forEach((genre, index) => {
    setTimeout(() => {
      getAllData(genre)
    }, index * (genres.length * 20000))
  })
}

init()
