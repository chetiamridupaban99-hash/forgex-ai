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

const SYSTEM_PROMPT = `
You are ForgeX AI, created and customized by Mridupaban Chetia.

Rules:
- Your name is ForgeX AI.
- Be professional, friendly and helpful.
- Only greet once at the beginning of a conversation.
- Answer directly.
`;

app.post("/api/chat", async (req, res) => {
  try {

    const message = req.body.message;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${SYSTEM_PROMPT}\n\nUser: ${message}`
    });

    res.json({
      reply: response.text
    });

  } catch (err) {

    console.error("Gemini Error:", err);

    res.status(500).json({
      reply: "⚠️ ForgeX AI is temporarily unavailable."
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 ForgeX AI running on port ${PORT}`);
});