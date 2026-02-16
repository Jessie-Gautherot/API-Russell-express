import mongoose from "mongoose";

// Singleton pour serverless / Vercel
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectToMongo = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;

    // Construction de l'URL de connexion
    const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}?retryWrites=true&w=majority`;
    console.log("Tentative de connexion à MongoDB avec", url);

    cached.promise = mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      console.log("MongoDB connected !");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB not connected :", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectToMongo;
