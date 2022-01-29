require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("6138c5ecfa5f3fa72e47ef18")
//   .then(async (task) => {
//     console.log(task);
//     console.log(await Task.countDocuments({ completed: false }));
//   })
//   .catch(console.log);

const deleteTask = async (id) => {
  let res = await Task.findByIdAndDelete(id);
  let count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTask("618501e82337e747e65b6cd0").then(console.log).catch(console.log);
