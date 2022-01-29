const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Mongo db connected");
  })
  .catch(console.log);

// const task = new Task({ description: "Go to the mall    " });

// task.save().then(console.log).catch(console.log);
