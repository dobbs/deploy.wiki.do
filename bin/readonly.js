const fs = require("fs/promises")
const path = require("path")
const util = require("util")
const glob = util.promisify(require("glob"))
const mkdirp = require("mkdirp")
const hb = require("handlebars")

async function main() {
  let ownedBy = "Eric Dobbs"
  let BASE = path.resolve(".", "wiki")
  let CLIENT = path.resolve(require.resolve("wiki-client/package.json"), "..")
  let SERVER = path.resolve(require.resolve("wiki-server/package.json"), "..")
  let PKG = path.join(CLIENT, "..")

  const htmlTemplate = await createTemplate("wiki-client/views/static.html")
  async function copyPages(pages, jsonfn=x=>x) {
    pages.map(async name => {
      let slug = path.basename(name)
      let jsonFile = path.join(BASE, `${slug}.json`)
      fs.readFile(name, "utf8").then(JSON.parse).then(json => {
        jsonfn(json)
        fs.writeFile(jsonFile, JSON.stringify(json, null, 2))
          .catch(err => console.error({err}))
      })
      let htmlFile = path.join(BASE, `${slug}.html`)
      fs.writeFile(htmlFile, htmlTemplate({ownedBy,pages: [{page: slug}]}))
        .catch(err => console.error({err}))
    })
  }

  //copy wiki-client code
  for (let filename of await findfiles(path.join(CLIENT, "client", "**"))) {
    let destination = path.join(
      BASE,
      filename.slice(path.join(CLIENT, "client").length)
    )
    copyp(filename, destination)
  }

  //create factories.json
  let factoriesfile = path.join(BASE, "system", "factories.json")
  await mkdirp(path.dirname(factoriesfile))
  Promise.all(
    (await findfiles(path.join(PKG, "wiki-plugin-*/factory.json")))
      .map(async factory => require(factory))
  ).then(factories =>
    fs.writeFile(factoriesfile, JSON.stringify(factories, null, 2))
  )

  //copy wiki-plugins
  for (let name of await findfolders(path.join(PKG, "wiki-plugin-*", "client"))) {
    let plugin = name.slice(0, -8)
    let type = plugin.slice(path.join(PKG, "wiki-plugin-").length)
    let pluginsdir = path.join(BASE, "plugins", type)

    //copy source code
    let sources = await findfiles(path.join(name, "**"))
    sources.map(async file => {
      let destination = path.join(pluginsdir, file.slice(name.length))
      copyp(file, destination)
    })

    //copy pages
    let pages = await findfiles(path.join(plugin, "pages", "**"))
    copyPages(pages, json => {json.plugin = type})
  }

  //copy default-data
  copyPages(await findfiles(path.join(SERVER, "default-data", "pages", "**")))
  copyp(
    path.join(SERVER, "default-data", "status", "favicon.png"),
    path.join(BASE, "favicon.png"))
}

function createTemplate(filename) {
  return fs.readFile(require.resolve(filename), "utf8")
    .then(hb.compile)
}

async function copyp(source, destination) {
  // ensure path to destination exists before copying
  await mkdirp(path.dirname(destination))
  await fs.copyFile(source, destination)
}
const findfiles = pattern => glob(pattern, {nodir: true})
const findfolders = pattern => glob(path.join(pattern, "/"))

main()
