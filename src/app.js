const express = require("express");
const app = express();
//require('./apiDoc');
//Routes
app.use( require('./routes/google.routes'));

module.exports = app;