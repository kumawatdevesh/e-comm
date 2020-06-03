const express = require('express');
const adminController = require('../controllers/admin');
const { check, body } = require('express-validator/check');

const router = express.Router();

router.get('/login', adminController.getLogin); 

router.post('/login',
    [
        check('email', 'please enter a valid email')
            .notEmpty()
            .isEmail()
            .trim(),
        check('password', 'please enter a valid password')
            .notEmpty()
            .trim()
    ],
adminController.postLogin);

router.get('/signup', adminController.getSignup);

router.post('/reset', adminController.postReset);

router.post('/reset/:token', adminController.resetPassword);

router.post('/signup', 
    [
        check('email', 'please enter a valid email')
            .notEmpty()
            .isEmail()
            .trim(),
        check('password', 'please enter a valid password')
            .notEmpty()
            .trim()
    ], 
adminController.postSignup);

module.exports = router;