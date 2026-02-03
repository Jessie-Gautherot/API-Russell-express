/**
 * Filtre les informations sensibles d'un utilisateur pour ne renvoyer que l'essentiel.
 *
 * @param {import("../models/user.js").default} user - Document Mongoose de l'utilisateur
 * @returns {Object} Objet utilisateur sans mot de passe
 * @property {string} id - ID MongoDB de l'utilisateur
 * @property {string} name - Nom complet
 * @property {string} email - Email
 */
export const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});
