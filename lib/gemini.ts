import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Helper to pad Gemini's 768 vectors to Pinecone's 1536 dimensions
function padVector(vector: number[], targetDim: number = 1536) {
  if (vector.length >= targetDim) return vector.slice(0, targetDim);
  const padded = new Array(targetDim).fill(0);
  for (let i = 0; i < vector.length; i++) {
    padded[i] = vector[i];
  }
  return padded;
}

// Create embeddings using Gemini
export async function createEmbedding(text: string) {
  const result = await client.models.embedContent({
    model: "text-embedding-004",
    contents: [{ parts: [{ text }] }],
  });

  const rawVector = result.embeddings![0].values!;
  return padVector(rawVector);
}

// Create many embeddings
export async function createManyEmbeddings(texts: string[]) {
  const result = await client.models.embedContent({
    model: "text-embedding-004",
    contents: texts.map((text) => ({ parts: [{ text }] })),
  });

  return result.embeddings!.map((e) => padVector(e.values!));
}

// Chat with Gemini
export async function chatWithAI(systemPrompt: string, userQuestion: string) {
  const result = await client.models.generateContent({
    model: "gemini-flash-latest",
    contents: [{ role: "user", parts: [{ text: userQuestion }] }],
    config: {
      systemInstruction: systemPrompt,
    },
  });
  return result.text!;
}
