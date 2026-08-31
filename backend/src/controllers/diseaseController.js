const DiseaseLog = require('../models/DiseaseLog');
const { analyzeDisease } = require('../services/geminiService');

exports.analyze = async (req, res, next) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const resultText = await analyzeDisease(imageBase64);

    // Save to log
    const log = await DiseaseLog.create({
      user: req.user.id,
      imageRef: 'base64_omitted_for_storage', // For prod, upload to S3 and save URL.
      rawResponse: resultText
    });

    res.status(200).json({
      success: true,
      data: {
        analysis: resultText,
        logId: log._id
      }
    });

  } catch (error) {
    next(error);
  }
};
