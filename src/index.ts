import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import createPrompt from "prompt-sync";
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});
const prompt = createPrompt({ sigint: true });
type ContentItem = {
  role: "user" | "model";
  parts: [{ text: string }];
};

const history: ContentItem[] = [];
async function main() {
  while (true) {
    const input = prompt("Enter your message: ");
    if (input.toLowerCase() === "exit") break;
    history.push({ role: "user", parts: [{ text: input }] });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction:
            "you are a ai assistant which help user to solve there problem",
        },
        // 2. CONVERSATION HISTORY (Using roles)
        contents: history,
      });
      console.log(response.text);
      history.push({
        role: "model",
        parts: [{ text: response.text as string }],
      });
    } catch (error) {
      console.log(error);
    }
  }
}

main();
