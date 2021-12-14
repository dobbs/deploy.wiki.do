#!/bin/bash
set -euo pipefail
ITS=$'\n\r\t'

command -v k3d || {
  brew install --cask docker
  brew install k3d
}
