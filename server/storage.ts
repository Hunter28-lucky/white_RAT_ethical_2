import { users, sessions, trainingLogs, type User, type InsertUser, type Session, type InsertSession, type TrainingLog, type InsertTrainingLog } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSession(session: InsertSession): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  updateSession(sessionId: string, updates: Partial<InsertSession>): Promise<Session | undefined>;
  createTrainingLog(log: InsertTrainingLog): Promise<TrainingLog>;
  getTrainingLogsBySession(sessionId: string): Promise<TrainingLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<string, Session>;
  private trainingLogs: Map<number, TrainingLog>;
  private currentUserId: number;
  private currentSessionId: number;
  private currentLogId: number;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.trainingLogs = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentLogId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = { 
      ...insertSession, 
      id, 
      userId: null,
      createdAt: new Date(),
      consent: insertSession.consent ?? false,
      browserInfo: insertSession.browserInfo ?? null,
      permissions: insertSession.permissions ?? null,
      isActive: insertSession.isActive ?? true,
      clientIP: insertSession.clientIP ?? null,
      userAgent: insertSession.userAgent ?? null
    };
    this.sessions.set(session.sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async updateSession(sessionId: string, updates: Partial<InsertSession>): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async createTrainingLog(insertLog: InsertTrainingLog): Promise<TrainingLog> {
    const id = this.currentLogId++;
    const log: TrainingLog = { 
      ...insertLog, 
      id, 
      timestamp: new Date(),
      details: insertLog.details ?? null
    };
    this.trainingLogs.set(id, log);
    return log;
  }

  async getTrainingLogsBySession(sessionId: string): Promise<TrainingLog[]> {
    return Array.from(this.trainingLogs.values()).filter(
      (log) => log.sessionId === sessionId
    );
  }
}

export const storage = new MemStorage();
