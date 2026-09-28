const axios = require('axios');
const MarketPrice = require('../models/MarketPrice');

const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

/**
 * Normalizes a date string from data.gov.in (usually DD/MM/YYYY) to a Date object.
 */
const parseDate = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    // DD/MM/YYYY -> YYYY-MM-DD
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
  }
  return new Date(dateStr);
};

exports.syncMandiPrices = async (filters = {}) => {
  const apiKey = process.env.DATA_GOV_API_KEY;
  
  if (!apiKey) {
    console.warn('DATA_GOV_API_KEY is not set. Skipping live fetch and using cached data.');
    return;
  }

  try {
    const params = {
      'api-key': apiKey,
      format: 'json',
      limit: 100, // Fetch up to 100 latest records for the filter
    };

    if (filters.state) params['filters[state]'] = filters.state;
    if (filters.district) params['filters[district]'] = filters.district;
    if (filters.market) params['filters[market]'] = filters.market;
    if (filters.commodity) params['filters[commodity]'] = filters.commodity;

    const response = await axios.get(DATA_GOV_API_URL, { params, timeout: 10000 });
    
    if (response.data && response.data.records) {
      const records = response.data.records;
      
      const bulkOps = records.map(record => {
        // Data Normalization
        const minPrice = parseFloat(record.min_price) || 0;
        const maxPrice = parseFloat(record.max_price) || 0;
        const modalPrice = parseFloat(record.modal_price) || 0;
        
        // Ensure Min <= Modal <= Max (Basic validation)
        const validMin = Math.min(minPrice, modalPrice, maxPrice);
        const validMax = Math.max(minPrice, modalPrice, maxPrice);
        const validModal = (modalPrice >= validMin && modalPrice <= validMax) ? modalPrice : ((validMin + validMax) / 2);

        const marketDate = parseDate(record.arrival_date);

        return {
          updateOne: {
            filter: {
              commodity: record.commodity,
              variety: record.variety || 'Other',
              market: record.market,
              date: marketDate
            },
            update: {
              $set: {
                commodity: record.commodity,
                variety: record.variety || 'Other',
                grade: record.grade || 'FAQ',
                state: record.state,
                district: record.district,
                market: record.market,
                date: marketDate,
                unit: 'Quintal', // data.gov.in prices are typically per Quintal
                min_price: validMin,
                modal_price: validModal,
                max_price: validMax,
                source: 'data.gov.in (AGMARKNET)',
                last_updated: new Date()
              }
            },
            upsert: true
          }
        };
      });

      if (bulkOps.length > 0) {
        await MarketPrice.bulkWrite(bulkOps, { ordered: false });
        console.log(`Synced ${bulkOps.length} mandi records to database.`);
      }
    }
  } catch (error) {
    console.error('Failed to sync live mandi prices:', error.message);
    // We swallow the error so it can gracefully fallback to cached data
  }
};

exports.getMandiPrices = async (filters = {}) => {
  // First, attempt to sync latest data in the background
  await this.syncMandiPrices(filters);

  // Then fetch from our DB cache
  const dbQuery = {};
  if (filters.state) dbQuery.state = { $regex: new RegExp(`^${filters.state}$`, 'i') };
  if (filters.district) dbQuery.district = { $regex: new RegExp(`^${filters.district}$`, 'i') };
  if (filters.market) dbQuery.market = { $regex: new RegExp(`^${filters.market}$`, 'i') };
  if (filters.commodity) dbQuery.commodity = { $regex: new RegExp(`^${filters.commodity}$`, 'i') };

  // Get the most recent 50 prices matching criteria
  const prices = await MarketPrice.find(dbQuery).sort({ date: -1, createdAt: -1 }).limit(50);
  
  if (prices.length === 0) {
    throw new Error('NO_DATA');
  }

  return prices;
};

exports.getFilterOptions = async (state) => {
  const match = state ? { state: { $regex: new RegExp(`^${state}$`, 'i') } } : {};
  
  const districts = await MarketPrice.distinct('district', match);
  const markets = await MarketPrice.distinct('market', match);
  const commodities = await MarketPrice.distinct('commodity', match);

  return { districts, markets, commodities };
};