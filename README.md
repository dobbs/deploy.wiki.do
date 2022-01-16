# deploy.wiki.do

We aspire to bootstrap a publishing workflow for wiki. It might also
grow into a devops workflow for wiki.

There used to be some code in this repo which has moved into an
experimental wiki static site generator. All that is now left here is
the generated site for publishing via GitHub Pages.

# Runbook

To generate a read-only wiki:

    npx wiki-ssg build --from ~/.wiki --dest docs

To test static wiki locally:

    npx http-server docs
