import User from "../models/user.js";

//Créer un utilisateur
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

// Authentifier un utilisateur
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

//Récupérer un utilisateur par ID
export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("Utilisateur non trouvé");
  return user;
};

// Mettre à jour un utilisateur
export const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw new Error("Utilisateur non trouvé");

  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;
  if (data.password) user.password = data.password; // hash automatique dans le model

  return await user.save();
};

//Supprimer un utilisateur
export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("Utilisateur non trouvé");
  return user;
};
