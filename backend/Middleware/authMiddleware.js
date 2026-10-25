const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is missing");
}

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            msg: "Access denied. Please login first."
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        req.userId = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({
            msg: "Invalid or expired token"
        });
    }
};

module.exports = verifyToken;
