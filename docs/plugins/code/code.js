/*
 * Federated Wiki : Code Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-plugin-code/blob/master/LICENSE.txt
 */

async function emit($item, item) {
  if (!$("link[href='https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css']").length) {
    $('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css">').appendTo("head")
  }
  if (!$("link[href='/plugins/code/code.css']").length) {
    $('<link rel="stylesheet" href="/plugins/code/code.css">').appendTo("head")
  }

  window.HighlightJS = (await import('https://cdn.jsdelivr.net/npm/highlight.js@11/+esm')).HighlightJS

  $item.html(`<pre class='hljs'><code class='hljs'>${HighlightJS.highlightAuto(item.text).value}</code></pre>`)
}

function bind($item, item) {
  $item.on('dblclick', () => wiki.textEditor($item, item))
}

if (typeof window !== "undefined" && window !== null) {
  window.plugins.code = {
    emit: emit,
    bind: bind
  }
}
