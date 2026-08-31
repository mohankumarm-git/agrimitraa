require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const MandiPrice = require('../models/MandiPrice');

const crops = [
  {
    nameEn: 'Rice (Paddy)',
    nameTa: 'நெல்',
    season: ['Kharif', 'Rabi', 'Summer'],
    soilType: ['Alluvial', 'Black soil', 'Red soil'],
    waterRequirement: 'High',
    durationDays: 120,
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5341/5341258.png',
    matchReasonEn: 'Excellent match for current high water availability and season.',
    matchReasonTa: 'தற்போதைய நீர் இருப்பு மற்றும் பருவத்திற்கு மிகச் சிறந்த தேர்வு.'
  },
  {
    nameEn: 'Millets (Ragi/Cumbu)',
    nameTa: 'சிறுதானியங்கள் (கேழ்வரகு/கம்பு)',
    season: ['Kharif', 'Summer'],
    soilType: ['Red soil', 'Sandy', 'Laterite'],
    waterRequirement: 'Low',
    durationDays: 90,
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6890/6890666.png',
    matchReasonEn: 'Great for low rainfall conditions and selected soil.',
    matchReasonTa: 'குறைந்த மழைப்பொழிவு மற்றும் உங்கள் மண்ணுக்கு ஏற்றது.'
  },
  {
    nameEn: 'Cotton',
    nameTa: 'பருத்தி',
    season: ['Kharif'],
    soilType: ['Black soil'],
    waterRequirement: 'Medium',
    durationDays: 150,
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/527/527871.png',
    matchReasonEn: 'Optimal for black soil and medium rainfall.',
    matchReasonTa: 'கரிசல் மண் மற்றும் மிதமான மழைக்கு உகந்தது.'
  },
  {
    nameEn: 'Groundnut',
    nameTa: 'நிலக்கடலை',
    season: ['Kharif', 'Rabi'],
    soilType: ['Red soil', 'Sandy'],
    waterRequirement: 'Medium',
    durationDays: 105,
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2917/2917894.png',
    matchReasonEn: 'Grows well in sandy/red soil with moderate water.',
    matchReasonTa: 'செம்மண் மற்றும் மணற்பாங்கான நிலங்களில் நன்கு வளரும்.'
  },
  {
    nameEn: 'Sugarcane',
    nameTa: 'கரும்பு',
    season: ['Kharif'],
    soilType: ['Alluvial', 'Black soil', 'Red soil'],
    waterRequirement: 'High',
    durationDays: 300,
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/10398/10398072.png',
    matchReasonEn: 'Suitable if you have heavy irrigation facilities.',
    matchReasonTa: 'அதிக நீர்ப்பாசன வசதி இருந்தால் இது மிகவும் ஏற்றது.'
  }
];

const mandiPrices = [
  { district: 'Chennai', cropNameEn: 'Paddy', cropNameTa: 'நெல்', minPrice: 2000, maxPrice: 2200, modalPrice: 2100 },
  { district: 'Chennai', cropNameEn: 'Cotton', cropNameTa: 'பருத்தி', minPrice: 5000, maxPrice: 6000, modalPrice: 5500 },
  { district: 'Madurai', cropNameEn: 'Tomato', cropNameTa: 'தக்காளி', minPrice: 1500, maxPrice: 3000, modalPrice: 2200 },
  { district: 'Coimbatore', cropNameEn: 'Onion', cropNameTa: 'வெங்காயம்', minPrice: 3000, maxPrice: 4000, modalPrice: 3500 },
  { district: 'Salem', cropNameEn: 'Groundnut', cropNameTa: 'நிலக்கடலை', minPrice: 6000, maxPrice: 7500, modalPrice: 6800 }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('No MONGODB_URI found. Skipping seed.');
      return process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    await Crop.deleteMany();
    await Crop.insertMany(crops);
    console.log('Crops seeded successfully!');

    await MandiPrice.deleteMany();
    await MandiPrice.insertMany(mandiPrices);
    console.log('Mandi prices seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
