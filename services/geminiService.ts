import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

// Schema for Agent 1: Structural Safety
const safetySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    detected_hazards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          location: { type: Type.STRING },
          severity: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
          description: { type: Type.STRING }
        },
        required: ["type", "location", "severity", "description"]
      }
    },
    risk_level: {
      type: Type.STRING,
      enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL]
    },
    spatial_analysis: {
      type: Type.STRING,
      description: "Deep technical reasoning about structural integrity, collapse mechanics, and spatial layout."
    }
  },
  required: ["detected_hazards", "risk_level", "spatial_analysis"]
};

// Schema for Agent 2: Logistics
const logisticsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recommended_actions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["IMMEDIATE", "SHORT_TERM", "LONG_TERM"] }
        },
        required: ["action", "priority"]
      }
    },
    resource_plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          resource: { type: Type.STRING },
          allocation: { type: Type.STRING }
        },
        required: ["resource", "allocation"]
      }
    }
  },
  required: ["recommended_actions", "resource_plan"]
};

export const analyzeImagery = async (
  base64Images: string[], 
  onStatusUpdate?: (status: string) => void
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = 'gemini-3-pro-preview';

  const imageParts = base64Images.map(data => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: data
    }
  }));

  // --- Step 1: Structural Safety Agent ---
  if (onStatusUpdate) onStatusUpdate("Agent 1 (Safety): Analyzing structural integrity...");

  const safetyPrompt = `
    You are the Structural Safety Agent (Agent 1).
    Your goal is to perform a deep technical analysis of the provided drone imagery.
    
    PERFORM DEEP REASONING to:
    1. Identify all structural hazards (e.g., spalling, shear failure, debris, pancake collapse).
    2. Assess the overall risk level.
    3. Provide a detailed spatial analysis of the collapse zones and integrity.
    
    Be extremely precise and technical.
  `;

  const safetyResponse = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [...imageParts, { text: safetyPrompt }],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: safetySchema,
      thinkingConfig: { thinkingBudget: 2048 }
    },
  });

  const safetyData = JSON.parse(safetyResponse.text || "{}");

  // --- Step 2: Logistics Agent ---
  if (onStatusUpdate) onStatusUpdate("Agent 2 (Logistics): Formulating response plan...");

  const logisticsPrompt = `
    You are the Logistics & Response Agent (Agent 2).
    
    The Structural Safety Agent has analyzed the site and provided the following report:
    ${JSON.stringify(safetyData, null, 2)}
    
    Based specifically on the hazards and spatial analysis above (build upon this reasoning):
    1. Propose a prioritized action plan.
    2. Allocate necessary resources (heavy machinery, personnel).
    
    Ensure your plan directly addresses the identified risks.
  `;

  const logisticsResponse = await ai.models.generateContent({
    model: modelId,
    contents: {
      // We pass images again so Agent 2 has visual context, but explicitly instruct it to use Agent 1's data
      parts: [...imageParts, { text: logisticsPrompt }], 
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: logisticsSchema,
      thinkingConfig: { thinkingBudget: 2048 }
    },
  });

  const logisticsData = JSON.parse(logisticsResponse.text || "{}");

  // Merge results
  if (onStatusUpdate) onStatusUpdate("Finalizing Report...");
  
  return {
    ...safetyData,
    ...logisticsData
  };
};
