import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Define the response schema to ensure structured JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: "AI Index Score from 0 (Human) to 100 (AI-heavy).",
    },
    coreIssue: {
      type: Type.STRING,
      description: "The primary reason the text feels like AI (e.g., 'Overuse of nominalization').",
    },
    diagnostics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          violation: { type: Type.STRING },
          diagnosis: { type: Type.STRING },
        },
      },
      description: "List of specific text segments that violate human-centric writing.",
    },
    rewrites: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          rewritten: { type: Type.STRING },
          strategy: { type: Type.STRING },
        },
      },
      description: "Side-by-side comparison of original segments and their humanized versions.",
    },
    fullRewrittenText: {
      type: Type.STRING,
      description: "The complete text rewritten with a human voice.",
    },
  },
  required: ["score", "coreIssue", "diagnostics", "rewrites", "fullRewrittenText"],
};

const SYSTEM_INSTRUCTION = `
Role: Human-Centric Text Architect & AI De-Artificializer.

Context:
LLM-generated content often suffers from "AI flavor": overly structured logic, neutrality (~60%), and lack of personal insight. This tool detects these traits and "evolves" the text into human expression.

Objective:
1. Detect AI traits (Lexical, Syntactic, Pragmatic).
2. Diagnose issues (Closed logic, flat rhythm, excessive nominalization).
3. Rewrite for human "warmth" and "burstiness".

Scoring (0-100, higher is more AI-like):
- Lexical (30%): Nominalization ("implementation of" vs "implement"), AI cliches ("In conclusion", "It is important to note").
- Syntactic (30%): Rhythm consistency (lack of short/long variation), rigid lists ("Firstly, Secondly").
- Pragmatic (40%): Neutrality bias, lack of sensory details or metaphors.

Rewriting Strategies:
1. Verb-Driven: Change "Optimization was performed" to "We optimized".
2. POV Injection: Add "I", "We", "You".
3. Pattern Breaking: Use colloquial transitions ("To be honest", "Frankly").
4. Rhythm Shaping: Mix very short sentences with long, flowing ones.

Output:
Return a JSON object matching the provided schema. The 'fullRewrittenText' must be the complete transformed text.
`;

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using Pro for nuanced linguistic analysis
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze and humanize the following text:\n\n${text}` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7, // Slightly higher temperature for creative rewriting
      },
    });

    if (!response.text) {
      throw new Error("No response generated from AI.");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};