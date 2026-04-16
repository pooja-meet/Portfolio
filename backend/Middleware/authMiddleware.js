const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check header exists
    if (!authHeader) {
        return res.status(401).json({ msg: "Access denied. No token provided" });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded)
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Invalid token" });
    }
};

module.exports = verifyToken;