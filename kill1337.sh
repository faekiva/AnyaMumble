sudo kill -9 `ps -ef | grep "node /home/curtis/repos/AnyaMumble/node_modules/.bin/nodemon dist/index.js" | grep -v grep | awk '{print $2}'`
sudo kill -9 `sudo lsof -t -i:1337`