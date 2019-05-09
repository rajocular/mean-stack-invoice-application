const mongoose = require("mongoose");
require('dotenv').config();

const database = process.env.MONGO_DB_URL;

mongoose
  .connect(
    database,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
