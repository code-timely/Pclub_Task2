const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    console.log("auth middleware got hit");
    const literal = req.cookies.token;
    const token = (literal.split(" "))[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Verification failed, token is not valid' });
    }
};

module.exports = auth;
