const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user._id });

    res.status(201).send({
      success: true,
      sendTask: task,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

//GET tasks?completed=true
//GET tasks?limit=5&page=1
//GET tasks?sortBy=createdAt:asc

router.get("/", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) match.completed = req.query.completed === "true";
  if (req.query.sortBy) {
    let arr = req.query.sortBy.split(":");
    sort[arr[0]] = arr[1] == "asc" ? 1 : -1;
  }
  try {
    //const tasks = await Task.find({ owner: req.user._id })
    // .populate("owner")
    // .exec();
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
        sort,
      },
    });
    res.status(200).send(req.user.tasks);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    let { id } = req.params;
    let task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) res.status(404).send();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];

  const isValidUpdate = updates.every((i) => allowedUpdates.includes(i));

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Updates not allowed on fields" });
  }
  try {
    let { id } = req.params;
    let task = await Task.findOne({ _id: id, owner: req.user._id });

    // let task = await Task.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      res.status(404).send();
    }
    updates.forEach((i) => (task[i] = req.body[i]));
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    let task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.status(200).send({
      success: true,
      deletedTask: task,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

module.exports = router;
