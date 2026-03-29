const fetch = require('node:fetch'); // Node 18+ check
fetch('http://localhost:5001/api/health')
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
