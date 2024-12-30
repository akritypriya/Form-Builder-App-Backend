const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authMiddleware = (req, res, next) => {
    // const token = req.headers.authorization;  // check for auth token
    // if (!token) {
    //     return res.status(401).json({ message: "This action is not allowed" });
    // }
    const authHeader = req.headers.authorization; // Check for Authorization header

  // Ensure token exists and is in Bearer format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "This action is not allowed" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
module.exports = authMiddleware;