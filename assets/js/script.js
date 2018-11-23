/* global d3, fetch */
'use strict'

/* Used bubble-chart by Mike Bostock as an example/starting point
https://beta.observablehq.com/@mbostock/d3-bubble-chart */

import {
  getSelectedGenre,
  formatBooks,
  getSize
} from './helper.js'
const width = 932
const height = width - 300
const svg = createSvg(width, height)

function init () {
  fetch('https://raw.githubusercontent.com/jeroentvb/frontend-data/master/data.json')
    .then(res => res.json())
    // .then(dataset => datavis(dataset))
    .then(dataset => {
      allData = dataset
      render(dataset)
    })
    .catch(err => console.error(err))

  var allData
  const select = document.getElementById('select-genre')

  select.addEventListener('change', () => {
    let selectedGenre = select.value
    let data = getSelectedGenre(selectedGenre, allData)
    clear()
    render(data)
  })
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
      if (d.amount > 4) return true
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

function createTooltip () {
  return d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
}

function addInfo () {
  return d3.select('body')
    .append('div')
    .attr('id', 'info')
    .style('opacity', 0)
}

function packData (data) {
  return data => d3.pack()
    .size([width - 250, height - 2])
    .padding(3)(d3.hierarchy({ children: data })
      .sum(d => d.value))
}

function render (dataset) {
  // Create dataformat
  const data = formatData(dataset)
  // Pack data
  const pack = packData(data)
  // Format the value to a readable number
  const format = d3.format(',d')
  // Create const root and call pack() with the formatted data
  const root = pack(data)
  // I guess this is scale and range and assinging color
  const color = d3.scaleOrdinal().range(d3.schemeCategory10)

  // function zoomed () {
  //   svg.attr('transform', d3.event.transform)
  // }
  // const zoom = d3.zoom().on('zoom', zoomed)
  //
  // svg.call(zoom)

  const tooltip = createTooltip()
  const mouseover = d => {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0.9)
    tooltip.html(`Het woord <i>${d.data.name}</i> komt ${d.value} keer voor in het genre <i>${d.data.genre.toLowerCase()}</i>`)
      .style('left', `${d.x}px`)
      .style('top', `${d.y - (d.value - 40)}px`)
  }
  const mouseout = d => {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0)
  }

  const infoBox = addInfo()
  const click = d => {
    infoBox.transition()
      .duration(400)
      .style('opacity', 0.9)
    infoBox.html(formatBooks(d.data.books))
  }

  const leaf = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
    .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`)

  leaf.append('circle')
    .attr('r', 0)
    .attr('fill-opacity', 0.7)
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)
    .on('click', click)
    .transition()
    .duration(600)
    .attr('r', d => {
      if (dataset.name === 'genres') {
        return d.value
      } else {
        return getSize(d)
      }
    })
    .attr('fill', d => color(d.data.genre))

  leaf.append('text')
    .style('pointer-events', 'none')
    .selectAll('tspan')
    // If this isn't splitted, the text will run from up > down instead of left > right
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append('tspan')
    .attr('x', 0)
    // Some math to position the text inside the bubble
    .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    .text(d => d)

  leaf.selectAll('text')
    .attr('font-size', 0)
    .transition()
    .duration(600)
    .attr('font-size', d => d.value)

  // Add tooltip on hover
  leaf.append('name')
    .text(d => {
      return `${d.data.genre}\n${format(d.value)}`
    })
}

function clear (data) {
  svg.selectAll('g').remove()
}

// Spent days trying to get this working.
// function update (dataset) {
//   const data = formatData(dataset)
//   const pack = packData(data)
//   const format = d3.format(',d')
//   const root = pack(data)
//   const color = d3.scaleOrdinal().range(d3.schemeCategory10)
//
//   const leaves = svg.selectAll('g')
//     .data(root.leaves())
//
//   leaves
//     .enter().append('g')
//     .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`)
//     .append('circle')
//     .attr('r', d => d.value)
//     .attr('fill-opacity', 0.7)
//     .attr('fill', d => color(d.data.genre))
//
//   leaves
//     .exit()
//     .remove()
// }

init()
