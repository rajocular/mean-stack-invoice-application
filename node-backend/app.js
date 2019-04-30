const express = require('express');
const bodyParser = require("body-parser");
require('./db/mongodb');
const areaRouter = require('./routers/area');
const billRouter = require('./routers/bill');
const clientRouter = require('./routers/client');
const invoiceRouter = require('./routers/invoice');
const productRouter = require('./routers/product');
const userRouter = require('./routers/user');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(userRouter);
app.use(areaRouter);
app.use(billRouter);
app.use(clientRouter);
app.use(invoiceRouter);
app.use(productRouter);

module.exports = app;

