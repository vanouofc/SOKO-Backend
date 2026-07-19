import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import dotenv from "dotenv";
import DBconnection from "./config/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { sanitizeMiddleware } from "./middlewares/sanitize.middleware.js";
import boutiqueRouter from "./routes/boutiques.routes.js";
import produitRouter from "./routes/produits.routes.js";
import stockRouter from "./routes/stock.routes.js";
import venteRouter from "./routes/ventes.routes.js";
import perteRouter from "./routes/pertes.routes.js";
import utilisateurRouter from "./routes/utilisateurs.routes.js";
import swaggerUi from "swagger-ui-express";
import arcjectMiddleware from "./middlewares/arcjet.middleware.js";
import swaggerDocument from "./swagger-output.json" with {type: "json"};

dotenv.config();

const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("Veuillez renseigner le port du serveur.");
};

const app = express();

// app.use(arcjectMiddleware);

// CORS pour le front Flutter Web. IMPORTANT : avec credentials:true,
// origin ne peut PAS être "*" -> lister explicitement les origines
// autorisées (ex: le port du serveur de dev Flutter Web).
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5000,http://localhost:8080")
    .split(",")
    .map((o) => o.trim());

app.use(cors({
    origin: "http://localhost:61456",
    credentials: true,
}));

app.use("/api/auth/", toNodeHandler(auth));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(sanitizeMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/boutiques", boutiqueRouter);
app.use("/api/produits", produitRouter);
app.use("/api/stocks", stockRouter);
app.use("/api/ventes", venteRouter);
app.use("/api/pertes", perteRouter);
app.use("/api/utilisateurs", utilisateurRouter);
app.get("/", (req, res) => {
    res.send("Server started successfully");
});

app.use(errorMiddleware);

app.listen(PORT, async () => {
    await DBconnection();
    console.log(`Server is running on port ${PORT}`);
});