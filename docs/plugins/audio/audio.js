/*
 * Federated Wiki : Audio Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-plugin-audio/blob/master/LICENSE.txt
 */

const parse = (text = '') => {
  const result = {}
  let firstLine = true
  for (const line of text.split(/\r\n?|\n/)) {
    if (firstLine) {
      result.key = line
      firstLine = false
    } else {
      result.caption ||= ' '
      result.caption += line + ' '
    }
  }
  return result
}

const embed = ({ key }) => {
  return `
    <iframe
      onload="this.height=this.contentWindow.document.body.clientHeight + 5 + 'px'"
      srcdoc='<audio src="${key}" preload="none" controls style="width: 100%;"><a href="${key}">download audio</a></audio>'
      width="100%" frameborder=0 seamless scrolling="no">
    </iframe>
 `
}

const emit = ($item, item) => {
  const result = parse(item.text)
  $item.append(`
    ${embed(result)}
    <br>
    <i>${wiki.resolveLinks(result.caption || '(no caption)')}</i>
  `)
}

const bind = ($item, item) => {
  $item.on('dblclick', () => wiki.textEditor($item, item))
}

if (typeof window !== 'undefined') {
  window.plugins.audio = { emit, bind }
}

export const audio = typeof window == 'undefined' ? { parse, embed } : undefined
