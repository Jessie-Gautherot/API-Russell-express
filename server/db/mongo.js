const mongoose = require('mongoose');

// Fonction pour se connecter à MongoDB
const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, {
    });
    console.log('MongoDB connected !');
  } catch (error) {
    console.error('MongoDB not connected :', error);
    throw error;
  }
};

module.exports = connectToMongo;
