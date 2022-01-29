const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.default.isEmail(value)) {
          throw new Error("Email is incorrect");
        }
      },
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be positive number");
        }
      },
      default: 0,
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      validate(value) {
        if (
          // !validator.default.isStrongPassword(value, {
          //   minLength: 7,
          // })
          value.toLowerCase() === "password"
        ) {
          throw new Error("Password not strong enough");
        }
      },
      trim: true,
    },
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateToken = async function () {
  const user = this;
  return jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
};

userSchema.methods.toJSON = function () {
  const user = this;
  var userObject = user.toObject();
  delete userObject.password;
  delete userObject.avatar;
  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No such user found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    return user;
  } else {
    throw new Error("Unable to login");
  }
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
