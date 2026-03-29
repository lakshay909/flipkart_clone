const express = require('express');
const app = express();
const server = app.listen(5006, () => console.log('Listening 5006'));

setTimeout(() => {
  console.log("Loading modules...");
  require('./src/config/db');
  require('./src/routes/productRoutes');
  require('./src/routes/cartRoutes');
  require('./src/routes/wishlistRoutes');
  console.log("Modules loaded. Did server unref?");
}, 1000);
