import { pgTable, text, serial, timestamp, real, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const birthData = pgTable("birth_data", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id).notNull(),
  birthDate: text("birth_date").notNull(),
  birthTime: text("birth_time").notNull(),
  timezone: text("timezone").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  systems: json("systems").$type<{
    western: boolean;
    vedic: boolean;
    chinese: boolean;
    humanDesign: boolean;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const charts = pgTable("charts", {
  id: serial("id").primaryKey(),
  birthDataId: serial("birth_data_id").references(() => birthData.id).notNull(),
  chartType: text("chart_type").notNull(), // 'natal', 'compatibility', 'transit'
  chartData: json("chart_data").notNull(),
  interpretations: json("interpretations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const compatibility = pgTable("compatibility", {
  id: serial("id").primaryKey(),
  primaryUserId: serial("primary_user_id").references(() => users.id).notNull(),
  partnerUserIds: json("partner_user_ids").$type<number[]>().notNull(),
  compatibilityScore: real("compatibility_score").notNull(),
  systemScores: json("system_scores").$type<{
    western: number;
    vedic: number;
    chinese: number;
    humanDesign: number;
  }>().notNull(),
  analysis: json("analysis").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyGuidance = pgTable("daily_guidance", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  horoscope: json("horoscope").notNull(),
  transits: json("transits").notNull(),
  optimalTiming: json("optimal_timing").notNull(),
  luckyElements: json("lucky_elements").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertBirthDataSchema = createInsertSchema(birthData).omit({
  id: true,
  createdAt: true,
});

export const insertChartSchema = createInsertSchema(charts).omit({
  id: true,
  createdAt: true,
});

export const insertCompatibilitySchema = createInsertSchema(compatibility).omit({
  id: true,
  createdAt: true,
});

export const insertDailyGuidanceSchema = createInsertSchema(dailyGuidance).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BirthData = typeof birthData.$inferSelect;
export type InsertBirthData = z.infer<typeof insertBirthDataSchema>;
export type Chart = typeof charts.$inferSelect;
export type InsertChart = z.infer<typeof insertChartSchema>;
export type Compatibility = typeof compatibility.$inferSelect;
export type InsertCompatibility = z.infer<typeof insertCompatibilitySchema>;
export type DailyGuidance = typeof dailyGuidance.$inferSelect;
export type InsertDailyGuidance = z.infer<typeof insertDailyGuidanceSchema>;
