import {
  users,
  birthData,
  charts,
  compatibility,
  dailyGuidance,
  systemComparisons,
  type User,
  type UpsertUser,
  type InsertUser,
  type BirthData,
  type InsertBirthData,
  type Chart,
  type InsertChart,
  type Compatibility,
  type InsertCompatibility,
  type DailyGuidance,
  type InsertDailyGuidance,
  type SystemComparison,
  type InsertSystemComparison,
} from "../shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Birth data operations
  getBirthData(id: number): Promise<BirthData | undefined>;
  getBirthDataByUserId(userId: string): Promise<BirthData[]>;
  createBirthData(insertData: InsertBirthData): Promise<BirthData>;

  // Chart operations
  getChart(id: number): Promise<Chart | undefined>;
  getChartsByBirthDataId(birthDataId: number): Promise<Chart[]>;
  createChart(insertChart: InsertChart): Promise<Chart>;

  // Compatibility operations
  getCompatibility(id: number): Promise<Compatibility | undefined>;
  getCompatibilityByUserId(userId: string): Promise<Compatibility[]>;
  createCompatibility(insertCompatibility: InsertCompatibility): Promise<Compatibility>;

  // Daily guidance operations
  getDailyGuidance(id: number): Promise<DailyGuidance | undefined>;
  getDailyGuidanceByUserAndDate(userId: string, date: string): Promise<DailyGuidance | undefined>;
  createDailyGuidance(insertGuidance: InsertDailyGuidance): Promise<DailyGuidance>;

  // System comparison operations
  getSystemComparison(id: number): Promise<SystemComparison | undefined>;
  getSystemComparisonByUserAndChart(userId: string, chartId: number): Promise<SystemComparison | undefined>;
  createSystemComparison(insertComparison: InsertSystemComparison): Promise<SystemComparison>;
}

export class DatabaseStorage implements IStorage {
  // User operations - required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Birth data operations
  async getBirthData(id: number): Promise<BirthData | undefined> {
    const [data] = await db.select().from(birthData).where(eq(birthData.id, id));
    return data;
  }

  async getBirthDataByUserId(userId: string): Promise<BirthData[]> {
    return await db.select().from(birthData).where(eq(birthData.userId, userId));
  }

  async createBirthData(insertData: InsertBirthData): Promise<BirthData> {
    const [data] = await db.insert(birthData).values([insertData]).returning();
    return data;
  }

  // Chart operations
  async getChart(id: number): Promise<Chart | undefined> {
    const [chart] = await db.select().from(charts).where(eq(charts.id, id));
    return chart;
  }

  async getChartsByBirthDataId(birthDataId: number): Promise<Chart[]> {
    return await db.select().from(charts).where(eq(charts.birthDataId, birthDataId));
  }

  async createChart(insertChart: InsertChart): Promise<Chart> {
    const [chart] = await db.insert(charts).values([insertChart]).returning();
    return chart;
  }

  // Compatibility operations
  async getCompatibility(id: number): Promise<Compatibility | undefined> {
    const [comp] = await db.select().from(compatibility).where(eq(compatibility.id, id));
    return comp;
  }

  async getCompatibilityByUserId(userId: string): Promise<Compatibility[]> {
    return await db.select().from(compatibility).where(eq(compatibility.primaryUserId, userId));
  }

  async createCompatibility(insertCompatibility: InsertCompatibility): Promise<Compatibility> {
    const [comp] = await db.insert(compatibility).values({
      ...insertCompatibility,
      partnerUserIds: insertCompatibility.partnerUserIds
    }).returning();
    return comp;
  }

  // Daily guidance operations
  async getDailyGuidance(id: number): Promise<DailyGuidance | undefined> {
    const [guidance] = await db.select().from(dailyGuidance).where(eq(dailyGuidance.id, id));
    return guidance;
  }

  async getDailyGuidanceByUserAndDate(userId: string, date: string): Promise<DailyGuidance | undefined> {
    const [guidance] = await db
      .select()
      .from(dailyGuidance)
      .where(and(eq(dailyGuidance.userId, userId), eq(dailyGuidance.date, date)));
    return guidance;
  }

  async createDailyGuidance(insertGuidance: InsertDailyGuidance): Promise<DailyGuidance> {
    const [guidance] = await db.insert(dailyGuidance).values([insertGuidance]).returning();
    return guidance;
  }

  // System comparison operations
  async getSystemComparison(id: number): Promise<SystemComparison | undefined> {
    const [comparison] = await db.select().from(systemComparisons).where(eq(systemComparisons.id, id));
    return comparison;
  }

  async getSystemComparisonByUserAndChart(userId: string, chartId: number): Promise<SystemComparison | undefined> {
    const [comparison] = await db
      .select()
      .from(systemComparisons)
      .where(and(eq(systemComparisons.userId, userId), eq(systemComparisons.chartId, chartId)));
    return comparison;
  }

  async createSystemComparison(insertComparison: InsertSystemComparison): Promise<SystemComparison> {
    const [comparison] = await db.insert(systemComparisons).values([insertComparison]).returning();
    return comparison;
  }
}

export const storage = new DatabaseStorage();