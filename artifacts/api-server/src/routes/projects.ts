import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

// GET /api/projects — public
router.get("/projects", async (req, res) => {
  try {
    const projects = await db.select().from(projectsTable).orderBy(projectsTable.createdAt);
    // Map snake_case DB columns to camelCase for frontend
    res.json(projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      techTags: p.techTags,
      imageUrl: p.imageUrl,
      projectUrl: p.projectUrl,
      featured: p.featured,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list projects");
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/projects — admin only
router.post("/projects", requireAuth, async (req, res) => {
  try {
    const { title, description, category, techTags, imageUrl, projectUrl, featured } = req.body;
    const [project] = await db.insert(projectsTable).values({
      title,
      description: description ?? "",
      category: category ?? "Web",
      techTags: techTags ?? [],
      imageUrl: imageUrl ?? "",
      projectUrl: projectUrl ?? "",
      featured: featured ?? false,
    }).returning();
    res.status(201).json(project);
  } catch (err) {
    req.log.error({ err }, "Failed to create project");
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/projects/:id — admin only
router.put("/projects/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, category, techTags, imageUrl, projectUrl, featured } = req.body;

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (techTags !== undefined) updateData.techTags = techTags;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (projectUrl !== undefined) updateData.projectUrl = projectUrl;
    if (featured !== undefined) updateData.featured = featured;

    const [updated] = await db.update(projectsTable)
      .set(updateData)
      .where(eq(projectsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ message: "Projet introuvable" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update project");
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/projects/:id — admin only
router.delete("/projects/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [deleted] = await db.delete(projectsTable)
      .where(eq(projectsTable.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ message: "Projet introuvable" });
      return;
    }
    res.json({ success: true, message: "Projet supprimé" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete project");
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
