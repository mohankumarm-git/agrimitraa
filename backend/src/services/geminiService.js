const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.analyzeDisease = async (imageBase64) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasApiKey = !!apiKey;
  const modelName = 'gemini-1.5-flash';
  const mimeType = "image/jpeg";
  const imageSize = imageBase64 ? imageBase64.length : 0;

  console.log(`[Disease Detection] Model: ${modelName} | API Key Configured: ${hasApiKey} | Image Type: ${mimeType} | Base64 Length: ${imageSize}`);

  if (!hasApiKey) {
    throw new Error("AI service configuration needs attention.");
  }
  
  if (!imageBase64 || imageSize < 100) {
    throw new Error("We couldn't process this image. Please upload a clear photo of the affected leaf.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `You are an agricultural crop disease analysis assistant.

Analyze this plant/leaf image.

Return:
- possible disease or condition
- whether the plant appears healthy
- visible symptoms
- affected crop/plant if identifiable
- general recommended next steps
- confidence level

Do not claim certainty when the image is unclear.
If the image quality is insufficient, clearly say that the result is uncertain.

Return the result in structured JSON if the current Gemini SDK supports structured output. Expected structure:
{
  "crop": "Tomato",
  "condition": "Possible Early Blight",
  "confidence": 91,
  "symptoms": ["Brown spots", "Yellowing leaves"],
  "recommendations": ["Monitor affected leaves", "Remove severely affected leaves"]
}`;

  const imageParts = [
    {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    }
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();
    
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/, '').replace(/```\n?$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/, '').replace(/```\n?$/, '');
    }
    text = text.trim();

    try {
      JSON.parse(text); 
    } catch (e) {
      text = JSON.stringify({
        crop: "Unknown",
        condition: text.substring(0, 100) + "...",
        confidence: 0,
        symptoms: [],
        recommendations: ["Consult a local agricultural expert."]
      });
    }

    return text;
  } catch (error) {
    console.error("Disease Detection Gemini Error:", error);
    
    const errorStr = error.toString().toLowerCase();
    
    if (errorStr.includes("not found") && errorStr.includes("models/")) {
      throw new Error("AI model configuration error. Please check the Gemini model settings.");
    } else if (errorStr.includes("api key") || errorStr.includes("unauthorized") || errorStr.includes("forbidden") || errorStr.includes("401") || errorStr.includes("403")) {
      throw new Error("AI service configuration needs attention. (Invalid API Key)");
    } else if (errorStr.includes("image") || errorStr.includes("payload") || errorStr.includes("too large") || errorStr.includes("413")) {
      throw new Error("We couldn't process this image. The file might be too large.");
    } else if (errorStr.includes("network") || errorStr.includes("timeout") || errorStr.includes("econnrefused")) {
      throw new Error("Unable to connect to the AI service. Please check your internet connection and try again.");
    } else {
      // Return the raw error message to the frontend so we can debug it properly!
      throw new Error("AI Error: " + error.message);
    }
  }
};

exports.answerVoiceQuery = async (queryText) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "MOCK_RESPONSE: Moisture is important when applying fertilizer.";
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(`You are AgriMitra, an AI assistant for farmers in Tamil Nadu. Answer the following question regarding farming, crops, or weather. Provide a short, actionable response in Tamil. Question: ${queryText}`);
  const response = await result.response;
  return response.text();
};
