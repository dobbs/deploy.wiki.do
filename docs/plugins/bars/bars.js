/*
 * Federated Wiki : Bars Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-plugin-bars/blob/master/LICENSE.txt
 */

import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

function everyNth(data, n) {
  return data.filter((e, i, a) => {
    return i % n === 0
  })
}

async function emit($item, item) {
  const data = everyNth(wiki.getData(), 5).map(x => x[1])

  $item.append(Plot.plot({
    height: 260,
    width: 420,
    x: {
      grid: true
    },
    marks: [
      Plot.barX(data, {y: (d,i) => i, fill: "steelblue"}),
      Plot.text(data, {y: (d,i) => i, x: d => d, dx: -15, fill: "white", text: d => d.toFixed(1)}),
      Plot.ruleX([0])
    ]
  }))

}

function bind($item, item) {}

if (typeof window !== "undefined" && window !== null) {
  window.plugins.bars = {
    emit: emit,
    bind: bind
  }
}