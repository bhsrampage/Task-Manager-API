const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const sharp = require("sharp");
const { sendWelcomeMail, sendLeavingMail } = require("../emails/account");

const router = new express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    sendWelcomeMail(user.email, user.name);
    let token = await user.generateToken();
    res.status(200).send({
      success: true,
      sendUser: user,
      token,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await User.findByCredentials(req.body.email, req.body.password);
    let token = await user.generateToken();
    res.status(200).send({
      success: true,
      sendUser: user,
      token,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send({ success: true });
  },
  (err, req, res, next) => {
    res.status(400).send({ success: false, error: err.message });
  }
);

router.delete("/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error("User Image not found");

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
});

router.get("/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});

router.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidUpdate = updates.every((i) => allowedUpdates.includes(i));

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Updates not allowed on fields" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update])); //done so that middleware pre runs to hash password
    await req.user.save();
    // let user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    res.status(200).send({ success: true, user: req.user });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendLeavingMail(req.user.email, req.user.name);
    res.status(200).send({
      success: true,
      deletedUser: req.user,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error,
    });
  }
});

module.exports = router;
