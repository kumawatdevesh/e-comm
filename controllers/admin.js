const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {validationResult} = require('express-validator/check')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));


const getLogin = (req, res, next) => {
    res.json({msg: "sent data"});
};

const postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    const result = errors.array();

    if(!errors.isEmpty()) {
        res.json({err: result[0].msg});
    } else {
        User.findOne({email: email})
    .then(user => {
        if(!user) {
            res.json({err: 'no user'});
        }else {
            bcrypt.compare(password, user.password)
            .then(doMatch => { // return true or false
                if(doMatch) {
                    let token;
                    try {
                        token = jwt.sign({userId: user._id, email: user.email}, 
                            'key', {expiresIn: '1h'}
                        );
                    } catch {
                        res.json({err: 'token problem'});
                    }
                    res.json({user: user, token: token, userId: user._id});
                }else {
                    res.json({err: 'wrong password'});
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
    .catch(err => {
        console.log(err);
    });
    }
    
};

const getSignUp = (req, res,next) => {

};

const postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    const result = errors.array();

    if(!errors.isEmpty()) {
        res.json({err: result[0].msg});
    }

    bcrypt.hash(password, 12)
    .then(hashedPassowrd => {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassowrd
        });
        let token;
        try {
            token = jwt.sign({userId: user._id, email: email}, 'key', {expiresIn: '1h'});
        } catch {
            res.json({err: 'token problem'});
        }
        res.json({user: user, token: token, userId: user._id});
        return transporter.sendMail({
            to: email,
            from: 'kumawatdevesn99@gmail.com',
            subject: 'signup succede',
            html: '<h1>you have logged in</h1>'
        })
        .then(res => {
            return user.save();
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postReset = (req, res, next) => {

    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                throw new Error('user not found');
            }
            user.resetToken = token;
            user.resetExpiration = Date.now() + 360000;
            return user.save();
        })
        .then(user => {
            return transporter.sendMail({
                to: req.body.email,
                subject: 'signup succede',
                from: 'kumawatdevesn99@gmail.com',
                html: `http://localhost:3000/reset/${token}`
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
};

exports.resetPassword = (req, res, next) => {
    const pass = req.body.password;
    const token = req.params.token;
    let resetUser;
    User.findOne({resetToken: token, resetExpiration: { $gt: Date.now() }})
    .then(user => {
        resetUser = user;
        return bcrypt.hash(pass, 12);
    })
    .then(hashedPassowrd => {
        console.log(resetUser);
        resetUser.password = hashedPassowrd;
        resetUser.resetToken = undefined;
        resetUser.resetExpiration = undefined;
        return resetUser.save();
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getLogin = getLogin;
exports.getSignup = getSignUp;
exports.postLogin = postLogin;
exports.postSignup = postSignup;