/*
 * Federated Wiki : Math Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-plugin-line/blob/master/LICENSE.txt
 */

const katexVersion = '0.16'

async function emit(div, item) {
  if (!$(`link[href='https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex.min.css']`).length) {
    $(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex.min.css">`).appendTo(
      'head',
    )
  }

  await import(`https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex.js`)

  const text = wiki.resolveLinks(item.text)

  const unescape = str => {
    return (str || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  }

  const parsedText = text
    .split(/\n/)
    .map(line => {
      if (line.startsWith('\\[')) {
        return window.katex.renderToString(unescape(line.replace(/\\\[/, '').replace(/\\\]/, '').trim()), {
          displayMode: true,
          throwOnError: false,
        })
      } else {
        return line
          .split(/((?:\\\(.*?(?:\\\))))/)
          .map(part => {
            if (part.startsWith('\\(')) {
              return window.katex.renderToString(unescape(part.slice(2, -2)), { throwOnError: false })
            } else {
              return part
            }
          })
          .join('')
      }
    })
    .join('\n')

  div.append(`<p>${parsedText}`)
}

function bind(div, item) {
  div.on('dblclick', () => wiki.textEditor(div, item))
}

if (typeof window !== 'undefined' && window !== null) {
  window.plugins.math = window.plugins.mathjax = {
    emit: emit,
    bind: bind,
  }
}
