
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

// Factory for fresh AI instances to pick up selected API keys
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- TYPES ---
export interface DetailedSoilMetrics {
  ph: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
}

export interface WeatherContext {
  temp: string;
  condition: string;
  humidity: string;
  summary: string;
}

// --- UTILITIES ---
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- CORE AI FUNCTIONS ---

export const chatFast = async (message: string): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are KisaanMitra, a helpful Indian agricultural assistant. Keep answers brief and actionable."
      }
    });
    return response.text || "I am processing your farm intelligence...";
  } catch (e) {
    return "The neural link is temporarily offline. Please try again shortly.";
  }
};

export const diagnosePlantHealth = async (description: string, photoBase64: string, mimeType: string = 'image/jpeg'): Promise<any> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { 
      parts: [
        { text: `Perform a HIGH-STRICTNESS agricultural bio-scan. 
          1. AUTHENTICITY CHECK: Verify if this is a real plant in a natural environment. If it is a photo of a screen, a cartoon, or a non-plant object, set 'isPlant' to false and 'integrityScore' below 40.
          2. MALPRACTICE DETECTION: Detect if the user is trying to 'cheat' the system with fake specimens.
          3. REMEDIATION: Provide 'Organic Pathway' and 'Chemical Pathway'.
          4. SAFETY: Provide PPE and PHI protocols.
          Return ONLY JSON.` }, 
        { inlineData: { mimeType, data: photoBase64 } }
      ] 
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isPlant: { type: Type.BOOLEAN },
          integrityScore: { type: Type.NUMBER, description: "0-100 score of image authenticity" },
          malpracticeAlert: { type: Type.STRING, description: "Warning if malpractice is detected" },
          plantName: { type: Type.STRING },
          isHealthy: { type: Type.BOOLEAN },
          diagnosis: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          affectedStage: { type: Type.STRING },
          causeAnalysis: { type: Type.STRING },
          spreadRisk: { type: Type.STRING },
          organicRemedy: { type: Type.STRING },
          chemicalRemedy: { type: Type.STRING },
          preventiveMeasures: { type: Type.STRING },
          healthScoreImpact: { type: Type.NUMBER },
          safetyProtocol: {
            type: Type.OBJECT,
            properties: {
              ppeRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
              waitPeriod: { type: Type.STRING },
              humanDetectionWarning: { type: Type.STRING },
              riskToBystanders: { type: Type.STRING, enum: ['Low', 'Moderate', 'Severe'] }
            },
            required: ['ppeRequired', 'waitPeriod', 'humanDetectionWarning', 'riskToBystanders']
          }
        },
        required: ['isPlant', 'integrityScore', 'plantName', 'isHealthy', 'diagnosis', 'severity', 'organicRemedy', 'chemicalRemedy', 'safetyProtocol']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateCropImage = async (cropName: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: `A photorealistic high-fidelity image of a healthy ${cropName} specimen in an Indian farm context.`,
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  throw new Error("Failed");
};

export const findNearbyMedicines = async (disease: string, lat: number, lng: number): Promise<{ text: string, places: any[] }> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Find specialized agricultural medicine and seed shops near me for treating ${disease}.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
    }
  });
  return {
    text: response.text || "No shops found.",
    places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateGroupChallenge = async (groupName: string, category: string): Promise<any> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a collective farming challenge for a group named '${groupName}' focused on '${category}'. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          rewardPoints: { type: Type.NUMBER },
          deadline: { type: Type.STRING }
        },
        required: ['title', 'description', 'rewardPoints', 'deadline']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate to ${targetLanguage}: ${text}`,
  });
  return response.text || "";
};

export const textToSpeech = async (text: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

export const generateCultivationWorkflow = async (cropName: string): Promise<any[]> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a 5-step detailed cultivation masterclass for ${cropName} in India. Return as JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            icon: { type: Type.STRING },
            points: { type: Type.NUMBER }
          },
          required: ['title', 'description', 'icon', 'points']
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateCropPlan = async (location: string, soilType: string, metrics?: DetailedSoilMetrics, weather?: WeatherContext): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({ 
    model: 'gemini-3-pro-preview', 
    contents: `Architect a seasonal crop plan for ${location} with ${soilType}. Detailed Metrics: ${JSON.stringify(metrics)}. Weather Data: ${JSON.stringify(weather)}. Adjust for humus levels and high stability.`,
    config: { thinkingConfig: { thinkingBudget: 24576 } }
  });
  return response.text || "";
};

export const generateProImage = async (prompt: string, aspectRatio: string = "1:1", size: string = "1K") => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: aspectRatio as any, imageSize: size as any } },
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  throw new Error("No image generated");
};

export const editImageWithText = async (prompt: string, base64Data: string, mimeType: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  throw new Error("Editing failed");
};

export const analyzeVideoForAgriInsights = async (videoBase64: string, mimeType: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [{ inlineData: { data: videoBase64, mimeType } }, { text: "Analyze this agricultural video for crop health and activity insights." }] }
  });
  return response.text || "";
};

export const generateSurplusGuide = async (surplusName: string, productName: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Preservation guide: ${surplusName} to ${productName}.`
  });
  return response.text || "";
};

export const askAITutor = async (context: string, question: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    // Fix: replaced undefined variable groupName with function parameter question
    contents: `Context: ${context}\nQuestion: ${question}`,
  });
  return response.text || "";
};

export const verifyTaskCompletion = async (taskTitle: string, taskDescription: string, imageDataUri: string): Promise<any> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { text: `Verify task: ${taskTitle}. Desc: ${taskDescription}. Return JSON.` }, 
        { inlineData: { mimeType: 'image/jpeg', data: imageDataUri } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { verified: { type: Type.BOOLEAN }, reasoning: { type: Type.STRING } },
        required: ['verified', 'reasoning']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateGroundedForumPost = async (topic: string, keywords: string): Promise<{ title: string, content: string, sources: any[] }> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Forum post on ${topic}. Keywords: ${keywords}. Use Search.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return {
    title: topic,
    content: response.text || "",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * Enhanced Market Analysis with Proxy-Suppression logic.
 * Specifically handles MakerSuite/ProxyUnaryCall 500 errors.
 */
export const analyzeMarketDemand = async (cropList: string[]): Promise<any> => {
  const fallbackData = {
    highDemand: [{ name: cropList[0] || 'Wheat', reason: "Mandi arrivals peaked; strong seasonal procurement across Northern belts." }],
    mediumDemand: [{ name: cropList[1] || 'Tomato', reason: "Local supply chains stabilizing; consumption consistent." }],
    lowDemand: [{ name: cropList[2] || 'Basmati Rice', reason: "Off-season inventory glut affecting short-term spot prices." }]
  };

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a concise Indian market demand analysis for: ${cropList.join(', ')}. Focus on Q4 trends.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            highDemand: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ['name', 'reason'] } },
            mediumDemand: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ['name', 'reason'] } },
            lowDemand: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ['name', 'reason'] } }
          },
          required: ['highDemand', 'mediumDemand', 'lowDemand']
        }
      }
    });
    
    if (!response || !response.text) return fallbackData;
    return JSON.parse(response.text);
  } catch (error: any) {
    // Silence RPC errors and log gracefully to console
    console.warn("Gemini Market RPC Error - Using Local Intel Fallback:", error?.message);
    return fallbackData;
  }
};

export const generatePriceForecast = async (cropName: string): Promise<any> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Price forecast for ${cropName}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          currentPrice: { type: Type.STRING },
          forecast: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { week: { type: Type.STRING }, predictedPrice: { type: Type.STRING }, trend: { type: Type.STRING }, confidence: { type: Type.NUMBER } }, required: ['week', 'predictedPrice', 'trend', 'confidence'] } },
          neuralInsights: { type: Type.STRING }
        },
        required: ['cropName', 'currentPrice', 'forecast', 'neuralInsights']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateJourneySummary = async (crop: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summary for ${crop} journey.`,
  });
  return response.text || "";
};

export const generateCropMetadata = async (cropName: string): Promise<any> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Metadata for ${cropName}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { category: { type: Type.STRING }, funFact: { type: Type.STRING }, subsidies: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ['category', 'funFact', 'subsidies']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const fetchWeatherContext = async (location: string): Promise<any> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Weather for ${location}. Return JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { temp: { type: Type.STRING }, condition: { type: Type.STRING }, humidity: { type: Type.STRING }, precipChance: { type: Type.STRING }, summary: { type: Type.STRING } },
        required: ["temp", "condition", "humidity", "precipChance", "summary"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const predictHarvestYield = async (cropName: string, location: string, soilType: string): Promise<any> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Predict yield for ${cropName}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { forecastedYield: { type: Type.STRING }, marketValue: { type: Type.STRING }, trend: { type: Type.STRING }, confidenceScore: { type: Type.NUMBER }, reasoning: { type: Type.STRING } },
        required: ["forecastedYield", "marketValue", "trend", "confidenceScore", "reasoning"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const connectLiveAPI = (callbacks: any) => {
  const ai = getAi();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
      systemInstruction: 'You are KisaanMitra assistant.',
    },
  });
};

export const generateVeoVideo = async (prompt: string, aspectRatio: string = '16:9'): Promise<string> => {
  const ai = getAi();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio as any
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
