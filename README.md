# deploy.wiki.do

We aspire to bootstrap a devops pipeline for wiki.

What we have right now is a read-only wiki hosted statically using
GitHub Pages.

# Runbook

To extract the read-only wiki from docker image dobbs/farm:

    sh bin/readonly.sh

To test static wiki locally:

    deno install --allow-net --allow-read \
      https://deno.land/std@0.81.0/http/file_server.ts
    cd docs
    file_server
