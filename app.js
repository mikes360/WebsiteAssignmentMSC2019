const express = require("express");
const routes = require('./routes');
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

const app = express();

const controller = require('./controller');
controller.connect(app);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser("SECRET_KEY"))
app.use('/', routes(app))
app.use(express.static("./public"));

app.listen(3000);

console.log("Express on 3000");

module.exports = app;
