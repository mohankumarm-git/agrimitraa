const axios = require('axios');
async function test() {
  try {
    const email = "test" + Date.now() + "@test.com";
    const phone = Math.floor(Math.random() * 9000000000) + 1000000000;
    const authRes = await axios.post('https://agrimitraa.onrender.com/api/auth/register', {
      name: "Test", email: email, password: "password123", phone: phone.toString(), role: "farmer", location: "Chennai"
    });
    const token = authRes.data.data.accessToken;
    
    // A large enough string to pass the length check (> 100)
    const fakeImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=".repeat(10);
    
    const res = await axios.post('https://agrimitraa.onrender.com/api/disease/analyze', {
      imageBase64: fakeImageBase64
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.error("FAILED:", err.response ? err.response.data : err.message);
  }
}
test();