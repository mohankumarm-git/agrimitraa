const express = require('express');
const router = express.Router();
const { suggestCrops } = require('../controllers/cropController');
const { protect } = require('../middleware/auth');

router.post('/suggest', protect, suggestCrops);

module.exports = router;
