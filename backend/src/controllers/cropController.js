const Crop = require('../models/Crop');
const { getWeatherData } = require('../services/weatherService');

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 9) return 'Kharif';
  if (month >= 4 && month <= 5) return 'Summer';
  return 'Rabi';
};

exports.suggestCrops = async (req, res, next) => {
  try {
    const { district, soilType, lat, lon } = req.body;

    if (!soilType || !lat || !lon) {
      return res.status(400).json({ success: false, message: 'soilType, lat, and lon are required' });
    }

    let weatherData = null;
    try {
      weatherData = await getWeatherData(lat, lon);
    } catch(e) {
      console.log('Weather API failed, using fallback', e.message);
      weatherData = { temp: 31, humidity: 50, forecastRain: 12, description: 'clear sky' };
    }
    
    const currentSeason = getCurrentSeason();

    let waterAvail = 'Medium';
    if (weatherData.forecastRain > 50) waterAvail = 'High';
    if (weatherData.forecastRain < 10) waterAvail = 'Low';

    let crops = await Crop.find({
      season: { $in: [currentSeason] },
      soilType: { $in: [soilType] }
    });

    if (crops.length === 0) {
      console.log('DB is empty or no match, using fallback crops');
      crops = [
        {
          nameEn: 'Rice (Paddy)',
          nameTa: '??????',
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/5341/5341258.png',
          matchReasonEn: 'Excellent match for current high water availability and season.',
          durationDays: 120
        },
        {
          nameEn: 'Millets (Ragi)',
          nameTa: '????????',
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/6890/6890666.png',
          matchReasonEn: 'Great for low rainfall conditions and selected soil.',
          durationDays: 90
        }
      ];
    }

    res.status(200).json({
      success: true,
      data: {
        weather: weatherData,
        season: currentSeason,
        suggestions: crops.slice(0, 5)
      }
    });

  } catch (error) {
    next(error);
  }
};
