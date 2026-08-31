const mongoose = require('mongoose');

const diseaseLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageRef: { type: String, required: true }, // base64 or URL
  diseaseName: { type: String },
  severity: { type: String },
  treatment: { type: String },
  rawResponse: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('DiseaseLog', diseaseLogSchema);
