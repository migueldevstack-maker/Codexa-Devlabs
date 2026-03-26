import { pgTable, serial, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("contact"), // "contact" | "project_request"
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").default(""),
  message: text("message").default(""),
  extraData: jsonb("extra_data"), // pour les données du formulaire projet
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Message = typeof messagesTable.$inferSelect;
export type InsertMessage = typeof messagesTable.$inferInsert;
