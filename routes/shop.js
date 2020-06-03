const express = require('express');
const shopController = require('../controllers/shop');
const checkAuth = require('../middleware/Auth');
const {check} = require('express-validator/check');

const router = express.Router();

router.get('/products', shopController.getAllProducts);

router.use(checkAuth.auth);

router.post('/add-product',
[
    check('title', 'plaease enter a valid title')
        .notEmpty()
        .trim(),
    check('price', 'price can not be empty')
        .notEmpty()
        .trim(),
    check('desc', 'desc can not be empty')
        .notEmpty()
        .trim(), 
    check('creator', 'error')
        .notEmpty()
        .trim()   
], 
shopController.addProductPost);

router.get('/products/:pid', shopController.getProductByUserId);

router.get('/prod-details/:pid', shopController.getProductById);

router.post('/addCart/:pid', shopController.postCart);

router.get('/cartItems/:id', shopController.getCartItems);

router.get('/invoice/:userId', shopController.getInvoice);

router.delete('/prod-details/:id', shopController.deleteProduct);

router.put('/prod-update/:id', shopController.updateProduct);

router.post('/create-cart/:id', shopController.postOrder);

router.post('/clear-cart-item/:pid', shopController.clearCartItem);

router.get('/orders/:userId', shopController.getOrders);

router.post('/orders/:id', shopController.clearOrders);

// module.exports = router;
exports.router = router;