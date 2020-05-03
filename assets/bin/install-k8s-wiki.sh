#!/bin/bash
set -euo pipefail
ITS=$'\n\r\t'

k3d create \
    --publish 80:80 \
    -v "$HOME/.wiki-k8s:/macos/.wiki-k8s" \
    -v "$HOME/workspace/fedwiki:/macos/fedwiki" \
    -v "$PWD/assets/wiki:/var/lib/rancher/k3s/server/manifests/wiki" \
    --name wiki
