/* global d3, fetch */
'use strict'

var allData
const width = 932
const height = width
const svg = createSvg(width, height)
const select = document.getElementById('select-genre')

select.addEventListener('change', () => {
  let selectedGenre = select.value
  let data = getSelectedGenre(selectedGenre, allData)
  clear()
  render(data)
})

function getSelectedGenre (selectedGenre, dataset) {
  let data
  dataset.children.forEach((genre, index) => {
    if (genre.name.toLowerCase() === selectedGenre) {
      data = genre
    }
  })
  return data
}

function init () {
  fetch('https://raw.githubusercontent.com/jeroentvb/frontend-data/master/data.json')
    .then(res => res.json())
    // .then(dataset => datavis(dataset))
    .then(dataset => {
      allData = dataset
      render(dataset)
    })
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

function createTooltip () {
  return d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
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
    tooltip.html(`Komt ${d.value} keer voor in het genre ${d.data.genre.toLowerCase()}`)
      .style('left', `${d.x}px`)
      .style('top', `${d.y - (d.value + 40)}px`)
  }
  const mouseout = d => {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0)
  }

  const leaf = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
    .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`)

  leaf.append('circle')
    // .attr('id', d => (d.leafUid = DOM.uid('leaf')).id)
    .attr('r', d => d.value)
    .attr('fill-opacity', 0.7)
    .attr('fill', d => color(d.data.genre))
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)

  // Doesn't work due to DOM. not existing in the browser, does exist in observablehq
  // leaf.append('clipPath')
  //   .attr('id', d => (d.clipUid = DOM.uid('clip')).id)
  //   .append('use')
  //   .attr('xlink:href', d => d.leafUid.href)

  leaf.append('text')
    .attr('font-size', d => d.value)
    .style('pointer-events', 'none')
    // Doesn't really do much because the code above doesn't work
    // .attr('clip-path', d => d.clipUid)
    .selectAll('tspan')
    // If this isn't splitted, the text will run from up > down instead of left > right
    .data(d => {
      // console.log(d.data)
      return d.data.name.split(/(?=[A-Z][^A-Z])/g)
    })
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

function clear (data) {
  svg.selectAll('g').remove()
}

function update (dataset) {
  const data = formatData(dataset)
  const pack = packData(data)
  const format = d3.format(',d')
  const root = pack(data)
  const color = d3.scaleOrdinal().range(d3.schemeCategory10)

  const leaves = svg.selectAll('g')
    .data(root.leaves())

  leaves
    .enter().append('g')
    .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`)
    .append('circle')
    .attr('r', d => d.value)
    .attr('fill-opacity', 0.7)
    .attr('fill', d => color(d.data.genre))

  leaves
    .exit()
    .remove()
}

init()
