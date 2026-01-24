/**
 * Envoie une réponse au client, soit en JSON (API / tests), soit en HTML (EJS) selon l'entête "Accept".
 *
 * @param {import("express").Request} req - La requête Express (pour détecter Accept et fournir data à la vue)
 * @param {import("express").Response} res - La réponse Express utilisée pour envoyer JSON ou rendre la vue
 * @param {Object} options - Options pour la réponse
 * @param {Object} [options.data={}] - Données à renvoyer ou à injecter dans la vue EJS
 * @param {string} [options.message=""] - Message de succès ou d'information
 * @param {number} [options.status=200] - Code HTTP à renvoyer
 * @param {string|null} [options.view=null] - Nom de la vue EJS à rendre si Accept HTML
 *
 * @throws {Error} Si le client attend du HTML mais qu'aucune vue n'est fournie
 *
 * @returns {void} Cette fonction envoie la réponse au client et ne retourne rien
 */
export const sendResponse = (req, res, { data = {}, message = "", status = 200, view = null }) => {
  // Vérifie si le client souhaite recevoir du HTML
  const wantsHTML = req.headers.accept?.includes("text/html");

  if (wantsHTML) {
    if (!view) throw new Error("Aucune vue fournie pour le rendu HTML"); 
    return res.status(status).render(view, { ...data, successMessage: message });
  }

  // Sinon, renvoie une réponse JSON tests
  return res.status(status).json({
    message,
    ...data
  });
};

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
