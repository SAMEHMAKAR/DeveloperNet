const express = require('express');
const multer = require('multer');
const auth = require('../../middleware/auth');


const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

uploadRouter.post('/', auth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

module.exports = uploadRouter;