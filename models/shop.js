const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shop = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Shop', shop);

