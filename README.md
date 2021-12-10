# deploy.wiki.do

We aspire to bootstrap a devops pipeline for wiki.

What we have right now is a read-only wiki hosted statically using
GitHub Pages.

# How we created the read-only wiki client

We extracted the wiki client code from dobbs/farm container image as follows:

    docker run --rm -i dobbs/farm sh <<EOF | tar -C docs -x
    cd ~/lib/node_modules/wiki/node_modules/wiki-client/client
    tar -cf - \
      --exclude ReadMe.md --exclude test \
      --exclude twitter* --exclude runtests* .
    EOF

    docker run --rm -i dobbs/farm sh <<EOF > docs/system/factories.json
    jq -s . lib/node_modules/wiki/node_modules/wiki-plugin-*/factory.json
    EOF

    docker run --rm -i -u root \
      -w /home/node/lib/node_modules/wiki/node_modules \
      dobbs/farm sh <<'EOF' > plugins.tar
    apk -u add tar 2>&1 > /dev/null
    TARBALL=${PWD}/plugins.tar
    MODS=$PWD
    ls -d wiki-plugin-*/client | sed 's/\/client//' | while read -r PLUGIN; do
      TYPE=${PLUGIN#wiki-plugin-}
      cd ${MODS}/${PLUGIN}
      mv client ${TYPE}
      tar --append -f ${TARBALL} ${TYPE}
    done
    cat ${TARBALL}
    EOF

    mkdir docs/plugins
    cd docs/plugins
    tar xf ../../plugins.tar
