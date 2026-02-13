import Catway from "../models/catwayModel.js";

/**
 * Crée un nouveau catway.
 * Route : POST /catways
 *
 * @async
 * @param {Object} catwayData - Données du catway à créer
 * @param {number} catwayData.catwayNumber - Numéro unique du catway
 * @param {string} catwayData.type - Type du catway ("long" ou "short")
 * @param {string} catwayData.catwayState - Description de l'état du catway
 * @returns {Promise<Catway>} Le catway créé
 * @throws {Error} Si un champ est manquant, le type est invalide ou le numéro existe déjà
 */
export const createCatway = async ({ catwayNumber, type, catwayState }) => {
  // Vérifier que tous les champs sont fournis
  if (![catwayNumber, type, catwayState].every(Boolean)) {
    throw new Error("Tous les champs sont obligatoires");
  }

  // Vérifier que le type est valide
  const allowedTypes = ["long", "short"];
  if (!allowedTypes.includes(type)) {
    throw new Error(`Le type doit être l'un de: ${allowedTypes.join(", ")}`);
  }

  // Vérifier que le numéro de catway n'existe pas déjà
  const existing = await Catway.findOne({ catwayNumber });
  if (existing) throw new Error("Ce numéro de catway existe déjà");

  // Création et sauvegarde
  const catway = new Catway({ catwayNumber, type, catwayState });
  return await catway.save();
};

/**
 * Récupère tous les catways.
 * Route : GET /catways
 *
 * @async
 * @returns {Promise<Catway[]>} Liste de tous les catways triée par numéro
 */
export const getAllCatways = async () => {
  return await Catway.find().sort({ catwayNumber: 1 });
};

/**
 * Récupère un catway par son ID.
 * Route : GET /catways/:id
 *
 * @async
 * @param {string} id - ID MongoDB du catway
 * @returns {Promise<Catway>} Le catway trouvé
 * @throws {Error} Si aucun catway n'est trouvé avec cet ID
 */
export const getCatwayById = async (id) => {
  const catway = await Catway.findById(id);
  if (!catway) {
    const err = new Error("Catway non trouvé");
    err.status = 404;
    throw err;
  }

  return catway;
};

/**
 * Mise à jour complète d'un catway.
 * Route : PUT /catways/:id
 *
 * @async
 * @param {string} id - ID MongoDB du catway à mettre à jour
 * @param {Object} data - Données à mettre à jour
 * @param {number} [data.catwayNumber] - Numéro du catway (unique)
 * @param {string} [data.type] - Type du catway ("long" ou "short")
 * @param {string} [data.catwayState] - Description de l'état
 * @returns {Promise<Catway>} Le catway mis à jour
 * @throws {Error} Si le catway n'existe pas ou si le type est invalide
 */
export const updateCatway = async (id, data) => {
  const catway = await Catway.findById(id);
  if (!catway) {
    const err = new Error("Catway non trouvé");
    err.status = 404;
    throw err;
  }
  // Vérifier et mettre à jour catwayNumber
  if ("catwayNumber" in data && data.catwayNumber != null) {
    // Si le numéro est différent de l'actuel, vérifier unicité
    if (data.catwayNumber !== catway.catwayNumber) {
      const existing = await Catway.findOne({ catwayNumber: data.catwayNumber });
      if (existing) throw new Error("Ce numéro de catway existe déjà");
    }
    catway.catwayNumber = data.catwayNumber;
  }

  // Mettre à jour catwayState
  if ("catwayState" in data && data.catwayState) {
    catway.catwayState = data.catwayState;
  }

  // Mettre à jour type
  if ("type" in data && data.type) {
    const allowedTypes = ["long", "short"];
    if (!allowedTypes.includes(data.type)) {
      throw new Error(`Le type doit être l'un de: ${allowedTypes.join(", ")}`);
    }
    catway.type = data.type;
  }

  return await catway.save();
};


/**
 * Met à jour uniquement l'état du catway.
 * Route : PATCH /catways/:id
 *
 * @async
 * @param {string} id - ID MongoDB du catway à mettre à jour
 * @param {string} catwayState - Nouvelle description de l'état
 * @returns {Promise<Catway>} Le catway mis à jour
 * @throws {Error} Si le catway n'existe pas ou si catwayState est vide
 */
export const patchCatwayState = async (id, catwayState) => {
  if (!catwayState) throw new Error("Le champ catwayState est requis");

  const catway = await Catway.findById(id);
  if (!catway) {
    const err = new Error("Catway non trouvé");
    err.status = 404;
    throw err;
  }

  catway.catwayState = catwayState;
  return await catway.save();
};

/**
 * Supprime un catway.
 * Route : DELETE /catways/:id
 *
 * @async
 * @param {string} id - ID MongoDB du catway à supprimer
 * @returns {Promise<Catway>} Le catway supprimé
 * @throws {Error} Si aucun catway n'est trouvé avec cet ID
 */
export const deleteCatway = async (id) => {
  const catway = await Catway.findByIdAndDelete(id);
  if (!catway) {
    const err = new Error("Catway non trouvé");
    err.status = 404;
    throw err;
  }

  return catway;
};
