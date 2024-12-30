const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }, // Optional: Standalone or inside a folder
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("File", FileSchema);