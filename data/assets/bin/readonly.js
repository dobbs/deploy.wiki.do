const fs = require("fs/promises")
const path = require("path")
const util = require("util")
const glob = util.promisify(require("glob"))
const mkdirp = require("mkdirp")
const hb = require("handlebars")

async function fakeTopLevelAwait() {
  let ownedBy = "Eric Dobbs"
  let PKG = path.resolve(".")
  let BASE = path.resolve(".", "wiki")
  let CLIENT = path.resolve(require.resolve("wiki-client/package.json"), "..")
  let SERVER = path.resolve(require.resolve("wiki-server/package.json"), "..")
  let DEPS = path.join(CLIENT, "..")
  const htmlTemplate = await createTemplate("wiki-client/views/static.html")

  async function main() {
    copyWikiClientCode()
    createFactories()
    copyPlugins()
    copyDefaultData()
    copyWikiData()
  }

  async function copyWikiClientCode() {
    for (let filename of await findfiles(path.join(CLIENT, "client", "**"))) {
      let destination = path.join(
        BASE,
        filename.slice(path.join(CLIENT, "client").length)
      )
      copyp(filename, destination)
    }
  }

  async function createFactories() {
    let factoriesfile = path.join(BASE, "system", "factories.json")
    await mkdirp(path.dirname(factoriesfile))
    Promise.all(
      (await findfiles(path.join(DEPS, "wiki-plugin-*/factory.json")))
        .map(async factory => require(factory))
    ).then(factories =>
      fs.writeFile(factoriesfile, JSON.stringify(factories, null, 2))
    )
  }

  async function copyPlugins() {
    for (let name of await findfolders(path.join(DEPS, "wiki-plugin-*", "client"))) {
      let plugin = name.slice(0, -8)
      let type = plugin.slice(path.join(DEPS, "wiki-plugin-").length)
      let pluginsdir = path.join(BASE, "plugins", type)

      copyCode(name, pluginsdir)
      copyPages(
        await findfiles(path.join(plugin, "pages", "**")),
        json => {json.plugin = type})
    }
  }

  async function copyCode(source, destination) {
    let sources = await findfiles(path.join(source, "**"))
    sources.map(async file => {
      copyp(
        file,
        path.join(destination, file.slice(source.length))
      )
    })
  }

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
      await mkdirp(path.dirname(htmlFile))
      fs.writeFile(htmlFile, htmlTemplate({ownedBy,pages: [{page: slug}]}))
        .catch(err => console.error({err}))
    })
  }

  async function copyDefaultData() {
    copyPages(await findfiles(path.join(SERVER, "default-data", "pages", "**")))
    copyp(
      path.join(SERVER, "default-data", "status", "favicon.png"),
      path.join(BASE, "favicon.png"))
  }

  async function copyWikiData() {
    copyPages(await findfiles(path.join(PKG, "data", "pages", "**")))
    let STATUS = path.join(PKG, "data", "status")
    for (let filename of await findfiles(path.join(STATUS, "site*json"))) {
      let destination = path.join(BASE,"system", filename.slice(STATUS.length))
      copyp(filename, destination)
    }
    copyp(
      path.join(STATUS, "sitemap.xml"),
      path.join(BASE, "sitemap.xml"))
    for (let filename of await findfiles(path.join(PKG, "data", "assets", "**"))) {
      let destination = path.join(
        BASE, filename.slice(path.join(PKG, "data").length))
      copyp(filename, destination)
    }
    copyp(
      path.join(PKG, "data", "status", "favicon.png"),
      path.join(BASE, "favicon.png")
    ).catch (error => {
      if (error.code != 'ENOENT') {
        throw error
      }
      console.log("No favicon.png found in data/status. We'll just keep the default.")
    })
    copyp(
      path.join(PKG, "data", "assets", "wiki", "CNAME"),
      path.join(BASE, "CNAME")
    )
    copyp(
      path.join(PKG, "data", "assets", "wiki", "404.html"),
      path.join(BASE, "404.html")
    )
    copyp(
      path.join(BASE, "welcome-visitors.html"),
      path.join(BASE, "index.html")
    )
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
}

fakeTopLevelAwait()
