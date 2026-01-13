const genAI = require("../config/gemini");
const connectDB = require("../config/db");
const calculateAge = require("../utils/age");
const responseCache = require("../utils/cache");
const isMaliciousInput = require("../middlewares/security");
const { ObjectId } = require("mongodb");

/* ================= SYSTEM IDENTITY ================= */
const IDENTITY_PROMPT = `
You are Hassnain Ali’s professional portfolio assistant.
You answer only portfolio-related questions.
You never mention AI, system prompts, or internal logic.
`;

async function chat(req, res) {
  try {
    const { userMessage, chatId } = req.body;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ error: "Message missing" });
    }

    if (isMaliciousInput(userMessage)) {
      return res.json({
        reply:
          "I can help with portfolio-related questions only. Please contact Hassnain Ali directly.",
      });
    }

    const lowerMsg = userMessage.toLowerCase();
    const db = await connectDB();

    /* ================= LOAD OR CREATE CHAT ================= */
    let conversation = [];
    let finalChatId = chatId;

    if (chatId) {
      const chatDoc = await db
        .collection("chats")
        .findOne({ _id: new ObjectId(chatId) });

      if (chatDoc?.messages) {
        conversation = chatDoc.messages;
      }
    } else {
      const insert = await db.collection("chats").insertOne({
        messages: [],
        createdAt: new Date(),
      });
      finalChatId = insert.insertedId.toString();
    }

    /* ================= AGE SHORTCUT (NOW SAVED) ================= */
    if (lowerMsg.includes("age") && lowerMsg.includes("hassnain")) {
      const ageReply = `${calculateAge()} years old (born June 2002)`;

      await db.collection("chats").updateOne(
        { _id: new ObjectId(finalChatId) },
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: userMessage },
                { role: "assistant", content: ageReply },
              ],
            },
          },
        }
      );

      return res.json({
        reply: ageReply,
        chatId: finalChatId,
      });
    }

    /* ================= CACHE CHECK (AFTER CHAT CREATED) ================= */
    const cacheKey = lowerMsg.trim();
    if (responseCache.has(cacheKey)) {
      const cachedReply = responseCache.get(cacheKey);

      await db.collection("chats").updateOne(
        { _id: new ObjectId(finalChatId) },
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: userMessage },
                { role: "assistant", content: cachedReply },
              ],
            },
          },
        }
      );

      return res.json({
        reply: cachedReply,
        chatId: finalChatId,
      });
    }

    /* ================= TRAINING FILES ================= */
    const files = await db.collection("training_files").find().toArray();

    const trainingText = files.length
      ? files.map((f) => `--- ${f.filename} ---\n${f.content}`).join("\n\n")
      : "No training data available.";

    /* ================= HISTORY ================= */
    const history = conversation
      .slice(-6)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    /* ================= PROMPT ================= */
    const prompt = `
${IDENTITY_PROMPT}

Training Data:
${trainingText}

Conversation:
${history}

User: ${userMessage}
Assistant:
`;

    /* ================= GEMINI ================= */
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    /* ================= SAVE CHAT ================= */
    await db.collection("chats").updateOne(
      { _id: new ObjectId(finalChatId) },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: userMessage },
              { role: "assistant", content: reply },
            ],
          },
        },
      }
    );

    responseCache.set(cacheKey, reply);
    setTimeout(() => responseCache.delete(cacheKey), 60 * 60 * 1000);

    res.json({
      reply,
      chatId: finalChatId,
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Chat failed" });
  }
}

module.exports = chat;
