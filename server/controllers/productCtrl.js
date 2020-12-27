const Product = require('../models/productModel');
const path = require('path');
const { deleteFile } = require('../util');
const productCtrl = {
  getProducts: async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const { title, price } = req.query;
    const priceQuery = price
      ? JSON.stringify(price).replace(
          /\b(gte|gt|lt|lte)\b/g,
          (match) => '$' + match
        )
      : null;
    const query = {
      ...(title ? { title: new RegExp(title, 'i') } : {}),
      ...(price ? { price: JSON.parse(priceQuery) } : {}),
    };

    console.log(query);

    try {
      const products = await Product.aggregate([
        { $match: query },
        { $sort: { _id: -1 } },
        { $limit: skip + limit },
        { $skip: skip },
      ]);

      res.json({
        products,
        productCount: products.length,
      });
    } catch (error) {
      next(error);
    }
  },
  createProduct: async (req, res, next) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;
      if (!images) return res.status(400).json({ msg: 'No image upload' });
      const product = await Product.findOne({ product_id }).exec();
      if (product)
        return res.status(400).json({ msg: '이미 있는 상품입니다.' });

      const newProduct = new Product({
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      });

      await newProduct.save();
      res.json({ msg: 'create product success' });
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const product = await Product.findOne({ _id: req.params.id }).exec();
      if (!product)
        return res.status(400).json({ msg: '상품정보가 없습니다.' });
      const files = product.images.map(
        (file) => `${path.join(__dirname, '..', 'uploads', file.filename)}`
      );
      await deleteFile(files);
      await product.delete();
      res.json({ msg: 'Deleted a Product' });
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images) return res.status(400).json({ msg: 'No image upload' });
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          product_id,
          title,
          price,
          description,
          content,
          images,
          category,
        }
      ).exec();

      res.json({ msg: 'update product' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productCtrl;
