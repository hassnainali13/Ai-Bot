const connectDB = require("../config/db");

async function listFiles(req, res) {
  try {
    const db = await connectDB();
    const files = await db
      .collection("training_files")
      .find({}, { projection: { content: 0 } })
      .toArray();

    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
}

module.exports = listFiles;
