const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Store user ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", FolderSchema);