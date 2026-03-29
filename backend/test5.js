const express = require('express');
const app = express();
app.listen(5005, () => console.log('Listening on 5005. Server will stay alive if event loop allows.'));
console.log('Script reached end');
