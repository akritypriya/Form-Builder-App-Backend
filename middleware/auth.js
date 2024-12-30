// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();
// const authenticate = (req, res, next) => {
//     const authHeader = req.headers.authorization; // Check for Authorization header

//   // Ensure token exists and is in Bearer format
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "This action is not allowed" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };
// module.exports = authenticate;

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization; // Check for Authorization header

    // Ensure token exists and is in Bearer format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "This action is not allowed" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure 'id' exists in decoded token
        if (!decoded.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.user = decoded; // Attach decoded token payload to request
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        res.status(401).json({ message: "Invalid token", error: err.message });
    }
};

module.exports = authenticate;
