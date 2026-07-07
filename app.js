import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import dotenv from "dotenv";
import DBconnection from "./config/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import boutiqueRouter from "./routes/boutiques.routes.js";
import produitRouter from "./routes/produits.routes.js";
import stockRouter from "./routes/stock.routes.js";
import venteRouter from "./routes/ventes.routes.js";

dotenv.config();

const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("Veuillez renseigner le port du serveur.");
};

const app = express();

app.use("/api/auth/", toNodeHandler(auth));

app.use(express.json());

app.use("/api/boutiques", boutiqueRouter);
app.use("/api/produits", produitRouter);
app.use("/api/stocks", stockRouter);
app.use("/api/ventes", venteRouter);
app.get("/", (req, res) => {
    res.send("Server started successfully");
});

app.use(errorMiddleware);

app.listen(PORT, async () => {
    await DBconnection();
    console.log(`Server is running on port ${PORT}`);
});