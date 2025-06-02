/*
 * Federated Wiki : Radar Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-plugin-radar/blob/master/LICENSE.txt
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm'

async function emit($item, item) {
  $item.append('<style>svg { font: 10px sans-serif;}</style>')

  let limit = {}
  let keyArray = []
  let max = -Infinity

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

  const parseText = text => {
    let args
    text.split('\n').forEach(line => {
      if ((args = line.match(/^([0-9.eE-]+) +([\w \/%(){},&-]+)$/))) {
        keyArray.push(args[2])
        limit[args[2]] = +args[1]
      } else if ((args = line.match(/^([0-9\.eE-]+)$/))) {
        max = +args[1]
      } else if ((args = line.match(/^ *([\w \/%(){},&-]+)$/))) {
        keyArray.push(args[1])
      }
    })
  }

  const limitsFromData = data => {
    limit = {}
    data.forEach(d => {
      Object.entries(d).forEach(entry => {
        let [k, v] = entry
        let vv = value(v)
        if (!isNaN(vv)) {
          if (limit[k]) {
            if (vv > limit[k]) {
              limit[k] = vv
            }
          } else {
            limit[k] = vv
          }
        }
      })
    })
  }

  let data
  let who

  const candidates = $('.item:lt('.concat($('.item').index($item), ')'))
  if ((who = candidates.filter('.radar-source')).length) {
    data = [...who].map(d => d.radarData())
  } else if ((who = candidates.filter('.data')).length) {
    const rows = who.filter(d => $(who[d]).data('item').data.length === 1)
    if (rows.length > 0) {
      data = [...rows].map(d => $(d).data('item').data[0])
    } else {
      data = who.last().data('item').data
    }
  } else {
    throw "Can't find suitable data"
  }

  if (item.text != null && item.text.match(/\S/)) {
    parseText(item.text)
    if (Object.keys(limit).length == 0) {
      if (max == -Infinity) {
        limitsFromData(data)
      } else {
        if (Object.keys(keyArray).length == 0) {
          limitsFromData(data)
          keyArray = Object.keys(limit)
        }
        keyArray.forEach(k => (limit[k] = max))
      }
    }
  } else {
    limitsFromData(data)
    keyArray = Object.keys(limit)
  }

  const complete = object => {
    return keyArray.every(key => object[key] != null)
  }

  const merged = []
  let merging = {}

  data.forEach(each => {
    merging = { ...merging, ...each }
    if (complete(merging)) {
      merged.push(merging)
      merging = {}
    }
  })
  data = merged

  const percents = obj => {
    keyArray.forEach(k => {
      if (obj[k] == null) {
        throw `Missing value for '${k}'`
      }
    })
    return keyArray.concat(keyArray[0]).map(k => {
      return (100 * value(obj[k])) / limit[k]
    })
  }

  $item.on('dblclick', e => {
    if (e.shiftKey) {
      wiki.dialog('JSON for Radar plugin', `<pre>${JSON.stringify(item, null, 2)}</pre>`)
    } else {
      if (!(item.text != null && item.text.match(/\S/))) {
        item.text = keyArray.map(k => `${limit[k]} ${k}`).join('\n')
      }
      wiki.textEditor($item, item)
    }
  })

  const width = 400
  const height = 400
  const vizPadding = {
    top: 10,
    right: 0,
    bottom: 15,
    left: 0,
  }

  const dimension = keyArray.length
  const ruleColor = '#EEE'
  const labelColor = '#CCC'

  const angle = i => {
    return (i / dimension) * 2 * Math.PI
  }
  const rotate = i => {
    return `rotate(${(i / dimension) * 360 - 90})`
  }
  const translate = percent => {
    return `translate(${radius((maxVal * percent) / 100)})`
  }
  const series = data.map(d => percents(d))
  const comments = []
  data.forEach(m => {
    for (let d = 0; d < dimension - 1; d++) {
      let o, c
      if ((o = m[keyArray[d]]) != null) {
        if ((c = o.comment) != null) {
          comments.push({
            data: m,
            dimension: d,
            comment: c,
          })
        }
      }
    }
  })
  const hours = [...Array(dimension).keys()]
  const minVal = 0
  const maxVal = 100

  const viz = d3.select($item.get(0)).append('svg').attr('width', width).attr('height', height).attr('class', 'vizSvg')
  const vizBody = viz.append('g').attr('id', 'body')

  const heightCircleConstraint = height - vizPadding.top - vizPadding.bottom
  const widthCircleConstraint = width - vizPadding.left - vizPadding.right
  const circleConstraint = d3.min([heightCircleConstraint, widthCircleConstraint])
  const radius = d3
    .scaleLinear()
    .domain([minVal, maxVal])
    .range([0, circleConstraint / 2])
  const radiusLength = radius(maxVal)
  const centerXPos = widthCircleConstraint / 2 + vizPadding.left
  const centerYPos = heightCircleConstraint / 2 + vizPadding.top
  vizBody.attr('transform', `translate(${centerXPos},${centerYPos})` + rotate(0))

  let lastThumb = null
  who.on('thumb', (e, thumb) => {
    let index
    if (thumb == lastThumb || -1 == (index = keyArray.indexOf((lastThumb = thumb)))) {
      return
    }
    vizBody
      .transition()
      .duration(750)
      .attr('transform', `translate(${centerXPos}, ${centerYPos})` + rotate(-index))
  })

  const radiusTicks = radius.ticks(5)
  const circleAxes = vizBody
    .selectAll('.circle-ticks')
    .data(radiusTicks)
    .enter()
    .append('g')
    .attr('class', 'circle-ticks')
  circleAxes
    .append('circle')
    .attr('r', (d, i) => radius(d))
    .attr('class', 'circle')
    .style('stroke', ruleColor)
    .style('fill', 'none')
  circleAxes
    .append('text')
    .attr('text-anchor', 'end')
    .style('stroke', ruleColor)
    .attr('dy', d => -1 * radius(d))
    .text(String)

  const fill = d3.schemeCategory10
  const colorSelector = (d, i) => fill[i]

  vizBody
    .selectAll('.series')
    .data(series)
    .enter()
    .append('g')
    .attr('class', 'series')
    .append('path')
    .attr('class', 'line')
    .style('fill', colorSelector)
    .style('stroke', colorSelector)
    .style('stroke-width', 3)
    .style('fill-opacity', 0.1)
    .style('fill', colorSelector)
    .attr(
      'd',
      d3
        .lineRadial()
        .radius(d => radius(d != null && !isNaN(d) ? d : 0))
        .angle((d, i) => angle(i)),
    )
    .append('title')
    .text((d, i) => data[i]['Material name'])

  vizBody
    .selectAll('.comment')
    .data(comments)
    .enter()
    .append('g')
    .attr('class', 'comments')
    .append('text')
    .style('font-size', '40px')
    .style('fill', colorSelector)
    .attr('text-anchor', 'mid')
    .attr('transform', d => {
      let percent = series[d.data][d.dimension]
      rotate(d.dimension) + translate(percent)
    })
    .text('*')
    .append('text')
    .text(d => d.comment)

  const lineAxes = vizBody
    .selectAll('.line-ticks')
    .data(hours)
    .enter()
    .append('g')
    .attr('transform', (d, i) => rotate(i) + translate(100))
    .attr('class', 'line-ticks')
  lineAxes
    .append('line')
    .attr('x2', -1 * radius(maxVal))
    .style('stroke', ruleColor)
    .style('fill', 'none')
  lineAxes
    .append('text')
    .text((d, i) => keyArray[i].slice(0, 20))
    .attr('x', 5)
    .attr('y', -5)
    .attr('text-anchor', 'start')
    .style('stroke', labelColor)
    .style('cursor', 'pointer')
    .style('font-size', '14px')
    .attr('transform', 'rotate(180)')
    .on('click', (d, i) => {
      let page = null
      if (!d.shiftKey) {
        page = $item.parents('.page')
      }
      wiki.doInternalLink(keyArray[i], page)
    })
}

function bind($item, item) {}

if (typeof window !== 'undefined' && window !== null) {
  window.plugins.radar = {
    emit: emit,
    bind: bind,
  }
}
