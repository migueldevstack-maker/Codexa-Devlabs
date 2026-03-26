import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { requireAuth } from "./auth";

const router: IRouter = Router();

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Format non supporté. Utilisez JPG, PNG, WebP ou GIF."));
  },
});

router.post("/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "Aucun fichier reçu" });
    return;
  }
  const fileUrl = `/api/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

export default router;
