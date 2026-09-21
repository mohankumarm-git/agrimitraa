const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://agrimitra_admin:AgriMitraSecurePassword2026@cluster0.b68q8iz.mongodb.net/agrimitra?appName=Cluster0";

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
    matchReasonTa: 'தற்போதைய நீர் இருப்பு மற்றும் பருவத்திற்கு சிறந்த தேர்வு.'
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
    matchReasonTa: 'குறைந்த மழைப்பொழிவு மற்றும் தேர்ந்தெடுக்கப்பட்ட மண்ணுக்கு சிறந்தது.'
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
    matchReasonTa: 'செம்மண்/மணற்பாங்கான மண்ணில் மிதமான நீருடன் நன்றாக வளரும்.'
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
    matchReasonTa: 'உங்களிடம் அதிக நீர்ப்பாசன வசதிகள் இருந்தால் இது ஏற்றது.'
  }
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const database = client.db("agrimitra");
    const cropsCollection = database.collection("crops");

    await cropsCollection.deleteMany({});
    const result = await cropsCollection.insertMany(crops);
    
    console.log(`${result.insertedCount} crops were inserted`);
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);