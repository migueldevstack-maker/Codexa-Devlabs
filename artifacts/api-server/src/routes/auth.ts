import { Router, type IRouter } from "express";
import jwt from "jsonwebtoken";

const router: IRouter = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "DVRKSMITH19WEB";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "fredsmithlegoat10";
const JWT_SECRET = process.env.JWT_SECRET ?? "codexa-devlabs-secret-2025";

router.post("/auth/login", (req, res) => {
  const { username, password } = req.body as { username: string; password: string };

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ message: "Identifiants incorrects" });
    return;
  }

  const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, success: true });
});

export function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Non autorisé" });
    return;
  }
  try {
    const token = authHeader.slice(7);
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
}

export default router;
