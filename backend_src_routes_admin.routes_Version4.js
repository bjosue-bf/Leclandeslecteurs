import { Router } from "express";
import User from "../models/User.js";
import File from "../models/File.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

// Voir tous les utilisateurs
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find({}, { password: 0 });
  res.json(users);
});

// Voir tous les fichiers
router.get("/files", requireAuth, requireAdmin, async (req, res) => {
  const files = await File.find().populate("owner", "username email");
  res.json(files);
});

// Promouvoir user en admin
router.post("/promote/:id", requireAuth, requireAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { role: "admin" });
  res.json({ message: "Utilisateur promu" });
});

// Supprimer un utilisateur
router.delete("/delete-user/:id", requireAuth, requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Utilisateur supprimé" });
});

// Supprimer un fichier
router.delete("/delete-file/:id", requireAuth, requireAdmin, async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ message: "Fichier supprimé" });
});

export default router;