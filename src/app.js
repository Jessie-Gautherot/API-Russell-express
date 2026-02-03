import express from "express";
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

// Routes views EJS
app.use(viewRoutes);
// Routes API
app.use(authRoutes);
app.use(userRoutes);
app.use(catwayRoutes);
app.use(reservationRoutes);

//On utilise ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


// Middleware global de gestion des erreurs (TOUJOURS À LA FIN)
app.use(errorMiddleware);

export default app;
