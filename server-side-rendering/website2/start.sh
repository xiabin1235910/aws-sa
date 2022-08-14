#!/bin/bash

echo "starting bff..."

npm install

./bin/install.sh

npm run build
npm run build:node

pm2 start npm --name "website2" -- serve