// config/mongoose.js

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB'); // Success message
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error); // Error message
    process.exit(1); // Exit the script on database connection error
  }
}

module.exports = {
  connectToDatabase,
};
