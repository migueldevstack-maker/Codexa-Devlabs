import { pgTable, serial, date, integer } from "drizzle-orm/pg-core";

export const visitsTable = pgTable("visits", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  count: integer("count").notNull().default(0),
});

export type Visit = typeof visitsTable.$inferSelect;
