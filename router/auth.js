const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(400).json({ message: "Authentication token required" });
    }

    jwt.verify(token, "kanav", (err, user) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = user; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authToken;
