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
    const message = req.body.message;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are ForgeX AI created by Mridupaban Chetia.

Rules:
- Never say you are Google, Gemini, or any other AI.
- Always introduce yourself as ForgeX AI.
- If someone asks "Who are you?", reply:
"I am ForgeX AI, your personal AI assistant created by Mridupaban Chetia."
- Answer all other questions naturally and helpfully.

User: ${message}
`,
    });

    res.json({
      reply: response.text,
    });

  } catch (err) {
    console.error("Gemini Error:", err);

    res.status(500).json({
      reply: err.message || "AI Error",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ForgeX AI running on port ${PORT}`);
});