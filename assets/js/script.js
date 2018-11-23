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
    if (selectedGenre === 'all-genres') {
      render(allData)
      return
    }
    render(data)
  })
}

function formatData (dataset) {
  return d3.hierarchy(dataset)
    .leaves()
    .map(d => {
      let p = d
      while (p.depth > 2) p = p.parent
      d.data.genre = p.parent.data.name
      return d
    })
    .map(d => d.data)
    .filter(d => {
      if (d.amount > 4) return true
    })
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
  const data = formatData(dataset)
  const pack = packData(data)
  const format = d3.format(',d')
  const root = pack(data)
  const color = d3.scaleOrdinal().range(d3.schemeCategory10)

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
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append('tspan')
    .attr('x', 0)
    .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    .text(d => d)

  leaf.selectAll('text')
    .attr('font-size', 0)
    .transition()
    .duration(600)
    .attr('font-size', d => d.value)

  leaf.append('name')
    .text(d => {
      return `${d.data.genre}\n${format(d.value)}`
    })
}

function clear (data) {
  svg.selectAll('g').remove()
}

init()
