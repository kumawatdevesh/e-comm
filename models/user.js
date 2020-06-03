const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetExpiration: String,
    products: [{type: mongoose.Types.ObjectId, required: true, ref: 'Shop'}],
    cart: {
        items: [
            {
                productId: {type: mongoose.Types.ObjectId, ref: 'Shop', required: true},
                quantity: {type: Number, required: true},
            }
        ]
    },
});


user.methods.addToCart = function(product) {
    const itemIndex = this.cart.items.findIndex(prod => {
        console.log('inside', prod);
        return prod.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if(itemIndex >= 0) {
        newQuantity = this.cart.items[itemIndex].quantity + 1;
        updatedCartItems[itemIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product,
            quantity: newQuantity
        });
    }

    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart;
    return this.save();
}

user.methods.clearCartItem = function(product) {
    const itemIndex = this.cart.items.findIndex(prod => {
        return prod._id.toString() === product.toString();
    });
    
    const cartItems = [...this.cart.items];
    cartItems.splice(itemIndex, 1);

    const updatedCart = {
        items: cartItems
    };
    this.cart = updatedCart;
    return this.save();
}

user.methods.removeCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', user);
