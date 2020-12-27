const Category = require('../models/categoryModel');

const categoryCtrl = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.find().exec();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },
  createCategory: async (req, res, next) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name }).exec();
      if (category)
        return res.status(400).json({ msg: '이미 있는 카테고리입니다.' });
      const newCategory = new Category({ name });
      await newCategory.save();

      res.json({ msg: 'create category success' });
    } catch (error) {
      next(error);
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      await Category.findByIdAndDelete(req.params.id).exec();
      res.json({ msg: 'delete category success' });
    } catch (error) {
      next(error);
    }
  },
  updateCategory: async (req, res, next) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name }).exec();
      res.json({ msg: 'update category success' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryCtrl;
