const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  commodity: { type: String, required: true, index: true },
  variety: { type: String },
  grade: { type: String },
  state: { type: String, required: true, index: true },
  district: { type: String, required: true, index: true },
  market: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  unit: { type: String, required: true },
  min_price: { type: Number, required: true },
  modal_price: { type: Number, required: true },
  max_price: { type: Number, required: true },
  source: { type: String, default: 'data.gov.in' },
  source_record_id: { type: String },
}, { timestamps: true });

// Prevent duplicate prices for the same crop, market, and date
marketPriceSchema.index({ commodity: 1, variety: 1, market: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);