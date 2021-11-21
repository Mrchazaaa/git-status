#!/bin/sh

cd /home/pi/workspace/git-status

echo "Pulling from Git"

git pull >> /home/pi/workspace/git-status/logs.txt

echo "Installing client dependencies"

npm install --prefix /home/pi/workspace/git-status/client >> /home/pi/workspace/git-status/logs.txt

echo "Building client"

npm run build --prefix /home/pi/workspace/git-status/client >> /home/pi/workspace/git-status/logs.txt

echo "Installing server dependencies"

npm install --prefix /home/pi/workspace/git-status/server >> /home/pi/workspace/git-status/logs.txt

echo "Starting server"

node /home/pi/workspace/git-status/server/index.js 
