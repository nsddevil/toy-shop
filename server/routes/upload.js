const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const { upload, resizeImage, deleteImage } = require('../middleware/upload');

router.post(
  '/image',
  auth,
  authAdmin,
  upload.array('image'),
  resizeImage,
  (req, res, next) => {
    res.json({ images: req.body.images });
  }
);

router.post('/image/delete', auth, authAdmin, deleteImage, (req, res, next) => {
  res.json({ msg: '파일을 삭제했습니다.' });
});

module.exports = router;
