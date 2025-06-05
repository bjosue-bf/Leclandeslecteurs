import { Router } from "express";
import File from "../models/File.js";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

function getUserIdFromToken(auth) {
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

// Upload un fichier (auth obligatoire)
router.post("/upload", requireAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.file) return res.status(400).json({message:"Aucun fichier."});
    const file = req.files.file;
    const uploadDir = path.resolve("uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    const savePath = path.join(uploadDir, Date.now() + "-" + file.name);
    await file.mv(savePath);

    const tags = req.body.tags?.split(",").map(t => t.trim()).filter(Boolean) || [];
    const owner = req.user._id;

    const fileDoc = await File.create({
      filename: path.basename(savePath),
      originalname: file.name,
      url: `/uploads/${path.basename(savePath)}`,
      type: file.mimetype,
      size: file.size,
      owner,
      category: req.body.category || "autre",
      description: req.body.description || "",
      tags,
    });

    res.status(201).json({message:"Upload réussi", file: fileDoc});
  } catch (e) {
    res.status(500).json({message:"Erreur upload"});
  }
});

// Liste tous les fichiers (publique)
router.get("/", async (req, res) => {
  const files = await File.find().sort({createdAt:-1});
  res.json(files);
});

// Liste fichiers d'un utilisateur (auth obligatoire)
router.get("/user/:userid", requireAuth, async (req, res) => {
  const files = await File.find({ owner: req.params.userid }).sort({ createdAt: -1 });
  res.json(files);
});

export default router;