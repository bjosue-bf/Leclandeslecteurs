import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import path from "path";
import fs from "fs";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if(await User.findOne({email})) return res.status(400).json({message:"Email déjà utilisé"});
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({message:"Utilisateur créé"});
  } catch (e) {
    res.status(500).json({message:"Erreur serveur"});
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message:"Utilisateur introuvable"});
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({message:"Mot de passe invalide"});
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (e) {
    res.status(500).json({message:"Erreur serveur"});
  }
});

// Auth me
router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Non autorisé" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, role: user.role } });
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
});

// Changer le mot de passe
router.post("/change-password", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Non autorisé" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(req.body.password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    res.json({ message: "Mot de passe modifié" });
  } catch {
    res.status(400).json({ message: "Erreur" });
  }
});

// Upload avatar
router.post("/upload-avatar", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Non autorisé" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    if (!req.files || !req.files.avatar) return res.status(400).json({ message: "Aucun fichier" });
    const file = req.files.avatar;
    const ext = path.extname(file.name);
    const avatarDir = path.resolve("uploads", "avatars");
    if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
    const filename = decoded.id + ext;
    const savePath = path.join(avatarDir, filename);
    await file.mv(savePath);
    await User.findByIdAndUpdate(decoded.id, { avatar: `/uploads/avatars/${filename}` });
    res.json({ message: "Avatar modifié" });
  } catch {
    res.status(400).json({ message: "Erreur" });
  }
});

export default router;