const express = require('express');
const connectToMongo = require('./db/mongo');

const app = express();

// Récupération des variables d'environnement
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'default';

// Middleware pour parser le JSON
app.use(express.json());

// Route de test / accueil
app.get('/', (req, res) => {
  res.send('Hello world!!!!!!');
});

// Fonction pour démarrer le serveur après connexion Mongo
const startServer = async () => {
  console.log('Démarrage du serveur… connexion à MongoDB en cours');
  try {
    await connectToMongo();
    console.log('Connexion MongoDB OK');

    app.listen(PORT, () => {
      if (ENV === 'production') {
        console.log(`Server running in PROD on port ${PORT}`);
      } else if (ENV === 'development') {
        console.log(`Server running in DEV on http://localhost:${PORT}`);
      } else {
        console.log(`Server running on port ${PORT} (default env)`);
      }
    });

  } catch (error) {
    console.error('Impossible de démarrer le serveur : Mongo non connecté');
    console.error(error);
    process.exit(1); // Stoppe Node si Mongo échoue
  }
};

// En dev, on peut afficher un log tout de suite pour Nodemon
if (ENV === 'development') {
  console.log('Mode DEV activé');
}

// Démarrage du serveur
startServer();


