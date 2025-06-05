import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Pour __dirname avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log("MongoDB connected"))
  .catch(err=>console.error("MongoDB error:", err));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/admin", adminRoutes);

// Fichiers statiques (pour les téléchargements et avatars)
app.use("/uploads", express.static(path.resolve(__dirname, "../../uploads")));

// 404
app.use((req,res)=>res.status(404).json({message:"Not found"}));

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));