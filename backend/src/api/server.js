require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

const chat = require("../controllers/chatController");
const trainBot = require("../controllers/trainController");
const listFiles = require("../controllers/listFilesController");
const deleteFile = require("../controllers/deleteFileController");
const rateLimit = require("../middlewares/rateLimit");
const timeout = require("../middlewares/timeout");
const {
  getStarters,
  addStarter,
  deleteStarter,
} = require("../controllers/starterController");

const app = express();

/* ================= MULTER ================= */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname !== "files") {
      return cb(new Error("Invalid field name"), false);
    }
    if (!file.originalname.toLowerCase().endsWith(".txt")) {
      return cb(new Error("Only .txt files allowed"), false);
    }
    cb(null, true);
  },
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(timeout);

/* ================= HEALTH ================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ================= STARTERS ================= */
app.get("/api/starters", getStarters);
app.post("/api/starters", addStarter);
app.delete("/api/starters/:id", deleteStarter);

/* ================= TRAIN ================= */
app.post("/api/train-txt", upload.array("files", 10), trainBot);

/* ================= TRAINING FILES ================= */
app.get("/api/training-files", listFiles);
app.delete("/api/training-files/:id", deleteFile);

/* ======================================================
   ✅ MULTI CHAT SIDEBAR SUPPORT
   ====================================================== */

/* ================= LIST CHATS (SIDEBAR) ================= */
app.get("/api/chats", async (req, res) => {
  const db = await connectDB();

  const chats = await db
    .collection("chats")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const formatted = chats.map((c) => ({
    _id: c._id,
    title: c.messages?.[0]?.content?.slice(0, 40) || "New Chat",
    createdAt: c.createdAt,
  }));

  res.json(formatted);
});

/* ================= SINGLE CHAT ================= */
app.get("/api/chats/:id", async (req, res) => {
  const db = await connectDB();
  const chat = await db
    .collection("chats")
    .findOne({ _id: new ObjectId(req.params.id) });

  res.json(chat || {});
});

/* ================= DELETE CHAT (CLEAR CHAT) ================= */
app.delete("/api/chats/:id", async (req, res) => {
  const db = await connectDB();

  await db.collection("chats").deleteOne({ _id: new ObjectId(req.params.id) });

  res.json({ success: true });
});

/* ================= CHAT ================= */
app.post("/api/chat", rateLimit, chat);

/* ================= BLOCK GET ================= */
app.get("/api/chat", (req, res) => {
  res.status(405).json({ error: "Use POST method" });
});

module.exports = app;
