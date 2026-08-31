const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  nameEn: { type: String, required: true },
  nameTa: { type: String, required: true },
  season: [{ type: String, enum: ['Kharif', 'Rabi', 'Summer'] }],
  soilType: [{ type: String, enum: ['Red soil', 'Black soil', 'Alluvial', 'Laterite', 'Sandy'] }],
  waterRequirement: { type: String, enum: ['Low', 'Medium', 'High'] },
  durationDays: { type: Number, required: true },
  iconUrl: { type: String },
  matchReasonEn: { type: String },
  matchReasonTa: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
