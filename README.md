# API Privée – RUSSEL

## 1. Présentation

Cette API privée est un TP réalisé avec **Express** pour la gestion des **catways** et des **réservations** du port de plaisance Russell.  
Elle utilise une base **MongoDB**.

L’API permet de :

- Créer, lister, modifier et supprimer des **catways**  
- Enregistrer, afficher et supprimer des **réservations**  
- Gérer les utilisateurs avec **authentification JWT**  
- Consulter la documentation de l’API via l’application

---

## 2. Utilisateurs

### Gestion des utilisateurs

- Mise en place d’un système d’**authentification** via **JWT** (JSON Web Token)  
- Les utilisateurs se connectent via **email** et **mot de passe**  
- Les routes sensibles sont protégées par un middleware d’authentification

---

## 3. Installation

### Cloner le projet et lancer les commandes
```bash
# Cloner le projet
git clone https://github.com/Jessie-Gautherot/API-Russell-express
cd API-Russell-express

# Installer les dépendances
npm install

# Lancer les tests sur la base de test
npm run test

# Démarrer le serveur sur la base principale
npm run start
```

---

## 4. Connexion

Pour tester l’application, vous pouvez utiliser l’utilisateur suivant :

- **Email** : capitaine2@capitainerie.com  
- **Password** : capitainecatway2

---


