import mongoose from "mongoose";

// Fonction pour se connecter à MongoDB
const connectToMongo = async () => {
  try {
     const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;

    // Construction de l'URL de connexion
    const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}?retryWrites=true&w=majority`;
    
    await mongoose.connect(url); 

    console.log('MongoDB connected !');
  } catch (error) {
    console.error('MongoDB not connected :', error);
    throw error;
  }
};

export default connectToMongo;
