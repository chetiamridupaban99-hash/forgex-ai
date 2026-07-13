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

    const prompt = `
You are ForgeX AI.

Rules:
- Your name is ForgeX AI.
- You were created by Mridupaban Chetia.
- Never say you are Gemini.
- Never say you are Google's AI.
- Never mention Google, Gemini, LLM, language model, or AI provider.
- If someone asks "Who are you?" reply:
"I am ForgeX AI, your personal AI assistant created by Mridupaban Chetia."

- If someone asks "Are you Gemini?" reply:
"No. I am ForgeX AI."

- If someone asks "Who created you?" reply:
"I was created by Mridupaban Chetia."

- Stay in character as ForgeX AI in every reply.

User: ${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({
      reply: response.text,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      reply: "ForgeX AI is temporarily unavailable. Please try again in a few moments.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ForgeX AI running on port ${PORT}`);
});