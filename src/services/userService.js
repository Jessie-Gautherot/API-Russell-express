import User from "../models/userModel.js";

/**
 * @typedef {Object} UserData
 * @property {string} name - Nom complet de l'utilisateur
 * @property {string} email - Email de l'utilisateur
 * @property {string} password - Mot de passe de l'utilisateur
 */

/**
 * Crée un nouvel utilisateur dans la base de données.
 *
 * @async
 * @param {UserData} userData - Données de l'utilisateur
 * @returns {Promise<User>} L'utilisateur créé
 * @throws {Error} Si des champs obligatoires sont manquants, email invalide ou déjà utilisé
 */

export const createUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("Tous les champs sont obligatoires");
  }

  // Vérification simple du format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email invalide");
  }

  // Vérification mot de passe minimum 6 caractères
  if (password.length < 6) {
    throw new Error("Le mot de passe doit faire au moins 6 caractères");
  }

  // Vérification email déjà utilisé
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Cet email est déjà utilisé");
  }

  // Création : hash du mot de passe géré par le model
  const user = new User({ name, email, password });
  return await user.save();
};

/**
 * Authentifie un utilisateur avec email et mot de passe.
 *
 * @async
 * @param {Object} credentials - Identifiants de l'utilisateur
 * @param {string} credentials.email - Email de l'utilisateur
 * @param {string} credentials.password - Mot de passe
 * @returns {Promise<User>} L'utilisateur authentifié
 * @throws {Error} Si email ou mot de passe incorrect
 */
export const authenticateUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email et mot de passe requis");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Identifiants invalides");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new Error("Identifiants invalides");

  return user;
};

/**
 * Récupère un utilisateur par son ID.
 *
 * @async
 * @param {string} id - ID MongoDB de l'utilisateur
 * @returns {Promise<User>} L'utilisateur trouvé
 * @throws {Error} Si aucun utilisateur trouvé
 */
export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error("Utilisateur non trouvé");
    err.status = 404;
    throw err;
  }

  return user;
};

/**
 * Met à jour un utilisateur existant.
 *
 * @async
 * @param {string} id - ID MongoDB de l'utilisateur
 * @param {Partial<UserData>} data - Données à mettre à jour (au moins un champ)
 * @returns {Promise<User>} L'utilisateur mis à jour
 * @throws {Error} Si utilisateur non trouvé
 */
export const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error("Utilisateur non trouvé");
    err.status = 404;
    throw err;
  }
  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;
  if (data.password) user.password = data.password; // hash automatique dans le model

  return await user.save();
};

/**
 * Supprime un utilisateur.
 *
 * @async
 * @param {string} id - ID MongoDB de l'utilisateur
 * @returns {Promise<User>} L'utilisateur supprimé
 * @throws {Error} Si utilisateur non trouvé
 */
export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const err = new Error("Utilisateur non trouvé");
    err.status = 404;
    throw err;
  }

  return user;
};
