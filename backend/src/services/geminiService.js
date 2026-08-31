const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.analyzeDisease = async (imageBase64) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "MOCK_RESPONSE: Based on the visual symptoms (yellowing leaves and dark spots), this appears to be Leaf Spot Disease. Severity: Moderate. Treatment: Apply copper-based fungicide and ensure proper drainage.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = "You are an agricultural expert. Analyze this crop leaf image. Identify the likely disease, severity, and provide treatment/prevention steps. Keep it concise.";
  
  const imageParts = [
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg" // assuming jpeg for now
      }
    }
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  return response.text();
};

exports.answerVoiceQuery = async (queryText) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "MOCK_RESPONSE: உரம் இடும் போது மண்ணின் ஈரப்பதம் முக்கியம். (Moisture is important when applying fertilizer.)";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `You are AgriMitra, an AI assistant for farmers in Tamil Nadu. Answer the following question regarding farming, crops, or weather. Provide a short, actionable response in Tamil. Question: ${queryText}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
