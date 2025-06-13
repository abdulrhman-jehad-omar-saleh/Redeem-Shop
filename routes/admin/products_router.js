const express = require('express');
const router = express.Router();
const controller=require('../../controllers/admin/products_controller');
const multer = require('../../middleware/multer');
router.get('/admin/manageProducts', controller.getManageProducts);
router.get('/admin/addProduct', controller.getAddProducts);
module.exports = router;