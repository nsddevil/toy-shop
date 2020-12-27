const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { deleteFile } = require('../util');

if (!fs.existsSync(path.join(__dirname, '..', 'uploads'))) {
  fs.mkdir(path.join(__dirname, '..', 'uploads'), (err) => {
    if (err) console.log('uploads 폴더 생성 실패', err);
    console.log('uploads 폴더생성');
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only images'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const resizeImage = async (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({
      msg: '선택된 파일이 없습니다.',
    });
  }
  try {
    req.body.images = [];
    await Promise.all(
      req.files.map(async (file) => {
        const newFilename = Date.now() + file.originalname;
        await sharp(file.buffer)
          .resize({
            width: 600,
            fit: 'cover',
          })
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`${path.join(__dirname, '..', 'uploads')}/${newFilename}`);

        req.body.images.push({
          filename: newFilename,
          url: `image/${newFilename}`,
        });
      })
    );
    next();
  } catch (error) {
    return next(error);
  }
};

const deleteImage = async (req, res, next) => {
  const { filenames } = req.body;
  if (!filenames)
    return res.status(400).json({
      msg: '선택된 파일이 없습니다.',
    });
  try {
    const files = filenames.map(
      (file) => `${path.join(__dirname, '..', 'uploads', file)}`
    );
    await deleteFile(files);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  resizeImage,
  deleteImage,
};
