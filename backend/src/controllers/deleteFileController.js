const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

async function deleteFile(req, res) {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const result = await db
      .collection("training_files")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
}

module.exports = deleteFile;
