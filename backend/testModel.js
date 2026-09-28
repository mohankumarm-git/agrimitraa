const { GoogleGenerativeAI } = require('@google/generative-ai');
async function test() {
  const genAI = new GoogleGenerativeAI('INVALID_KEY_123');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  try {
    await model.generateContent("hello");
  } catch(e) {
    console.log(e.toString());
  }
}
test();