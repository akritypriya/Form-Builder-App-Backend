const express = require("express");
const router = express.Router();
const User = require("../schema/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


  
//register route
router.post("/register", async (req, res) => {
    const { username, email, password ,confirmPassword} = req.body;
    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    // Check if the user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        return res.status(400).json({ message: "User already exist" });
    }
    //password encrypting hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            
        });
        res.status(200).json({ message: "User created" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in creating user" });
    }
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Wrong username or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Wrong username or password" });
    }
    // Create JWT token
    const payload = {
        id: user._id,
        
    };
    const username=user.username;
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({ token,username,message:"login successfully"});

})


router.post("/update", async (req, res) => {
    const { username, email, oldPassword, newPassword } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Verify old password
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Hash new password if provided
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedNewPassword;
        }

        // Update email if it's different from the current one
        if (email && email !== user.email) {
            const isEmailTaken = await User.findOne({ email });
            if (isEmailTaken) {
                return res.status(400).json({ message: "Email is already in use" });
            }
            user.email = email;
        }

        // Save the updated user
        await user.save();

        res.status(200).json({ message: "User information updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating user information" });
    }
});




module.exports = router;