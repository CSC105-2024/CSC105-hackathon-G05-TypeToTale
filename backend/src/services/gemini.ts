import { GoogleGenAI } from "@google/genai";

async function geminiAI(prompt: string) {
  const API_KEY = process.env.GEMINI_API;
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  console.log(process.env);
  console.log(API_KEY);
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `can you create a story for this theme ${prompt} and make it 2 paragraph long. I want only the story I don't want any introduction or ending words, just the story itself.`,
  });
  console.log(response.text);
  return response.text;
}

async function geminiMakeInvalidStory(validStory: string) {
  const API_KEY = process.env.GEMINI_API;
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  console.log(process.env);
  console.log(API_KEY);
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `can you make some 4 spelling errors from this sentence to each paragraph then return it to me?( I want only the story I don't want any introduction or ending words, just the story itself.): "${validStory}"`,
  });
  console.log(response.text);
  return response.text;
}
export { geminiAI, geminiMakeInvalidStory };
