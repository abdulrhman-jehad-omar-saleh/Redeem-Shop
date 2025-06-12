const express = require('express');
const router = express.Router();
const controller=require('../controllers/auth_controller');
console.log("auth_router.js loaded");
router.get('/login', controller.getlogin);
router.get('/logout', controller.getlogout);
router.post('/login', controller.postLogin);
router.post('/signup', controller.postSignup);
module.exports = router;