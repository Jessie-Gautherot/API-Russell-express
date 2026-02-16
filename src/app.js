import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import catwayRoutes from "./routes/catwayRoutes.js"
import reservationRoutes from "./routes/reservationRoutes.js"
import viewRoutes from "./routes/viewRoutes.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
// Pour formulaire html
app.use(express.urlencoded({ extended: true }));
// Pour utiliser cookies
app.use(cookieParser());
// fichier static
app.use(express.static(path.join(__dirname, 'public')));
//On utilise ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

// Routes API
app.use(authRoutes);
app.use(userRoutes);
app.use(catwayRoutes);
app.use(reservationRoutes);

// Routes views EJS
app.use(viewRoutes);

// Middleware global de gestion des erreurs 
app.use(errorMiddleware);

export default app;
