import { 
  users, 
  birthData, 
  charts, 
  compatibility, 
  dailyGuidance,
  type User, 
  type InsertUser, 
  type BirthData, 
  type InsertBirthData,
  type Chart,
  type InsertChart,
  type Compatibility,
  type InsertCompatibility,
  type DailyGuidance,
  type InsertDailyGuidance
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Birth Data
  getBirthData(id: number): Promise<BirthData | undefined>;
  getBirthDataByUserId(userId: number): Promise<BirthData[]>;
  createBirthData(data: InsertBirthData): Promise<BirthData>;
  
  // Charts
  getChart(id: number): Promise<Chart | undefined>;
  getChartsByBirthDataId(birthDataId: number): Promise<Chart[]>;
  createChart(chart: InsertChart): Promise<Chart>;
  
  // Compatibility
  getCompatibility(id: number): Promise<Compatibility | undefined>;
  getCompatibilityByUserId(userId: number): Promise<Compatibility[]>;
  createCompatibility(compatibility: InsertCompatibility): Promise<Compatibility>;
  
  // Daily Guidance
  getDailyGuidance(userId: number, date: string): Promise<DailyGuidance | undefined>;
  createDailyGuidance(guidance: InsertDailyGuidance): Promise<DailyGuidance>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private birthData: Map<number, BirthData>;
  private charts: Map<number, Chart>;
  private compatibility: Map<number, Compatibility>;
  private dailyGuidance: Map<string, DailyGuidance>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.birthData = new Map();
    this.charts = new Map();
    this.compatibility = new Map();
    this.dailyGuidance = new Map();
    this.currentId = 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Birth Data
  async getBirthData(id: number): Promise<BirthData | undefined> {
    return this.birthData.get(id);
  }

  async getBirthDataByUserId(userId: number): Promise<BirthData[]> {
    return Array.from(this.birthData.values()).filter(data => data.userId === userId);
  }

  async createBirthData(insertData: InsertBirthData): Promise<BirthData> {
    const id = this.currentId++;
    const data: BirthData = { 
      ...insertData, 
      id, 
      createdAt: new Date() 
    };
    this.birthData.set(id, data);
    return data;
  }

  // Charts
  async getChart(id: number): Promise<Chart | undefined> {
    return this.charts.get(id);
  }

  async getChartsByBirthDataId(birthDataId: number): Promise<Chart[]> {
    return Array.from(this.charts.values()).filter(chart => chart.birthDataId === birthDataId);
  }

  async createChart(insertChart: InsertChart): Promise<Chart> {
    const id = this.currentId++;
    const chart: Chart = { 
      ...insertChart, 
      id, 
      createdAt: new Date() 
    };
    this.charts.set(id, chart);
    return chart;
  }

  // Compatibility
  async getCompatibility(id: number): Promise<Compatibility | undefined> {
    return this.compatibility.get(id);
  }

  async getCompatibilityByUserId(userId: number): Promise<Compatibility[]> {
    return Array.from(this.compatibility.values()).filter(comp => comp.primaryUserId === userId);
  }

  async createCompatibility(insertCompatibility: InsertCompatibility): Promise<Compatibility> {
    const id = this.currentId++;
    const compatibility: Compatibility = { 
      ...insertCompatibility, 
      id, 
      createdAt: new Date() 
    };
    this.compatibility.set(id, compatibility);
    return compatibility;
  }

  // Daily Guidance
  async getDailyGuidance(userId: number, date: string): Promise<DailyGuidance | undefined> {
    const key = `${userId}-${date}`;
    return this.dailyGuidance.get(key);
  }

  async createDailyGuidance(insertGuidance: InsertDailyGuidance): Promise<DailyGuidance> {
    const id = this.currentId++;
    const guidance: DailyGuidance = { 
      ...insertGuidance, 
      id, 
      createdAt: new Date() 
    };
    const key = `${guidance.userId}-${guidance.date}`;
    this.dailyGuidance.set(key, guidance);
    return guidance;
  }
}

export const storage = new MemStorage();
