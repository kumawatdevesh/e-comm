const Shop = require('../models/shop');
const User = require('../models/user');
const Order = require('../models/order');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');
const path = require('path');
const { validationResult } = require('express-validator/check');

exports.getAllProducts = async (req, res, next) => {
    const products = await Shop.find();
    res.json({ prod: products });
};

exports.getProductById = async (req, res, next) => {
    const prodId = req.params.pid;

    let product;
    product = await Shop.findById(prodId);
    if (!product) {
        throw new Error('cannot get product by id');
    } else {
        res.json({ prod: product });
    }
};

exports.getProductByUserId = async (req, res, next) => {
    const id = req.params.pid;

    try {
        Shop.find({ creator: id })
            .populate('creator', 'email')
            .exec()
            .then(result => {
                res.json({ prod: result });
            })
            .catch(err => {
                console.log(err);
            });
    } catch {
        throw new Error('error while getting product by user id');
    }
};

exports.updateProduct = async (req, res, next) => {
    const id = req.params.id;
    const { title, url, price, desc } = req.body;
    let prod = await Shop.findById(id);
    if (!prod) {
        throw new Error('product not find while updating');
    }
    try {
        prod.title = title;
        prod.url = url;
        prod.price = price;
        prod.desc = desc;
        prod.save();
    } catch{
        throw new Error('prod not updated');
    }
    res.json({ msg: 'product updated' });
};

exports.addProductPost = async (req, response, next) => {
    const title = req.body.title;
    const imageUrl = req.file;
    const price = req.body.price;
    const desc = req.body.desc;
    const creator = req.body.creator;
    const url = imageUrl.path;

    const errors = validationResult(req);
    const result = errors.array();
    
    if(!errors.isEmpty()) {
        console.log(result);
        return response.json({err: result[0].msg});
    }
    const shop = new Shop({
        title: title,
        url: url,
        price: price,
        desc: desc,
        creator: creator
    });
    let user;
    user = await User.findById(creator);
    if (!user) {
        throw new Error('user not recieved');
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await shop.save({ session: sess });
        user.products.push(shop);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch {
        throw new Error('error while creating product');
    }
    return response.json({ product: shop });
};

exports.deleteProduct = async (req, res, next) => {
    const id = req.params.id;

    const prod = await Shop.findById(id).populate('creator')
    if (!prod) {
        throw new Error('product not found to delete');
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await prod.remove({ session: sess });
        prod.creator.products.pull(prod);
        await prod.creator.save({ session: sess });
        await sess.commitTransaction();

    } catch {
        throw new Error('error while deleting product');
    }

    res.json({ msg: 'prod deleted' });
}

exports.postCart = async (req, res, next) => {
    const id = req.params.pid;

    let shop = await Shop.findById(id);
    if (!shop) {
        throw new Error('no shop found');
    }
    try {
        shop
            .populate('creator')
            .execPopulate()
            .then(product => {
                return product.creator.addToCart(product);
            })
            .catch(err => {
                console.log(err);
            });
    } catch (err) {
        throw new Error(err);
    }
};

exports.getCartItems = async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
        throw new Error('first error while fetching cart');
    }
    try {
        user
            .populate('cart.items.productId')
            .execPopulate()
            .then(result => {
                res.json({ result: result.cart.items });
            })
            .catch(err => {
                console.log(err);
            });
    } catch {
        throw new Error('second error while fetching cart');
    }
};

exports.postOrder = async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    user
    .populate('cart.items.productId')
    .execPopulate()
    .then(result => {
        const products = result.cart.items.map(i => {
            return { product: { ...i.productId._doc }, quantity: i.quantity };
        });
        const order = new Order({
            products: products,
            user: {
                name: result.name,
                userId: user
            }
        });
        return order.save();
    })
    .then(res => {
        console.log(res);
        return res.user.userId.removeCart();
    })
    .catch(err => {
        console.log(err);
    });
};

exports.clearCartItem = async (req, res, next) => {
    const pid = req.params.pid;

    const shop = await Shop.findById(pid);
    if(!shop) {
        throw new Error('no shop find while removing cart')
    }
    shop
    .populate('creator')
    .execPopulate()
    .then(res => {
        return res.creator.clearCartItem(res._id);
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
    const id = req.params.userId;

    Order.find({ 'user.userId': id })
    .select('products')
    .then(result => {
        res.json({ result: result });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getInvoice = (req, res, next) => {
    const id = req.params.userId;

    Order.find({'user.userId': id})
    .select('products')
    .then(result => {
        console.log(result);
        
        const invoiceName = 'invoice-' + id + '.pdf';
        const invoicePath = path.join('data', invoiceName);
        
    })
    .catch(err => {
        console.log('err', err);
    });
};

exports.clearOrders = (req, res, next) => {
    const id = req.params.id;

    Order.deleteMany({'user.userId': id}, function(err) {
        console.log(err);
    });
};