const connectDB = require("../config/db");

async function trainBot(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const db = await connectDB();

    const docs = req.files.map((file) => ({
      filename: file.originalname,
      content: file.buffer.toString("utf-8"),
      uploadedAt: new Date(),
    }));

    await db.collection("training_files").insertMany(docs);

    res.json({
      message: "Files uploaded",
      files: docs,
    });
  } catch (err) {
    console.error("TRAIN ERROR:", err);
    res.status(500).json({ error: "Training failed" });
  }
}

module.exports = trainBot;
