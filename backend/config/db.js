const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ngo-volunteer-platform';
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Make sure MongoDB is running, or set MONGODB_URI in .env (e.g. MongoDB Atlas).');
    // Don't exit - server stays up so you can see the error and fix MongoDB
  }
};

module.exports = { connectDB };
