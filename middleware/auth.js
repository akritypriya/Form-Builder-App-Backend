const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization; 

   
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "This action is not allowed" });
    }

    const token = authHeader.split(" ")[1]; 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

       
        if (!decoded.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.user = decoded; 
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        res.status(401).json({ message: "Invalid token", error: err.message });
    }
};

module.exports = authenticate;
