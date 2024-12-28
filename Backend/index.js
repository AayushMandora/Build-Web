import express from "express";

import bodyParser from "body-parser";

import { configDotenv } from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { getSystemPrompt } from "./prompts.js";

import { stripIndents } from "./stripIndents.js";

import { BASE_PROMPT } from "./prompts.js";

import { basePrompt as nodePrompt } from "./prompt/node.js";
import { basePrompt as reactPrompt } from "./prompt/react.js";

configDotenv();

const app = express();
app.use(bodyParser.json());

// Made AI model
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const templateModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
});
const result = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: getSystemPrompt(),
});

// Template API
app.post("/template", async (req, res) => {
  const { prompt } = req.body;

  const response = await templateModel.generateContent(prompt);

  const answer = stripIndents(response.response.text());
  if (answer === "react") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactPrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactPrompt],
    });
    return 0;
  }

  if (answer === "node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodePrompt],
    });
    return;
  }

  res.status(403).json({ message: "You cant access this", answer });
  return;
});

// Chat API
app.post("/chat", async (req, res) => {
  const messages = req.body.messages;
  const response = await result.generateContent({
    contents: messages,
    generationConfig: {
      maxOutputTokens: 2000,
      temperature: 0.1,
    },
  });

  console.log(response.response.text());

  res.json({
    result: response.response.text(),
  });
});

app.listen(3000);
