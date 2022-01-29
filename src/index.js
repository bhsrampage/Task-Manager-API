const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();
const PORT = process.env.PORT;

const multer = require("multer");
// const upload = multer({
//   dest: "images",
// });

// app.post("/upload", upload.single("file"), (req, res) => {
//   res.send();
// });
//express middleware
// app.use((req, res, next) => {
//   res.status(503).send("APIs are under maintenance plz try again later");
// });
app.use(express.json()); //to parse the incoming json
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.get("/", (req, res) => res.send("<h1>Task Manager API is running</h1>"));
app.listen(PORT, () => {
  console.log(`Server active on port ${PORT}`);
});

// const jwt = require("jsonwebtoken");

// const myfunction = async () => {
//   const token = jwt.sign({ _id: "sjihdisd" }, "ijiowsjdsjds", {
//     expiresIn: "7 days",
//   });
//   console.log(token);
//   const data = jwt.verify(token, "ijiowsjdsjds");
//   console.log(data);
// };

// myfunction();
