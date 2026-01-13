const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

/* GET */
exports.getStarters = async (req, res) => {
  const db = await connectDB();
  const starters = await db.collection("starters").find().toArray();
  res.json(starters);
};

/* ADD */
exports.addStarter = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  const db = await connectDB();
  const insert = await db.collection("starters").insertOne({
    text,
    createdAt: new Date(),
  });

  // 🔥 return newly created object
  res.json({
    _id: insert.insertedId,
    text,
  });
};

/* DELETE */
exports.deleteStarter = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const db = await connectDB();
  await db.collection("starters").deleteOne({
    _id: new ObjectId(id),
  });

  res.json({ success: true });
};
