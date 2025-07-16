import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull().unique(),
  consent: boolean("consent").default(false),
  browserInfo: text("browser_info"),
  permissions: text("permissions"),
  isActive: boolean("is_active").default(true),
  clientIP: text("client_ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingLogs = pgTable("training_logs", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  sessionId: true,
  consent: true,
  browserInfo: true,
  permissions: true,
  isActive: true,
  clientIP: true,
  userAgent: true,
});

export const insertTrainingLogSchema = createInsertSchema(trainingLogs).pick({
  sessionId: true,
  action: true,
  details: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type TrainingLog = typeof trainingLogs.$inferSelect;
export type InsertTrainingLog = z.infer<typeof insertTrainingLogSchema>;
