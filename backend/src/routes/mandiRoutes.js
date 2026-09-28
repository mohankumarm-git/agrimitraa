const express = require('express'); 
const router = express.Router(); 
const { getPrices, getOptions } = require('../controllers/mandiController'); 
const { protect } = require('../middleware/auth'); 

router.get('/', protect, getPrices); 
router.get('/options', protect, getOptions); 

module.exports = router;