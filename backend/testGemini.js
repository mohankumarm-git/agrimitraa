require('dotenv').config({ path: '.env' });
const { analyzeDisease } = require('./src/services/geminiService');

async function test() {
  try {
    // 1 pixel base64 image
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const res = await analyzeDisease(base64);
    console.log("SUCCESS:", res);
  } catch (err) {
    console.error("FAILED:", err);
  }
}
test();