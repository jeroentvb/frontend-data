export function getSelectedGenre (selectedGenre, dataset) {
  let data
  dataset.children.forEach((genre, index) => {
    if (genre.name.toLowerCase() === selectedGenre) {
      data = genre
    }
  })
  return data
}

export function formatBooks (books) {
  let html = ''
  books.forEach(book => {
    html += '<ul>'
    html += `<li>Titel: ${book.name}</li>`
    html += `<li>Auteur: ${book.author}</li>`
    html += '</ul>'
  })
  return html
}

export function getSize (d) {
  let genre = d.data.genre.toLowerCase()
  let value = d.data.value

  switch (genre) {
    case 'western':
      return value + 50
    case 'humor':
      return value
    case 'sport':
      return value + 18
    default:
      return value
  }
}
