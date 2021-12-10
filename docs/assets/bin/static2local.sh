#!/bin/bash
set -euo pipefail
ITS=$'\n\r\t'

usage() {
  cat <<EOF
Usage: $(basename $0) STATIC LOCAL

  Will copy favicon, pages, and sitemap from a static wiki to a local wiki

Parameters:
  STATIC   path to the folder where the static wiki is saved
  LOCAL    path to the local wiki folder

Example:

  $(basename $0) ~/workspace/dobbs/deploy.wiki.do ~/.wiki-k8s/deploy.localhost

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
readonly STATIC_DIR=${1-$MISSING}
readonly WIKI_DIR=${2-$MISSING}

if [ -n "${HELP-}" ] || [ "$STATIC_DIR" == "$MISSING" ] || [ "$WIKI_DIR" == "$MISSING" ] ; then
  usage
  exit 0
elif [ ! -d $STATIC_DIR ] || [ ! -d $WIKI_DIR ]; then
  cat <<EOF

ERROR: Both STATIC and LOCAL must be directories

EOF
  usage
  exit 1
fi

mkdir -p ${WIKI_DIR}/{pages,assets,status}

cd ${STATIC_DIR}
cp favicon.png ${WIKI_DIR}/status \
  && echo ${WIKI_DIR}/status/favicon.png
for JSON in $(ls *.json); do
  DEST=${WIKI_DIR}/pages/${JSON//.json/}
  cp $JSON $DEST && echo ${DEST}
done
rsync -va assets/ ${WIKI_DIR}/assets/
