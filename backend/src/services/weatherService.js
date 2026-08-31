const axios = require('axios');

exports.getWeatherData = async (lat, lon) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      // Return mock data if no key
      return {
        temp: 30,
        humidity: 70,
        forecastRain: 15, // mm of rain
        mocked: true
      };
    }

    // Current weather
    const currentRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    
    // 5-day forecast
    const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

    // Calculate total rain in next 5 days
    let totalRain = 0;
    forecastRes.data.list.forEach(item => {
      if (item.rain && item.rain['3h']) {
        totalRain += item.rain['3h'];
      }
    });

    return {
      temp: currentRes.data.main.temp,
      humidity: currentRes.data.main.humidity,
      forecastRain: totalRain,
      mocked: false
    };

  } catch (error) {
    console.error('Weather API error:', error.message);
    throw new Error('Failed to fetch weather data');
  }
};
