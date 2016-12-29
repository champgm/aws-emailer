#!/usr/bin/env bash
set -o nounset
#set -o xtrace

cd web-frontend
git commit -a -m "deploying..."
eb deploy
eb open