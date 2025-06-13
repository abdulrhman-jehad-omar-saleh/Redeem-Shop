const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/users_controller');
router.get('/admin/manageUsers', controller.getManageUsers);
router.post('/admin/edituser', controller.postEditUser);
router.post('/admin/deleteuser', controller.postDeleteUser);
module.exports = router;