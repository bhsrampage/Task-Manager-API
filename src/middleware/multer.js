const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024, //2MB
  },
  fileFilter(req, file, cb) {
    if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(undefined, true);
    }
    cb(new Error("Please upload an image"));
  },
});

module.exports = upload;
