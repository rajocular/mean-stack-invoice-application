const mongoose = require("mongoose");

const database = "<your_database_uri>";

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
