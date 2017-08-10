const express = require('express');
const morgan = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const router = require('./router');

const app = express();
const port = process.env.PORT || 3090;

mongoose.connect("mongodb://localhost:auth/auth");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

router(app);

const server = http.createServer(app);
server.listen(port, () => {
  console.log("server listening on port 3090");
});
