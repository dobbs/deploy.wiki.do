#!/bin/bash
set -euo pipefail
ITS=$'\n\r\t'

usage() {
  cat <<EOF
Usage: $(basename $0) LOCAL STATIC

  Will copy favicon, pages, and sitemap from a local wiki to a static wiki

Parameters:
  LOCAL    path to the local wiki folder
  STATIC   path to the folder where the static wiki is saved

Example:

  $(basename $0) ~/.wiki-k8s/deploy.localtest.me ~/workspace/deploy.wiki.do

EOF
}

PARAMS=""
while (( "$#" )); do
  case "$1" in
    -h|--help)
      HELP=0
      shift
      ;;
    -*|--*=) # unsupported flags
      echo "Error: Unsupported flag $1" >&2
      exit 1
      ;;
    *) # preserve positional arguments
      PARAMS="$PARAMS $1"
      shift
      ;;
  esac
done
# set positional arguments in their proper place
eval set -- "$PARAMS"

readonly MISSING=${RANDOM}
readonly WIKI_DIR=${1-$MISSING}
readonly STATIC_DIR=${2-$MISSING}

if [ -n "${HELP-}" ] || [ "$STATIC_DIR" == "$MISSING" ] || [ "$WIKI_DIR" == "$MISSING" ] ; then
  usage
  exit 0
elif [ ! -d $STATIC_DIR ] || [ ! -d $WIKI_DIR ]; then
  cat <<EOF

ERROR: Both LOCAL and STATIC must be directories

EOF
  usage
  exit 1
fi

mkdir -p ${STATIC_DIR}/assets

cd ${WIKI_DIR}
cp status/favicon.png ${STATIC_DIR} \
  && echo ${STATIC_DIR}/favicon.png
for PAGE in $(ls pages); do
  DEST=${STATIC_DIR}/${PAGE}.json
  cp $WIKI_DIR/pages/$PAGE $DEST && echo ${DEST}
done
rsync -va assets/ ${STATIC_DIR}/assets/
