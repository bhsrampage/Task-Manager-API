require("../src/db/mongoose");
const User = require("../src/models/user");

//6138b0e74c310dfc84295933

// User.findByIdAndUpdate("6138b0e74c310dfc84295933", { age: 1 })
//   .then(console.log)
//   .catch(console.log);

const findUserUpdateAge = async (id, age) => {
  try {
    let user = await User.findByIdAndUpdate(id, { age });
    let count = await User.countDocuments({ age });
    return count;
  } catch (e) {
    console.log(e);
  }
};

// findUserUpdateAge("618506a22facbbd25a89e0a5", 10)
//   .then((c) => console.log(c))
//   .catch(console.log);
