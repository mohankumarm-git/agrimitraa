const mandiService = require('../services/mandiService');

exports.getPrices = async (req, res, next) => {
  try {
    const { state, district, market, commodity } = req.query;
    
    // Construct filters
    const filters = {};
    if (state) filters.state = state;
    if (district) filters.district = district;
    if (market) filters.market = market;
    if (commodity) filters.commodity = commodity;
    else if (!state && !district && !market) {
      // Default filter if nothing is selected (focus on Tamil Nadu)
      filters.state = 'Tamil Nadu';
    }

    try {
      const prices = await mandiService.getMandiPrices(filters);
      res.status(200).json({ success: true, data: prices });
    } catch (e) {
      if (e.message === 'NO_DATA') {
        return res.status(404).json({ success: false, message: 'No market price available for this crop/market/date.' });
      }
      throw e;
    }

  } catch(err) {
    next(err);
  }
};

exports.getOptions = async (req, res, next) => {
  try {
    const { state } = req.query;
    const options = await mandiService.getFilterOptions(state || 'Tamil Nadu');
    res.status(200).json({ success: true, data: options });
  } catch(err) {
    next(err);
  }
};