#!/bin/bash
set -euo pipefail
ITS=$'\n\r\t'

kubectl get svc/wiki-service >/dev/null 2>&1 || {
  mkdir -p $HOME/.wiki-k8s $HOME/workspace/fedwiki
  k3d cluster create wiki \
      --k3s-server-arg --tls-san="127.0.0.1" \
      --port 80:80@loadbalancer \
      --image rancher/k3s:v1.21.2-k3s1 \
      --volume "$HOME/.wiki-k8s:/macos/.wiki-k8s" \
      --volume "$HOME/workspace/fedwiki:/macos/fedwiki" \
      --volume "$PWD/assets/wiki:/var/lib/rancher/k3s/server/manifests/wiki" \
      --wait
}
