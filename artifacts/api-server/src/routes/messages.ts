import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

// POST /api/messages — public (called from contact form & project modal)
router.post("/messages", async (req, res) => {
  try {
    const { type, name, email, phone, message, extraData } = req.body;
    const [saved] = await db.insert(messagesTable).values({
      type: type ?? "contact",
      name: name ?? "",
      email: email ?? "",
      phone: phone ?? "",
      message: message ?? "",
      extraData: extraData ?? null,
    }).returning();
    res.status(201).json({ success: true, id: saved.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save message");
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/messages — admin only
router.get("/messages", requireAuth, async (req, res) => {
  try {
    const messages = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/messages/:id/read — mark as read, admin only
router.put("/messages/:id/read", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db.update(messagesTable)
      .set({ read: true })
      .where(eq(messagesTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ message: "Message introuvable" }); return; }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/messages/:id — admin only
router.delete("/messages/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [deleted] = await db.delete(messagesTable).where(eq(messagesTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ message: "Message introuvable" }); return; }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
