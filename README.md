# deploy.wiki.do

We aspire to bootstrap a devops pipeline for wiki.

What we have right now is a read-only wiki hosted statically using
GitHub Pages.

# Runbook

To generate a read-only wiki:

    npm run readonly

To test static wiki locally:

    deno install --allow-net --allow-read \
      https://deno.land/std@0.81.0/http/file_server.ts
    cd docs
    file_server
