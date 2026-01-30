import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import catwayRoutes from "./routes/catwayRoutes.js"
import reservationRoutes from "./routes/reservationRoutes.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes API
app.use(authRoutes);
app.use(userRoutes);
app.use(catwayRoutes);
app.use(reservationRoutes);

// Route /accueil
app.get("/", (req, res) => {
  res.send("Hello world!!!!!!");
});

// Middleware global de gestion des erreurs (TOUJOURS À LA FIN)
app.use(errorMiddleware);

export default app;
