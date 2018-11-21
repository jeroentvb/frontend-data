/* global d3, fetch */
'use strict'

// const dataset = {
//   'name': 'flare',
//   'children': [
//     {
//       'name': 'analytics',
//       'children': [
//         {
//           'name': 'cluster',
//           'children': [
//             {
//               'name': 'AgglomerativeCluster',
//               'size': 3938
//             },
//             {
//               'name': 'CommunityStructure',
//               'size': 3812
//             },
//             {
//               'name': 'HierarchicalCluster',
//               'size': 6714
//             },
//             {
//               'name': 'MergeEdge',
//               'size': 743
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }
//
// const dataset2 = {
//   'name': 'genres',
//   'children': [
//     {
//       'name': 'Western',
//       'children': [
//         {
//           'name': 'avonturen',
//           'amount': 2,
//           'books': [
//             {
//               'name': 'Avonturen in het Wilde Westen',
//               'author': 'Karl May'
//             },
//             {
//               'name': 'De verdere avonturen van Winnetou en Old Shatterhand',
//               'author': 'Karl May'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       'name': 'Humor',
//       'children': [
//         {
//           'name': 'test',
//           'amount': 1,
//           'children': [
//             {
//               'name': 'Dit is een test',
//               'author': 'Joopie'
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }

function init () {
  fetch('https://raw.githubusercontent.com/jeroentvb/frontend-data/master/datavis/data.json')
    .then(res => res.json())
    // .then(dataset => datavis(dataset))
    .then(dataset => render(dataset))
    .catch(err => console.error(err))
}

function formatData (dataset) {
  return d3.hierarchy(dataset) // await require('@observablehq/flare')
    // array with last items in json tree
    .leaves()
    .map(d => {
      let p = d
      // make p the 2 level deep element.
      while (p.depth > 2) p = p.parent
      // .ancestors() gets all objects above object in tree
      // .reverse() reverses the order. Instead of down > up it goes up > down
      // .map(a => a.data.name) Gets the names of all objects in the tree
      // .join() concats the names to a single string
      // d.data.name = d.ancestors().reverse().map(a => a.data.name).join(' > ') < f*cks the naming up
      // d.data.name = d.data.name
      // Make the group (genre) name the name of the p object
      d.data.genre = p.parent.data.name
      return d
    })
    // Map the data object of d to d
    .map(d => d.data)
    // Set the mimimus amount of titles that a word has to have
    .filter(d => {
      if (d.amount > 5) return true
    })
    // Some kind of sorting, doesn't seem to be essential
    // .sort((a, b) => a.genre.localeCompare(b.genre))
    .map(({ name, title, genre, amount, books }) => ({ name, title, genre, value: amount, books }))
}

function createSvg (width, height) {
  return d3.select('svg')
    .style('width', '100%')
    .style('height', height)
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'middle')
}

function render (dataset) {
  const width = 932
  const height = width

  // Create dataformat
  const data = formatData(dataset)

  const pack = data => d3.pack()
    .size([width - 250, height - 2])
    .padding(3)(d3.hierarchy({ children: data })
      .sum(d => d.value))

  // Format the value to a readable number
  const format = d3.format(',d')

  // Create const root and call pack() with the formatted data
  const root = pack(data)

  // I guess this is scale and range and assinging color
  const color = d3.scaleOrdinal().range(d3.schemeCategory10)

  const svg = createSvg(width, height)

  const leaf = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
    .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`)

  leaf.append('circle')
    // .attr('id', d => (d.leafUid = DOM.uid('leaf')).id)
    .attr('r', d => d.value)
    .attr('fill-opacity', 0.7)
    .attr('fill', d => color(d.data.genre))

  // Doesn't work due to DOM. not existing in the browser, does exist in observablehq
  // leaf.append('clipPath')
  //   .attr('id', d => (d.clipUid = DOM.uid('clip')).id)
  //   .append('use')
  //   .attr('xlink:href', d => d.leafUid.href)

  leaf.append('text')
    .attr('font-size', d => d.value)
    // Doesn't really do much because the code above doesn't work
    // .attr('clip-path', d => d.clipUid)
    .selectAll('tspan')
    // If this isn't splitted, the text will run from up > down instead of left > right
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append('tspan')
    .attr('x', 0)
    // Some math to position the text inside the bubble
    .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    .text(d => d)

  // Add tooltip on hover
  leaf.append('name')
    .text(d => {
      return `${d.data.genre}\n${format(d.value)}`
    })
}

init()
