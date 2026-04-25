import { GoogleGenAI, Type } from "@google/genai";
import { TaskPriority, EisenhowerQuadrant } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractTasks(input: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract tasks from this message: "${input}". 
    For each task, provide:
    - title: short clear name
    - description: optional details
    - time: if mentioned (format "HH:MM")
    - priority: LOW, MEDIUM, HIGH, or CRITICAL
    - quadrant: URGENT_IMPORTANT, NOT_URGENT_IMPORTANT, URGENT_NOT_IMPORTANT, or NOT_URGENT_NOT_IMPORTANT`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            time: { type: Type.STRING },
            priority: { 
              type: Type.STRING, 
              enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] 
            },
            quadrant: {
              type: Type.STRING,
              enum: [
                "URGENT_IMPORTANT", 
                "NOT_URGENT_IMPORTANT", 
                "URGENT_NOT_IMPORTANT", 
                "NOT_URGENT_NOT_IMPORTANT"
              ]
            }
          },
          required: ["title", "priority", "quadrant"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}

export async function generateBriefing(tasks: any[]) {
  const taskSummary = tasks.map(t => `${t.title} (${t.priority})`).join(", ");
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on these tasks: [${taskSummary}], generate a daily briefing in French.
    Follow this structure exactly:
    - morningBriefing: A short encouraging summary for the start of the day.
    - eveningReview: A short summary of what should be achieved.
    - efficiencyTip: A practical productivity tip.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          morningBriefing: { type: Type.STRING },
          eveningReview: { type: Type.STRING },
          efficiencyTip: { type: Type.STRING }
        },
        required: ["morningBriefing", "eveningReview", "efficiencyTip"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse briefing response", e);
    return null;
  }
}
