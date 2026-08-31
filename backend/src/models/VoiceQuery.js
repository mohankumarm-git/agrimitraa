const mongoose = require('mongoose');

const voiceQuerySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  queryText: { type: String, required: true },
  responseText: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('VoiceQuery', voiceQuerySchema);
