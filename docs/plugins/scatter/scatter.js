/*
 * Federated Wiki : Scatter Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-plugin-scatter/blob/master/LICENSE.txt
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm'

async function emit($item, item) {
  $item.append(`
    <style>
      svg {
        font: 10px san-serif;
        background: #eee;
      }
      circle {
        fill: grey;
        stroke: white;
      }
    </style>
  `)

  const value = obj => {
    if (obj == null) {
      return NaN
    }
    switch (obj.constructor) {
      case Number:
        return obj
      case String:
        return +obj
      case Array:
        return value(obj[0])
      case Object:
        return value(obj.value)
      case Function:
        return obj()
      default:
        return NaN
    }
  }

  const round = n => {
    if (n == null) {
      return '?'
    }
    if (n.toString().match(/\.\d\d\d/)) {
      return n.toFixed(2)
    } else {
      return n
    }
  }

  const who = $('.chart,.data,.calculator').last()
  const data = who.data('item').data
  let horz = 'Water / Land Intensity Total'
  const vert = 'Total Score'
  const xdat = d => value(d[horz])
  const ydat = d => value(d[vert])
  const title = d => {
    return `
    ${d.Material}
    ${horz}: ${round(xdat(d))}
    ${vert}: ${round(ydat(d))}
    Rank: ${value(d['Rank'])}
    `
  }

  who.on('thumb', (e, thumb) => {
    if (thumb == horz) {
      return
    }
    horz = thumb
    x = d3.scaleLinear().domain(extent(xdat)).range([0, width])
    d3.selectAll('circle')
      .transition()
      .duration(500)
      .delay((d, i) => i * 10)
      .attr('cx', d => x(xdat(d)))
      .selectAll('title')
      .text(title)
  })

  const extent = f => {
    const lo = Math.min(...data.map(f))
    const hi = Math.max(...data.map(f))
    const step = Math.pow(10, Math.floor(Math.log(hi - lo) / Math.log(10)))
    return [step * Math.floor(lo / step), step * Math.ceil(hi / step)]
  }

  const width = 360
  const height = 275
  const padding = 20
  let x = d3.scaleLinear().domain(extent(xdat)).range([0, width])
  const y = d3.scaleLinear().domain(extent(ydat)).range([height, 0])
  const fill = d3.interpolateViridis

  const vis = d3
    .select($item.get(0))
    .data([data])
    .append('svg')
    .attr('width', width + padding * 2)
    .attr('height', height + padding * 2)
    .append('g')
    .attr('transform', `translate(${padding},${padding})`)

  vis
    .selectAll('cicle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => x(xdat(d)))
    .attr('cy', d => y(ydat(d)))
    .style('fill', (d, i) => fill(i / data.length))
    .style('cursor', 'pointer')
    .attr('r', 10)
    .on('click', d => {
      let page = null
      if (!d.shiftKey) {
        page = $item.parents('.page')
      }
      wiki.doInternalLink(d.target.__data__.Material, page)
    })
    .append('title')
    .text(title)
}

function bind($item, item) {}

if (typeof window !== 'undefined' && window !== null) {
  window.plugins.scatter = {
    emit: emit,
    bind: bind,
  }
}
