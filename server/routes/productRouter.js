const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productCtrl');

router.route('/').get(productCtrl.getProducts).post(productCtrl.createProduct);

router
  .route('/:id')
  .delete(productCtrl.deleteProduct)
  .put(productCtrl.updateProduct);

module.exports = router;
