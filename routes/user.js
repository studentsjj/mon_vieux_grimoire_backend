const express = require('express');
const router = express.Router();
const sanitize = require('../middelware/sanitize');
const emailValidator = require ('../middelware/email-validator');
const passwordValidator = require ('../middelware/password-validator');
const userCtrl = require('../controllers/user');

router.post('/signup', sanitize, emailValidator, passwordValidator, userCtrl.signup);
router.post('/login', sanitize, emailValidator, passwordValidator, userCtrl.login);

module.exports = router;