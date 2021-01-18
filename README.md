# deploy.wiki.do

Bootstrap a devops pipeline for wiki.

We begin with static files as a federated foreign server:

See http://ward.asia.wiki.org/federating-foreign-servers.html

We collect scripts, configuration, related code, and documentation
that enable the developer-author to deploy a wiki locally. In
addition, through the local wiki we enable the developer-author to
manage their own public wiki farm.

Pages are constructed as JSON files that adhere to a simple schema:

See http://stack.fed.wiki/json-schema.html

# Runbook

    git clone https://github.com/dobbs/deploy.wiki.do
    cd deploy.wiki.do
    PATH=${PATH}:${PWD}/assets/bin
    install-k3d.sh
    install-k8s-wiki.sh
