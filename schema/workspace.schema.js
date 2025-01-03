const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    label: { type: String, required: true },
    hasInput: { type: Boolean, required: true },
    description: { type: String },
    isRequired: { type: Boolean, default: false },
});

const workspaceSchema = new mongoose.Schema({
    workspaceName: { type: String, required: true },
    elements: [elementSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming you have a User model
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workspace', workspaceSchema);
