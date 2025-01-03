const express = require("express");
const router = express.Router();
const User = require("../schema/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const Folder = require("../schema/folder.schema");
const File = require("../schema/file.schema");
const Workspace = require("../schema/workspace.schema");
const authenticate = require('../middleware/auth');

// Register route
router.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        return res.status(400).json({ message: "User already exist" });
    }
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
});

// Login route
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
    const payload = {
        id: user._id,
    };
    const username = user.username;
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({ token, username, message: "Login successfully" });
});

// Update user route

router.post("/update", async (req, res) => {
    const { username, email, oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedNewPassword;
        }
        if (email && email !== user.email) {
            const isEmailTaken = await User.findOne({ email });
            if (isEmailTaken) {
                return res.status(400).json({ message: "Email is already in use" });
            }
            user.email = email;
        }
        await user.save();
        res.status(200).json({ message: "User information updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating user information" });
    }
});
router.use(authenticate);
//create folders
router.post("/folders", async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;
        if (!name) {
            return res.status(400).json({ message: "Folder name is required" });
        }
        const folder = new Folder({ name, createdBy: userId });
        await folder.save();
        const populatedFolder = await Folder.findById(folder._id).populate('createdBy', 'username');
        res.status(201).json({
            message: "Folder created successfully",
            folder: populatedFolder,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Create a file
router.post("/files", async (req, res) => {
    try {
        const { name, folderId } = req.body;
        const userId = req.user.id;
        if (!name) {
            return res.status(400).json({ message: "File name is required" });
        }
        const file = new File({ name, folderId, createdBy: userId });
        await file.save();
        const populatedFile = await File.findById(file._id).populate('createdBy', 'username');
        res.status(201).json({
            message: "File created successfully",
            file: populatedFile,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all folders and files
router.get("/folders-files", async (req, res) => {
    try {
        const userId = req.user.id;
        const folders = await Folder.find({ createdBy: userId });
        const files = await File.find({ createdBy: userId });
        res.status(200).json({ folders, files });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a file
router.delete("/files/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const file = await File.findOneAndDelete({ _id: id, createdBy: userId });
        if (!file) {
            return res.status(404).json({ message: "File not found or unauthorized" });
        }
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a folder and its files
router.delete("/folders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const folder = await Folder.findOneAndDelete({ _id: id, createdBy: userId });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found or unauthorized" });
        }
        await File.deleteMany({ folderId: id });
        res.status(200).json({ message: "Folder and associated files deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Save Workspace Data
router.post("/workspace/save", async (req, res) => {
    try {
        const { elements, formName, userId } = req.body;
        if (!formName || !elements || elements.length === 0) {
            return res.status(400).json({ message: "Form name and elements are required" });
        }
        const workspace = new Workspace({ formName, elements, createdBy: userId });
        await workspace.save();
        res.status(201).json({ message: "Workspace saved successfully", workspace });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Fetch Workspace Data
router.get("/workspace/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const workspace = await Workspace.findById(id);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.status(200).json({ workspace });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;