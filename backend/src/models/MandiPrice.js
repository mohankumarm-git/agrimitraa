const mongoose = require('mongoose');

const mandiPriceSchema = new mongoose.Schema({
  district: { type: String, required: true },
  cropNameEn: { type: String, required: true },
  cropNameTa: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  modalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MandiPrice', mandiPriceSchema);
