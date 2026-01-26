import app from "./src/app.js";
import connectToMongo from "./db/mongo.js";

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "default";
const IS_TEST = process.env.MOCHA === "true"; // vrai si on lance "npm test"

const startServer = async () => {
  console.log(`Démarrage du serveur (env: ${ENV})`);


  try {
    await connectToMongo();
    console.log(`MongoDB connecté (env: ${ENV})`);

    // Lancer le serveur seulement si on n'est pas en test
    if (!IS_TEST) {
      app.listen(PORT, () => {
        if (ENV === "production") {
          console.log(`Server running in PROD on port ${PORT}`);
        } else {
          console.log(`Server running in DEV sur http://localhost:${PORT}`);
        }
      });
    } else {
      console.log("Mode test : serveur non lancé, prêt pour Mocha/Chai-HTTP");
    }
   } catch (error) {
    console.error("Impossible de démarrer le serveur : Mongo non connecté", error);
    process.exit(1); // Stop le process si la DB n'est pas connectée
  }
};

// Démarrage du serveur
startServer();

// Export de l'instance Express pour les tests
export default app;



