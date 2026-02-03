import {createCatway, getAllCatways, getCatwayById, updateCatway, patchCatwayState, deleteCatway} from "../services/catwayService.js";



/**
 * Crée un nouveau catway
 * Route : POST /catways
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {Object} req.body - Données du catway à créer
 *   @property {number} req.body.catwayNumber - Numéro unique du catway
 *   @property {"long"|"short"} req.body.type - Type du catway
 *   @property {string} req.body.catwayState - État initial du catway
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie la réponse JSON ou HTML
 */
export const createCatwayController = async (req, res, next) => {
  try {
    const catway = await createCatway(req.body);
    
    // succès JSON pour tests automatisés
    if (req.accepts("json")) {
      return res.status(201).json({
        message: "Catway créé",
        catway
      });
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("dashboard", {
      successMessage: "Catway créé"
    });
  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Récupère tous les catways
 * Route : GET /catways
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 * @param {import("express").Response} res - Réponse Express contenant la liste des catways
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie la liste de tous les catways en JSON ou rendue en HTML
 */
export const getAllCatwaysController = async (req, res, next) => {
  try {
    const catways = await getAllCatways();
    
    // succès json (tests automatisés)
    if (req.accepts("json")) {
      return res.json({ catways }); 
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("catways", { catways }); 
  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "catways" }; 
    next(error);
  }
};

/**
 * Récupère un catway par son ID
 * Route : GET /catways/:id
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID du catway à récupérer
 * @param {import("express").Response} res - Réponse Express contenant le catway
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie le catway demandé en JSON ou rendue en HTML
 */
export const getCatwayByIdController = async (req, res, next) => {
  try {
    const catway = await getCatwayById(req.params.id);
    // succès json (tests automatisés)
    if (req.accepts("json")) {
      return res.json({ catway }); 
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("catway", { catway }); 
  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "catway" }; 
    next(error);
  }
};

/**
 * Mise à jour complète d'un catway
 * Route : PUT /catways/:id
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID du catway à mettre à jour
 *   @property {Object} req.body - Nouvelles données du catway
 *   @property {number} req.body.catwayNumber - Numéro unique du catway
 *   @property {"long"|"short"} req.body.type - Type du catway
 *   @property {string} req.body.catwayState - État du catway
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie le catway mis à jour en JSON ou rendue en HTML
 */
export const updateCatwayController = async (req, res, next) => {
  try {
    const catway = await updateCatway(req.params.id, req.body);

    // succès json (tests automatisés)
    if (req.accepts("json")) {
      return res.json({
        message: "Catway mis à jour", 
        catway 
      });
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("dashboard", {
      successMessage: "Catway mis à jour" 
    });
  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Met à jour uniquement l'état d'un catway
 * Route : PATCH /catways/:id
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID du catway à mettre à jour
 *   @property {Object} req.body - Contient l'état à mettre à jour
 *   @property {string} req.body.catwayState - Nouvel état du catway
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie le catway mis à jour en JSON ou rendue en HTML
 */
export const patchCatwayStateController = async (req, res, next) => {
  try {
    const { catwayState } = req.body;
    const catway = await patchCatwayState(req.params.id, catwayState);
     // succès json (tests automatisés)
    if (req.accepts("json")) {
      return res.json({
        message: "État du catway mis à jour", 
        catway 
      });
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("dashboard", {
      successMessage: "État du catway mis à jour" 
    });
  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Supprime un catway
 * Route : DELETE /catways/:id
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID du catway à supprimer
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie le catway supprimé en JSON ou rendue en HTML
 */
export const deleteCatwayController = async (req, res, next) => {
  try {
    const catway = await deleteCatway(req.params.id);

     // succès json (tests automatisés)
    if (req.accepts("json")) {
      return res.json({
        message: "Catway supprimé", 
        catway 
      });
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("dashboard", {
      successMessage: "Catway supprimé" 
    });
  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "dashboard" }; 
    next(error);
  }
};
