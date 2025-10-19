const express = require('express');
const UsersController = require('../controllers/UsersController');
const AuthVerify = require('../middleware/AuthVerifyMiddleware');
const router = express.Router();

router.post('/registration', UsersController.registration);
router.post('/login', UsersController.login);
router.post('/profileUpdate', AuthVerify, UsersController.profileUpdate);

module.exports = router;
