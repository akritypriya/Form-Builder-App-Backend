const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
    label: String,
    hasInput: Boolean,
    isRequired: Boolean,
    description: String,
});

const workspaceSchema = new mongoose.Schema({
    formName: { type: String, required: true },
    elements: [elementSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Workspace", workspaceSchema);
