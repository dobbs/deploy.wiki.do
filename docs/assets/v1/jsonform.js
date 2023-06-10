import * as frame from "./frame.js"

/* Example usage:

  filename: string
  fields: [string, ...]
  function: ({string, ...}) => string

  fields must match the named arguments for the function

  const form = jsonform(
    "owner.json",
    ["author", "password"],
    ({author, password}) => `{
  "owner": "${author}",
  "friend": {
    "secret": "${password}"
  }
}`)

*/

export function jsonform(
  filename,
  fields,
  jsonfn
) {
  const el = document.createElement("form")
  el.innerHTML = `
  <h3>${filename}</h3>
  <table class="fields">
  <tr>
    <td><button type="submit" data-action="preview">
      Preview
    </button></td>
    <td><button type="submit" data-action="download">
      Download
    </button></td>
  </tr>
  ${fields.map(row).join("")}
  </table>
  <pre data-id="preview"></pre>
  </form>`

  el.onsubmit = event => {
    event.preventDefault()
    const {action} = event.submitter.dataset
    switch(action) {
      case "preview":
        preview.innerHTML = jsonfn(params())
        break
      case "download":
        const json = preview.innerHTML
        frame.download(json, filename)
    }
    frame.resize()
  }

  function row(field) {return `
  <tr>
    <th style="text-align:right;font-weight:normal;">
      <label for="${field}">${field}</label></th>
    <td><input type="text"
      name="${field}" id="${field}"></td>
  </tr>`}

  function params() { return Object.fromEntries(
    Array
      .from(el.elements)
      .filter(el => el.tagName == "INPUT")
      .map(el => [el.name, el.value])
  )}

  const preview = el
    .querySelector("[data-id=preview]")
  preview.innerHTML = jsonfn(params())
  frame.resize()

  return el
}
