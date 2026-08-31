const VoiceQuery = require('../models/VoiceQuery');
const { answerVoiceQuery } = require('../services/geminiService');

exports.query = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Query text is required' });
    }

    const answer = await answerVoiceQuery(text);

    await VoiceQuery.create({
      user: req.user.id,
      queryText: text,
      responseText: answer
    });

    res.status(200).json({
      success: true,
      data: {
        reply: answer
      }
    });

  } catch (error) {
    next(error);
  }
};
