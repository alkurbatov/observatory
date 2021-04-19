#!/bin/bash

set -eux

for i in frontend backend; do
  export NODE_CONFIG_ENV="${i}"

  npm run mine -- "${1}"
  npm run plot
  cp -f dist/Rplots.pdf ~/Desktop/"${1}-${i}.pdf"
done
