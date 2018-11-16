'use strict'

const OBA = require('oba-api')
const helper = require('./helper')
require('dotenv').config()

const client = new OBA({
  public: process.env.PUBLIC_KEY,
  secret: process.env.SECRET_KEY
})

function search (page) {
  return new Promise((resolve, reject) => {
    client.get('search', {
      q: 'format:book',
      refine: true,
      librarian: true,
      facet: ['genre(western)', 'language(dut)'],
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

function getAndParseData (pages, books, words) {
  return new Promise((resolve, reject) => {
    for (let i = 1; i < pages + 1; i++) {
      setTimeout(() => {
        search(i)
          .then(results => {
            // Create array with books titles and their author
            let res = results.results.result
            res.forEach(book => {
              books.push({
                title: book['librarian-info'].record.marc.df200.df200[0].$t,
                author: book.authors['main-author']['search-term']
              })
            })
            return books
          })
          .then(books => {
            // Create array with all words from the book titles
            books.forEach(book => {
              let title = book.title.split(' ')
              title.forEach(word => {
                word = word.toLowerCase()
                if (word !== 'de' && word !== 'het' && word !== 'een' && word !== 'the' && word !== 'van' && word !== 'bij' && word !== 'a' && word !== 'en' && word !== 'in' && word !== '&' && isNaN(word)) {
                  words.push(word.toLowerCase())
                }
              })
            })
          })
          .then(() => {
            // If the loop end, resolve the promise and export the books array
            if (i === pages) {
              helper.exportArr('books', books)
              resolve(words)
            }
          })
          .catch(err => reject(err))
      }, i * 1000)
    }
  })
}

// [
//   {
//     titels: [],
//     woord: ,
//     aantal:
//   }
// ]

search(1)
  .then(results => {
    let pages = Math.ceil(results.meta.count / 20)
    let words = []
    let books = []
    let data = []
    let count = 0

    getAndParseData(pages, books, words)
      .then(words => {
        // Create array with all words an their count
        words.sort()
        words.forEach(word => {
          if (count === 0) {
            data.push({
              word: word,
              amount: 0,
              titles: []
            })
            count++
          } else if (data[count] === undefined || data[count].word !== word) {
            count++
            data[count] = {
              word: word,
              amount: 0,
              titles: []
            }
          }
        })
      })
      .then(() => {
        data.forEach((wordInfo, index) => {
          books.forEach(book => {
            if (helper.containsWord(book.title, wordInfo.word)) {
              data[index].titles.push(book.title)
              data[index].amount++
            }
          })
        })
      })
      .then(() => {
        helper.exportArr('words', words)
        helper.exportArr('data', data)
      })
      .catch(err => console.log(err))
  })
  .catch(err => console.error(err))

// Per woord alle auteurs
// per auteur alle titels
//
// [
//   {
//     word: '',
//     authors: [
//       {
//         authorname: '',
//         titles: [
//           '',
//           ''
//         ]
//       }
//     ]
//   }
// ]
