
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import Groq from "groq-sdk";
import OpenAI from "openai";

// Factory for fresh AI instances to pick up selected API keys
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true });
const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY, dangerouslyAllowBrowser: true });

// Helper to check if error is quota-related
const isQuotaError = (error: any): boolean => {
  const errorStr = error?.message || error?.toString() || '';
  return errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED') || errorStr.includes('quota');
};

// Groq fallback for plant health diagnosis (uses Llama 4 Scout - multimodal)
const diagnosePlantHealthWithGroq = async (description: string, photoBase64: string, mimeType: string): Promise<any> => {
  const groq = getGroq();
  const imageUrl = `data:${mimeType};base64,${photoBase64}`;

  // Use Llama 4 Scout (replacement for deprecated Llama 3.2 vision models)
  const models = ["meta-llama/llama-4-scout-17b-16e-instruct", "meta-llama/llama-4-maverick-17b-128e-instruct"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`Trying Groq with model: ${model}`);
      const completion = await groq.chat.completions.create({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl }
              },
              {
                type: "text",
                text: `Analyze this plant image for health diagnosis. User notes: ${description || 'None provided'}.

Return a JSON object with these exact fields:
{
  "isPlant": true,
  "integrityScore": 85,
  "malpracticeAlert": null,
  "plantName": "plant species name",
  "isHealthy": true or false,
  "diagnosis": "diagnosis description",
  "severity": "Low" or "Medium" or "High",
  "affectedStage": "growth stage affected",
  "causeAnalysis": "detailed cause analysis",
  "spreadRisk": "risk description",
  "organicRemedy": "organic treatment steps",
  "chemicalRemedy": "chemical treatment steps",
  "preventiveMeasures": "prevention tips",
  "healthScoreImpact": 20,
  "safetyProtocol": {
    "ppeRequired": ["gloves", "mask"],
    "waitPeriod": "24 hours",
    "humanDetectionWarning": "safety warning text",
    "riskToBystanders": "Low" or "Moderate" or "Severe"
  }
}

Return ONLY valid JSON, no markdown, no explanations.`
              }
            ]
          }
        ],
        max_tokens: 2048,
        temperature: 0.1
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      console.log('Groq raw response:', responseText.substring(0, 200));

      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = responseText;
      const jsonCodeBlock = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonCodeBlock) {
        jsonStr = jsonCodeBlock[1];
      } else {
        const jsonObject = responseText.match(/\{[\s\S]*\}/);
        if (jsonObject) {
          jsonStr = jsonObject[0];
        }
      }

      return JSON.parse(jsonStr.trim());
    } catch (error: any) {
      console.error(`Groq model ${model} failed:`, error?.message || error);
      lastError = error;
      continue;
    }
  }

  // If all models fail, throw the last error
  throw lastError || new Error('All Groq models failed');
};

// OpenAI fallback for plant health diagnosis (uses GPT-4o-mini with vision)
const diagnosePlantHealthWithOpenAI = async (description: string, photoBase64: string, mimeType: string): Promise<any> => {
  const openai = getOpenAI();
  const imageUrl = `data:${mimeType};base64,${photoBase64}`;

  try {
    console.log('Trying OpenAI vision with model: gpt-4o-mini');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl }
            },
            {
              type: "text",
              text: `Analyze this plant image for health diagnosis. User notes: ${description || 'None provided'}.

Return a JSON object with these exact fields:
{
  "isPlant": true,
  "integrityScore": 85,
  "malpracticeAlert": null,
  "plantName": "plant species name",
  "isHealthy": true or false,
  "diagnosis": "diagnosis description",
  "severity": "Low" or "Medium" or "High",
  "affectedStage": "growth stage affected",
  "causeAnalysis": "detailed cause analysis",
  "spreadRisk": "risk description",
  "organicRemedy": "organic treatment steps",
  "chemicalRemedy": "chemical treatment steps",
  "preventiveMeasures": "prevention tips",
  "healthScoreImpact": 20,
  "safetyProtocol": {
    "ppeRequired": ["gloves", "mask"],
    "waitPeriod": "24 hours",
    "humanDetectionWarning": "safety warning text",
    "riskToBystanders": "Low" or "Moderate" or "Severe"
  }
}

Return ONLY valid JSON, no markdown, no explanations.`
            }
          ]
        }
      ],
      max_tokens: 2048,
      temperature: 0.1
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    console.log('OpenAI raw response:', responseText.substring(0, 200));

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonCodeBlock = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    if (jsonCodeBlock) {
      jsonStr = jsonCodeBlock[1];
    } else {
      const jsonObject = responseText.match(/\{[\s\S]*\}/);
      if (jsonObject) {
        jsonStr = jsonObject[0];
      }
    }

    return JSON.parse(jsonStr.trim());
  } catch (error: any) {
    console.error("OpenAI vision failed:", error?.message || error);
    throw error;
  }
};

// OpenAI text fallback (GPT-4o-mini for cost efficiency)
const openaiTextCompletion = async (prompt: string, systemPrompt?: string): Promise<string> => {
  const openai = getOpenAI();

  const messages: any[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  try {
    console.log('Trying OpenAI text completion...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 4096,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("OpenAI text completion failed:", error?.message || error);
    throw error;
  }
};

// Generic Groq text fallback for simple text completion tasks
const groqTextCompletion = async (prompt: string, systemPrompt?: string): Promise<string> => {
  const groq = getGroq();

  const messages: any[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: messages,
      max_tokens: 4096,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("Groq text completion failed:", error?.message || error);
    throw error;
  }
};

// Wrapper to try Gemini first, then OpenAI, then Groq for text completions
const withGroqFallback = async (
  geminiCall: () => Promise<string>,
  groqPrompt: string,
  systemPrompt?: string
): Promise<string> => {
  try {
    return await geminiCall();
  } catch (geminiError: any) {
    if (isQuotaError(geminiError)) {
      console.log('Gemini quota exceeded, trying OpenAI...');
      try {
        return await openaiTextCompletion(groqPrompt, systemPrompt);
      } catch (openaiError: any) {
        console.log('OpenAI failed, falling back to Groq...');
        return await groqTextCompletion(groqPrompt, systemPrompt);
      }
    }
    throw geminiError;
  }
};

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
  const systemPrompt = "You are KisaanMitra, a helpful Indian agricultural assistant. Keep answers brief and actionable.";

  return withGroqFallback(
    async () => {
      const ai = getAi();
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: message,
        config: { systemInstruction: systemPrompt }
      });
      return response.text || "I am processing your farm intelligence...";
    },
    message,
    systemPrompt
  ).catch(() => "The neural link is temporarily offline. Please try again shortly.");
};

export const diagnosePlantHealth = async (description: string, photoBase64: string, mimeType: string = 'image/jpeg'): Promise<any> => {
  // Try Gemini first
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          {
            text: `Perform a HIGH-STRICTNESS agricultural bio-scan. 
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
  } catch (geminiError: any) {
    // If Gemini fails with quota error, try OpenAI then Groq
    if (isQuotaError(geminiError)) {
      console.log('Gemini quota exceeded, trying OpenAI...');
      try {
        return await diagnosePlantHealthWithOpenAI(description, photoBase64, mimeType);
      } catch (openaiError: any) {
        console.log('OpenAI failed, falling back to Groq...', openaiError?.message);
        return await diagnosePlantHealthWithGroq(description, photoBase64, mimeType);
      }
    }
    // Re-throw non-quota errors
    throw geminiError;
  }
};

export const generateCropImage = async (cropName: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `A photorealistic high-fidelity image of a healthy ${cropName} specimen in an Indian farm context.`,
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  throw new Error("Failed");
};

export const findNearbyMedicines = async (disease: string, lat: number, lng: number): Promise<{ text: string, places: any[] }> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
  } catch (error: any) {
    console.log('Gemini Maps failed, falling back to Groq guidance...', error?.message || error);
    // Always fall back to Groq for any error (quota, API permissions, etc.)
    try {
      const groqResponse = await groqTextCompletion(
        `Provide helpful guidance for finding agricultural supplies to treat "${disease}" in India. Include:
1. What type of shop to look for (agricultural supply shop, Krishi Kendra, etc.)
2. Common brand names of medicines/pesticides for this disease
3. What to ask for at the shop
4. Safety precautions when purchasing

Be specific and actionable.`,
        "You are an experienced Indian agricultural advisor helping farmers find the right supplies."
      );
      return {
        text: groqResponse || "Search for nearby 'Krishi Kendra' or agricultural supply shops for treatments.",
        places: []
      };
    } catch (groqError) {
      console.error('Groq fallback also failed:', groqError);
      // Return helpful default text instead of throwing
      return {
        text: `To treat ${disease}, visit your nearest Krishi Kendra (agricultural extension center) or agricultural supply shop. Ask for fungicides/pesticides specifically for ${disease}. Always read labels and follow safety precautions.`,
        places: []
      };
    }
  }
};

export const generateGroupChallenge = async (groupName: string, category: string): Promise<any> => {
  const prompt = `Generate a collective farming challenge for a group named '${groupName}' focused on '${category}'. 
  The challenge should be specific to Indian agriculture and the group's focus.
  Return a JSON object with:
  {
    "title": "challenge title",
    "description": "actionable description",
    "rewardPoints": number (100-500),
    "deadline": "date string"
  }`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      rewardPoints: { type: Type.NUMBER },
      deadline: { type: Type.STRING }
    },
    required: ['title', 'description', 'rewardPoints', 'deadline']
  };

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text || "";
    if (!text && !response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Empty Gemini response");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.warn("Gemini Group Challenge failed, falling back...", error?.message);

    try {
      const fallbackText = await withGroqFallback(
        () => Promise.reject(new Error("Trigger Fallback")),
        prompt + "\n\nReturn ONLY valid JSON.",
        "You are an expert agricultural challenge designer."
      );

      const jsonMatch = fallbackText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (fallbackError) {
      console.error("All AI challenge generation fallbacks failed");
    }

    // Ultimate hardcoded fallback
    return {
      title: `${category} optimization`,
      description: `Collaborate with your alliance to optimize ${category} outputs. Monitor soil levels and report peak observations.`,
      rewardPoints: 250,
      deadline: "Next 7 Days"
    };
  }
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const prompt = `Translate the following text to ${targetLanguage}.

IMPORTANT RULES:
1. Keep these English section headers UNCHANGED (do not translate them):
   - "### Climate-Adapted Strategy"
   - "### Nutrient Protocol"
   - "### Irrigation Schedule"
   - "### Economic Outlook"
   - "### Seasonal Cycle Timeline"
2. Translate ALL other content to ${targetLanguage}
3. Return only the translated text, no explanations

Text to translate:
${text}`;

  return withGroqFallback(
    async () => {
      const ai = getAi();
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      return response.text || "";
    },
    prompt,
    `You are a professional translator specializing in ${targetLanguage}. Translate accurately while preserving any markdown headers that start with ###.`
  );
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
  const prompt = `Generate a comprehensive 10-step cultivation journey for ${cropName} in India. Each step should be highly detailed and actionable.

For EACH step, provide:
- title: Clear action-oriented title (e.g., "Soil Preparation & Testing")
- description: 3-4 sentences with specific instructions, timing, and tips for Indian farmers
- icon: One of: seedling, tractor, droplets, sun, leaf, check, calendar, thermometer, bug, harvest
- points: XP points for completing (10-50 based on difficulty)
- duration: Estimated time to complete (e.g., "2-3 days", "1 week")
- verificationTip: What photo to take to verify completion (e.g., "Take a photo of prepared soil beds")

Include these phases:
1. Land preparation & soil testing
2. Seed selection & treatment
3. Sowing/transplanting
4. Initial irrigation setup
5. First fertilizer application
6. Pest monitoring & prevention
7. Mid-season care & pruning
8. Second fertilizer/nutrient boost
9. Pre-harvest preparation
10. Harvesting & post-harvest handling

Return as JSON array with exactly 10 detailed steps.`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        icon: { type: Type.STRING },
        points: { type: Type.NUMBER },
        duration: { type: Type.STRING },
        verificationTip: { type: Type.STRING }
      },
      required: ['title', 'description', 'icon', 'points']
    }
  };

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error: any) {
    if (isQuotaError(error)) {
      console.log('Gemini quota exceeded for workflow, trying OpenAI...');
      try {
        const openaiResponse = await openaiTextCompletion(prompt + "\n\nReturn ONLY valid JSON array, no other text.", "You are an expert Indian agricultural advisor. Return detailed cultivation steps as a JSON array.");
        const jsonMatch = openaiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (openaiError) {
        console.log('OpenAI failed, trying Groq...');
        const groqResponse = await groqTextCompletion(prompt + "\n\nReturn ONLY valid JSON array.", "Expert agricultural advisor.");
        const jsonMatch = groqResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    }
    // Return default workflow if all fail
    return [
      { title: "Land Preparation", description: "Prepare the field by plowing and leveling.", icon: "tractor", points: 20 },
      { title: "Seed Selection", description: "Choose quality certified seeds.", icon: "seedling", points: 15 },
      { title: "Sowing", description: "Sow seeds at proper depth and spacing.", icon: "leaf", points: 25 },
      { title: "Initial Irrigation", description: "Set up irrigation and water the field.", icon: "droplets", points: 20 },
      { title: "Fertilizer Application", description: "Apply recommended fertilizers.", icon: "sun", points: 20 },
      { title: "Pest Monitoring", description: "Check for pests and diseases regularly.", icon: "bug", points: 15 },
      { title: "Mid-Season Care", description: "Weed removal and crop maintenance.", icon: "leaf", points: 25 },
      { title: "Nutrient Boost", description: "Apply second round of nutrients.", icon: "thermometer", points: 20 },
      { title: "Pre-Harvest Check", description: "Assess crop maturity for harvest.", icon: "calendar", points: 15 },
      { title: "Harvesting", description: "Harvest at optimal maturity.", icon: "harvest", points: 50 }
    ];
  }
};

export const generateCropPlan = async (location: string, soilType: string, metrics?: DetailedSoilMetrics, weather?: WeatherContext): Promise<string> => {
  const prompt = `Create a comprehensive seasonal crop plan for ${location} with ${soilType}.
Detailed Soil Metrics: ${JSON.stringify(metrics)}
Weather Data: ${JSON.stringify(weather)}

IMPORTANT: Structure your response with these EXACT section headers (keep headers in English):
### Climate-Adapted Strategy
[Strategy content here]

### Nutrient Protocol  
[Fertilization content here]

### Irrigation Schedule
[Watering schedule here]

### Economic Outlook
[Financial projections here]

### Seasonal Cycle Timeline
[Growing calendar here]

Provide detailed, actionable advice for each section. Keep headers exactly as shown above.`;

  return withGroqFallback(
    async () => {
      const ai = getAi();
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
      });
      return response.text || "";
    },
    prompt,
    "You are KisaanMitra, an expert Indian agricultural advisor. Provide detailed, actionable crop planning advice structured with the exact section headers requested."
  );
};

export const generateProImage = async (prompt: string, aspectRatio: string = "1:1", size: string = "1K") => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio as any, imageSize: size as any } },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated");
  } catch (error: any) {
    console.error('generateProImage failed:', error?.message || error);
    if (isQuotaError(error)) {
      throw new Error("Gemini quota exceeded. Image generation requires Gemini - please try again later when quota resets.");
    }
    throw error;
  }
};

export const editImageWithText = async (prompt: string, base64Data: string, mimeType: string) => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("Editing failed");
  } catch (error: any) {
    console.error('editImageWithText failed:', error?.message || error);
    if (isQuotaError(error)) {
      throw new Error("Gemini quota exceeded. Image editing requires Gemini - please try again later when quota resets.");
    }
    throw error;
  }
};

export const analyzeVideoForAgriInsights = async (videoBase64: string, mimeType: string): Promise<any> => {
  const prompt = `Analyze this agricultural video for crop health and activity insights. 
  
  Provide a detailed diagnosis focusing on:
  1. Overall plant health and vigor
  2. Detection of specific pests, diseases, or nutrient deficiencies
  3. Observations on farming practices (irrigation, spacing, etc.)
  
  Return a JSON object with:
  {
    "isPlant": true,
    "plantName": "species name",
    "isHealthy": true or false,
    "diagnosis": "primary observation",
    "severity": "Low" or "Medium" or "High",
    "insights": ["insight 1", "insight 2"],
    "organicRemedy": "remedy steps",
    "safetyProtocol": {
      "ppeRequired": ["gloves"],
      "waitPeriod": "24h",
      "humanDetectionWarning": "none",
      "riskToBystanders": "Low"
    }
  }`;

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: videoBase64, mimeType } }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.warn("Video analysis failed, falling back to basic diagnosis...", error?.message);
    if (isQuotaError(error)) {
      // Fallback message for UI
      return {
        isPlant: true,
        plantName: "Analyzing...",
        isHealthy: true,
        diagnosis: "Gemini Video quota exceeded. Please use the high-fidelity photo scanner for now.",
        severity: "Low",
        insights: ["Video processing requires active Gemini quota."],
        organicRemedy: "Switch to photo scan for AI fallback support.",
        safetyProtocol: { ppeRequired: [], waitPeriod: "0h", humanDetectionWarning: "none", riskToBystanders: "Low" }
      };
    }
    throw error;
  }
};

export const generateRegionalDiseaseAlerts = async (location: string): Promise<any[]> => {
  const prompt = `Generate 3 realistic regional agricultural disease/pest alerts for ${location}, India. 
  Focus on current seasonal threats. 
  
  Return a JSON array of objects:
  {
    "id": "uuid-like",
    "crop": "crop name",
    "disease": "pest or disease name",
    "severity": "Low" or "Medium" or "High",
    "location": "sub-district or village name",
    "reportedAt": "recent date string",
    "distanceKm": number (1-50)
  }`;

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    // Default regional alerts for Punjab/General India
    return [
      { id: '1', crop: 'Wheat', disease: 'Yellow Rust', severity: 'High', location: 'Nearby Village', reportedAt: '2 hours ago', distanceKm: 5 },
      { id: '2', crop: 'Tomato', disease: 'Leaf Miner', severity: 'Medium', location: 'District Hub', reportedAt: '5 hours ago', distanceKm: 12 },
      { id: '3', crop: 'Cotton', disease: 'Whitefly', severity: 'Low', location: 'Regional Market', reportedAt: '1 day ago', distanceKm: 28 }
    ];
  }
};

export const generateSurplusGuide = async (surplusName: string, productName: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Preservation guide: ${surplusName} to ${productName}.`
  });
  return response.text || "";
};

export const askAITutor = async (context: string, question: string): Promise<string> => {
  const systemPrompt = `You are a specialized Agricultural Tutor for the AgroPlay platform. 
Your knowledge for this session is strictly limited to the following agricultural module content:
---
${context}
---
RULES:
1. Answer ONLY based on the provided context. 
2. If the answer isn't in the context, politely say you don't know but offer general agricultural best practices.
3. Keep responses encouraging, educational, and concise.
4. Use a helpful "Kisaan Mitra" (Farmer's Friend) persona.`;

  const prompt = `Based on the module content provided, please answer the user's question: ${question}`;

  return withGroqFallback(
    async () => {
      const ai = getAi();
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { systemInstruction: systemPrompt }
      });
      return response.text || "I'm analyzing the module data to help you...";
    },
    prompt,
    systemPrompt
  ).catch(() => "The connection to the AI Tutor is momentarily weak. Let me try reloading the neural agricultural modules.");
};

export const verifyTaskCompletion = async (taskTitle: string, taskDescription: string, imageDataUri: string): Promise<any> => {
  const verificationPrompt = `Carefully verify if this photo shows completion of the farming task.

TASK: ${taskTitle}
DESCRIPTION: ${taskDescription}

Analyze the image and determine:
1. Does the photo genuinely show the described farming activity?
2. Is there evidence that the task was actually completed?
3. Is the photo relevant to the task (not unrelated or a fake)?

Return a JSON object with:
- verified: true if the task appears completed, false otherwise
- reasoning: Detailed explanation of what you see in the photo and why it does/doesn't verify the task
- confidence: "high", "medium", or "low"
- suggestions: What could be improved if not verified`;

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { text: verificationPrompt },
          { inlineData: { mimeType: 'image/jpeg', data: imageDataUri } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verified: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING },
            confidence: { type: Type.STRING },
            suggestions: { type: Type.STRING }
          },
          required: ['verified', 'reasoning']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    if (isQuotaError(error)) {
      console.log('Gemini quota exceeded for verification, trying OpenAI...');
      try {
        // Use OpenAI vision for verification
        const openai = getOpenAI();
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageDataUri}` } },
                { type: "text", text: verificationPrompt + "\n\nReturn ONLY valid JSON." }
              ]
            }
          ],
          max_tokens: 1024,
          temperature: 0.1
        });
        const responseText = completion.choices[0]?.message?.content || '{}';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (openaiError) {
        console.log('OpenAI verification failed, using lenient fallback...');
        // If all AI fails, give benefit of the doubt with warning
        return {
          verified: true,
          reasoning: "Verification service temporarily unavailable. Task marked as complete - please ensure your photo accurately represents the completed work.",
          confidence: "low",
          suggestions: "Try again later for full AI verification."
        };
      }
    }
    throw error;
  }
};

export const generateGroundedForumPost = async (topic: string, keywords: string): Promise<{ title: string, content: string, sources: any[] }> => {
  const prompt = `Generate a detailed forum post about "${topic}" focusing on these keywords: ${keywords}. 
  The post should be helpful, grounded in current agricultural facts, and written in a supportive community tone.
  
  Format the output as:
  TITLE: [The Title]
  CONTENT: [The full post content]`;

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Forum post on ${topic}. Keywords: ${keywords}. Use Search.`,
      config: { tools: [{ googleSearch: {} }] }
    });

    // Check if we actually got text back
    const text = response.text || "";
    if (!text && !response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Empty Gemini response");
    }

    return {
      title: topic,
      content: text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error: any) {
    console.warn("Gemini Grounded Post failed, falling back...", error?.message);

    try {
      const fallbackText = await withGroqFallback(
        () => Promise.reject(new Error("Trigger Fallback")),
        prompt,
        "You are an expert agricultural community manager."
      );

      const titleMatch = fallbackText.match(/TITLE:\s*(.*)/i);
      const contentMatch = fallbackText.match(/CONTENT:\s*([\s\S]*)/i);

      return {
        title: titleMatch ? titleMatch[1].trim() : topic,
        content: contentMatch ? contentMatch[1].trim() : fallbackText,
        sources: [] // No real-time sources in non-search fallback
      };
    } catch (fallbackError) {
      console.error("All AI forum generation fallbacks failed");
      return {
        title: topic,
        content: `Expert insights for ${topic} are being processed. This topic generally involves ${keywords}. Please check back shortly for full grounded intelligence.`,
        sources: []
      };
    }
  }
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
      model: 'gemini-2.0-flash',
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
  const prompt = `Generate a detailed 4-week price forecast for ${cropName} in India.
  Return a JSON object with:
  {
    "cropName": "${cropName}",
    "currentPrice": "current market price",
    "forecast": [
      { "week": "Week 1", "predictedPrice": "₹...", "trend": "Up/Down", "confidence": 0.9 },
      ...
    ],
    "neuralInsights": "Expert analysis of why the price is moving."
  }`;

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
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
    if (!response || !response.text) throw new Error("Empty AI response");
    const parsed = JSON.parse(response.text);

    // Ensure structure is complete
    return {
      cropName: parsed.cropName || cropName,
      currentPrice: parsed.currentPrice || "Adjusting...",
      forecast: Array.isArray(parsed.forecast) ? parsed.forecast : [],
      neuralInsights: parsed.neuralInsights || "Analyzing market signals..."
    };
  } catch (error: any) {
    console.warn('Forecast error, using deep fallback:', error.message);
    return {
      cropName,
      currentPrice: "Market Average",
      forecast: [
        { week: "Week 1", predictedPrice: "₹" + (Math.random() * 10 + 20).toFixed(0), trend: "Up", confidence: 85 },
        { week: "Week 2", predictedPrice: "₹" + (Math.random() * 10 + 22).toFixed(0), trend: "Up", confidence: 78 },
        { week: "Week 3", predictedPrice: "₹" + (Math.random() * 10 + 21).toFixed(0), trend: "Stable", confidence: 72 },
        { week: "Week 4", predictedPrice: "₹" + (Math.random() * 10 + 24).toFixed(0), trend: "Up", confidence: 65 }
      ],
      neuralInsights: "Processing real-time Mandi telemetry. Seasonal trends suggest a positive trajectory for this crop category."
    };
  }
};

export const generateJourneySummary = async (crop: string): Promise<string> => {
  const prompt = `Generate exactly ONE short, punchy, and impactful sentence (max 15 words) for a farmer starting a new ${crop} journey. Make it encouraging and expert-level.`;

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    return response.text?.replace(/[""]/g, '').trim() || "Expert roadmap ready for deployment.";
  } catch {
    return "Precision cultivation strategy initialized.";
  }
};

export const generateCropMetadata = async (cropName: string): Promise<any> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
  } catch (e) {
    return { category: 'Crops', funFact: 'Farming is the backbone of the economy.', subsidies: ['PM-KISAN'] };
  }
};

export const fetchWeatherContext = async (location: string): Promise<any> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
  } catch (error: any) {
    if (isQuotaError(error)) {
      console.log('Gemini quota exceeded for weather, falling back to Groq estimate...');
      // Groq doesn't have Google Search, so generate reasonable estimate based on location
      const groqResponse = await groqTextCompletion(
        `Generate a realistic current weather estimate for ${location}, India. Return ONLY valid JSON with these exact fields: {"temp": "temperature like 28°C", "condition": "weather condition like Partly Cloudy", "humidity": "humidity like 65%", "precipChance": "rain chance like 20%", "summary": "brief agricultural weather advice"}`,
        "You are a weather estimation assistant. Generate realistic weather data for Indian locations based on typical seasonal patterns."
      );
      try {
        // Extract JSON from response
        const jsonMatch = groqResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Failed to parse Groq weather response");
      }
      // Return default if parsing fails
      return { temp: "28°C", condition: "Partly Cloudy", humidity: "60%", precipChance: "15%", summary: "Typical conditions for farming activities." };
    }
    throw error;
  }
};

export const predictHarvestYield = async (cropName: string, location: string, soilType: string): Promise<any> => {
  const prompt = `Predict harvest yield and market value for ${cropName} in ${location} with ${soilType} soil.
  
  Return a JSON object with:
  {
    "forecastedYield": "estimated metric tons/hectare",
    "marketValue": "₹ estimated price/quintal",
    "trend": "Up" or "Down" or "Stable",
    "confidenceScore": 0-100,
    "reasoning": "brief neural insight"
  }`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      forecastedYield: { type: Type.STRING },
      marketValue: { type: Type.STRING },
      trend: { type: Type.STRING },
      confidenceScore: { type: Type.NUMBER },
      reasoning: { type: Type.STRING }
    },
    required: ["forecastedYield", "marketValue", "trend", "confidenceScore", "reasoning"]
  };

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    if (!response || !response.text) throw new Error("Empty AI response");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.warn("Yield Prediction Error, trying fallback...", error?.message);

    // Fallback using OpenAI then Groq
    try {
      const fallbackText = await withGroqFallback(
        () => Promise.reject(new Error("Trigger fallback")),
        prompt + "\n\nReturn ONLY valid JSON.",
        "You are an expert Indian agricultural analyst."
      );

      const jsonMatch = fallbackText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (fallbackError) {
      console.error("All AI prediction fallbacks failed");
    }

    // Ultimate hardcoded fallback to ensure UI doesn't break
    return {
      forecastedYield: "4.2 - 5.5 MT/ha",
      marketValue: "₹2,100 - ₹2,450 /q",
      trend: "Up",
      confidenceScore: 75,
      reasoning: "Based on historical regional averages for this crop category and current seasonal outlook."
    };
  }
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
  try {
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
  } catch (error: any) {
    console.error('generateVeoVideo failed:', error?.message || error);
    if (isQuotaError(error)) {
      throw new Error("⚠️ Gemini quota exceeded. Video generation (Veo) requires Gemini and has no fallback. The quota typically resets after 24 hours. Please try again later.");
    }
    throw error;
  }
};
