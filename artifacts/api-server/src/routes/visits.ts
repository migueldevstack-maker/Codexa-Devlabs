import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { visitsTable } from "@workspace/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

// POST /api/visits — called from frontend on page load (public)
router.post("/visits", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    await db.insert(visitsTable)
      .values({ date: today, count: 1 })
      .onConflictDoUpdate({
        target: visitsTable.date,
        set: { count: sql`${visitsTable.count} + 1` },
      });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to track visit");
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/visits — admin only: last 30 days + total
router.get("/visits", requireAuth, async (req, res) => {
  try {
    const rows = await db.select().from(visitsTable).orderBy(desc(visitsTable.date)).limit(30);
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    res.json({ rows, total });
  } catch (err) {
    req.log.error({ err }, "Failed to get visits");
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
