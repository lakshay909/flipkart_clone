const fs = require('fs');
process.on('exit', (code) => {
  fs.writeFileSync('exit_log.txt', `Exited with code ${code}\n`);
});
process.on('beforeExit', (code) => {
  fs.writeFileSync('before_exit_log.txt', `beforeExit with code ${code}\n`);
});
require('./src/server.js');
