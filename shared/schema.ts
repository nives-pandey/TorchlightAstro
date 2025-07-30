import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  numeric,
  boolean,
  real
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const birthData = pgTable("birth_data", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  birthDate: text("birth_date").notNull(),
  birthTime: text("birth_time").notNull(),
  timezone: text("timezone").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  systems: jsonb("systems").$type<{
    western: boolean;
    vedic: boolean;
    chinese: boolean;
    humanDesign: boolean;
    numerology: boolean;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const charts = pgTable("charts", {
  id: serial("id").primaryKey(),
  birthDataId: integer("birth_data_id").references(() => birthData.id).notNull(),
  chartType: text("chart_type").notNull(), // 'western', 'vedic', 'chinese', 'human-design'
  chartData: jsonb("chart_data").notNull(),
  interpretations: jsonb("interpretations"),
  lifestyleRecommendations: jsonb("lifestyle_recommendations"), // Comprehensive lifestyle guidance
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const compatibility = pgTable("compatibility", {
  id: serial("id").primaryKey(),
  primaryUserId: varchar("primary_user_id").references(() => users.id).notNull(),
  partnerUserIds: jsonb("partner_user_ids").$type<string[]>().notNull(),
  compatibilityScore: real("compatibility_score").notNull(),
  systemScores: jsonb("system_scores").$type<{
    western: number;
    vedic: number;
    chinese: number;
    humanDesign: number;
    numerology: number;
  }>().notNull(),
  analysis: jsonb("analysis").notNull(),
  systemComparisons: jsonb("system_comparisons"), // Cross-system analysis
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyGuidance = pgTable("daily_guidance", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  horoscope: jsonb("horoscope").notNull(),
  transits: jsonb("transits").notNull(),
  optimalTiming: jsonb("optimal_timing").notNull(),
  luckyElements: jsonb("lucky_elements").notNull(),
  systemInsights: jsonb("system_insights"), // Multi-system daily insights
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comparative analysis table for cross-system insights
export const systemComparisons = pgTable("system_comparisons", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  chartId: integer("chart_id").references(() => charts.id).notNull(),
  westernTraits: jsonb("western_traits"),
  vedicTraits: jsonb("vedic_traits"),
  chineseTraits: jsonb("chinese_traits"),
  humanDesignTraits: jsonb("human_design_traits"),
  commonPatterns: jsonb("common_patterns"), // Shared insights across systems
  uniqueInsights: jsonb("unique_insights"), // System-specific findings
  synthesizedGuidance: jsonb("synthesized_guidance"), // Unified recommendations
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export const insertBirthDataSchema = createInsertSchema(birthData).omit({ id: true, createdAt: true });
export const insertChartSchema = createInsertSchema(charts).omit({ id: true, createdAt: true });
export const insertCompatibilitySchema = createInsertSchema(compatibility).omit({ id: true, createdAt: true });
export const insertDailyGuidanceSchema = createInsertSchema(dailyGuidance).omit({ id: true, createdAt: true });
export const insertSystemComparisonSchema = createInsertSchema(systemComparisons).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Add message schema for AI chat conversation history
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BirthData = typeof birthData.$inferSelect;
export type InsertBirthData = z.infer<typeof insertBirthDataSchema>;
export type Chart = typeof charts.$inferSelect;
export type InsertChart = z.infer<typeof insertChartSchema>;
export type Compatibility = typeof compatibility.$inferSelect;
export type InsertCompatibility = z.infer<typeof insertCompatibilitySchema>;
export type DailyGuidance = typeof dailyGuidance.$inferSelect;
export type InsertDailyGuidance = z.infer<typeof insertDailyGuidanceSchema>;
export type SystemComparison = typeof systemComparisons.$inferSelect;
export type InsertSystemComparison = z.infer<typeof insertSystemComparisonSchema>;
