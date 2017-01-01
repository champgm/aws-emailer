#!/usr/bin/env bash
set -o nounset
#set -o xtrace

cd lambda
npm install
npm run deploy
