const Crop = require('../models/Crop');
const { getWeatherData } = require('../services/weatherService');

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1; // 1-12
  // Tamil Nadu seasons approx:
  // Kharif: June - Sept (6-9)
  // Rabi: Oct - March (10-3)
  // Summer: April - May (4-5)
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

    // 1. Get Weather Data
    const weatherData = await getWeatherData(lat, lon);
    
    // 2. Derive Current Season
    const currentSeason = getCurrentSeason();

    // 3. Determine Water Availability based on forecast rain
    let waterAvail = 'Medium';
    if (weatherData.forecastRain > 50) waterAvail = 'High';
    if (weatherData.forecastRain < 10) waterAvail = 'Low';

    // 4. Query DB for matching crops
    // We want crops that match season, soilType, and ideally water requirement
    let crops = await Crop.find({
      season: { $in: [currentSeason] },
      soilType: { $in: [soilType] }
    });

    // Rank crops: exact water match gets priority
    crops = crops.sort((a, b) => {
      if (a.waterRequirement === waterAvail && b.waterRequirement !== waterAvail) return -1;
      if (b.waterRequirement === waterAvail && a.waterRequirement !== waterAvail) return 1;
      return 0;
    });

    res.status(200).json({
      success: true,
      data: {
        weather: weatherData,
        season: currentSeason,
        suggestions: crops.slice(0, 5) // top 5
      }
    });

  } catch (error) {
    next(error);
  }
};
