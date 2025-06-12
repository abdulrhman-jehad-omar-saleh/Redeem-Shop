const express = require('express');
const router = express.Router();
const controller=require('../controllers/shop_controller');
router.get('/', controller.getIndex);
router.get('/shop/main', controller.getShop);
module.exports = router;