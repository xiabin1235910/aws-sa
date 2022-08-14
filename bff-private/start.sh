#!/bin/bash

echo "starting bff..."
pm2 start npm --name "bolt-bff" -- start