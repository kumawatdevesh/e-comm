const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            throw new Error('no token');
        }
        const decodedToken = jwt.verify(token, 'key');
        req.userData = {userId: decodedToken.userId};
        next();
    } catch(err) {
        throw new Error('not verified');
    }
}

exports.auth = auth;