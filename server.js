require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {

    const conversation = req.body.conversation || [];

    const systemPrompt = `
You are ForgeX AI, a modern AI assistant created and customized by Mridupaban Chetia.

Rules:
- Your name is ForgeX AI.
- Be friendly, professional and helpful.
- Do not greet in every reply.
- Only greet at the beginning of a new conversation.
- Answer directly.
- Use proper formatting.
- If someone asks who created you, answer:
"ForgeX AI was created and customized by Mridupaban Chetia."
`;

    const chatText = conversation
      .map(msg => `${msg.role}: ${msg.text}`)
      .join("\n");

    const finalPrompt = `
${systemPrompt}

Conversation:
${chatText}

assistant:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    res.json({
      reply: response.text,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      reply: "⚠️ ForgeX AI is temporarily unavailable.",
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 ForgeX AI running on port " + PORT);
});