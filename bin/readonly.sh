docker run --rm -i -w /home/node/lib/node_modules/wiki/node_modules \
  dobbs/farm:latest sh <<'EOF' | tar -C docs -x
main() {
  mkdir -p ~/wiki/plugins ~/wiki/system
  readonly MODS=${PWD}

  copy_wiki_client
  create_factories
  plugins

  cd ~/wiki && tar c .
}

copy_wiki_client() {
  cp -r wiki-client/client/* ~/wiki/
}

create_factories() {
  jq -s . wiki-plugin-*/factory.json > ~/wiki/system/factories.json
}

plugins() {
  npx node <<'JS'
const fs = require("fs/promises")
const path = require("path")
const util = require("util")
const glob = util.promisify(require("glob"))
const mkdirp = require("mkdirp")
const hb = require("handlebars")

async function main() {
  await glob("wiki-plugin-*/client").then(async plugins => {
    let filename = require.resolve("wiki-client/views/static.html")
    const htmlTemplate = await fs.readFile(filename, "utf8")
      .then(string => hb.compile(string))
      .catch(err => console.error({err}))

    for (let name of plugins) {
      let plugin = name.slice(0, -7)
      let type = plugin.slice(12)
      let pluginsdir = path.join(process.env.HOME, "wiki", "plugins", type)
      glob("**", {cwd: name, nodir: true}).then(files => {
        for (let file of files) {
          let source = path.resolve(name, file)
          let destination = path.join(pluginsdir, file)
          mkdirp(path.dirname(destination)).then(_ => {
            fs.copyFile(source, destination)
          })
        }
      })

      glob(path.join(plugin, "pages", "**"), {nodir: true}).then(pages => {
        for (let name of pages) {
          let slug = path.basename(name)
          let aboutPage = path.join(process.env.HOME, "wiki", `${slug}.json`)
          fs.readFile(name, "utf8").then(string => {
            let json = JSON.parse(string)
            json.plugin = type
            fs.writeFile(aboutPage, JSON.stringify(json))
              .catch(err => console.error({err}))
          })
          let htmlFile = path.join(process.env.HOME, "wiki", `${slug}.html`)
          fs.writeFile(htmlFile, htmlTemplate({
            ownedBy: "Eric Dobbs",
            pages: [{page: slug}]
          }))
            .catch(err => console.error({err}))
        }
      })
    }
  })
}
main()
JS
}

plugins_with_code() {
  ls -d wiki-plugin-*/client | sed 's/\/client$//'
}

copy_plugin() {
  local PLUGIN=$1
  local TYPE=${PLUGIN#wiki-plugin-}
  mkdir -p ~/wiki/plugins/${TYPE}
  cp -r ${MODS}/${PLUGIN}/client/* ~/wiki/plugins/${TYPE}/
}

create_pages() {
  local PLUGIN=$1
  local TYPE=${PLUGIN#wiki-plugin-}
  local DIR=${MODS}/${PLUGIN}/pages
  if [ -d "${DIR}" ]; then
    cd ${DIR}
    ls | while read -r SLUG; do
      about_page ${TYPE} ${SLUG}
      html ${SLUG}
    done
  fi
}

about_page() {
  local TYPE=$1
  local SLUG=$2
  jq ".plugin = \"${TYPE}\"" ${SLUG} > ~/wiki/${SLUG}.json
}

html() {
  (
    cd ~/lib/node_modules/wiki
    npx node <<"JS" > ~/wiki/${SLUG}.html
      const hb = require("handlebars")
      const fs = require("fs")
      const filename = require.resolve("wiki-client/views/static.html")
      const source = fs.readFileSync(filename).toString()
      const tmpl = hb.compile(source)
      tmpl({ownedBy: "Eric Dobbs", pages: [{page:"${SLUG}"}]})
JS
  ) > ~/wiki/${SLUG}.html
}

main
EOF
