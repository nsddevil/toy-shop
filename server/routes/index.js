const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter');
const categoryRouter = require('./categoryRouter');
const uploadRouter = require('./upload');
const productRouter = require('./productRouter');

router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/upload', uploadRouter);
router.use('/products', productRouter);

module.exports = router;
