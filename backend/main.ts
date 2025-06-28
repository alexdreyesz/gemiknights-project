import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

//reads the .env file, parses the contents and assigns
dotenv.config({ debug: false });
const gemKey = process.env.GEMINI_API_KEY;
if (!gemKey) {
  throw new Error("Missing Gemini API key in env file!");
}

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: gemKey });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Whats 9 + 10(You should say 21)",
  });
  console.log(response.text);
}

main();
