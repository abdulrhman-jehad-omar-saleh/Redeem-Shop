const express = require('express');
const router = express.Router();
const controller=require('../controllers/admin_controller');
const multer = require('../middleware/multer');
router.get('/admin/manageProducts', controller.getManageProducts);
router.get('/admin/addEditProduct', controller.getAddEditProducts);
router.get('/admin/manageUsers', controller.getManageUsers);
module.exports = router;