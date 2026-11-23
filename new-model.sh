#!/bin/sh
# Usage: ./new-model.sh t14-gen4   (id must match the "id" in assets/data.js, lowercase)
[ -z "$1" ] && echo "usage: $0 <id>" && exit 1
id=$(echo "$1" | tr 'A-Z' 'a-z')
mkdir -p "$id" && sed "s/MODEL_ID/$id/" _model-template.html > "$id/index.html" && echo "created $id/index.html"
