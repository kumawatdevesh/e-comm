const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const uuid = require('uuid/v1');
const path = require('path');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/images', express.static(path.join(__dirname, 'images')));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + '.' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);        
    } else {
        cb(null, false);
    }
};


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(cors());
app.options('*', cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
    next();
});

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes.router);

mongoose.connect(
    'mongodb+srv://kumawatdevesn99:kumawatdevesn99@cluster0-tpp9z.mongodb.net/e-comm?retryWrites=true&w=majority'
    , {useNewUrlParser: true}
)
.then(res => {
    app.listen(process.env.PORT || 5000);  
})
.catch(err => {
    console.log(err);
});

