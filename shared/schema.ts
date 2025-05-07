import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Priority and Category types
export const PriorityLevel = {
  HIGH: "high",
  MEDIUM: "medium", 
  LOW: "low"
} as const;

export const CategoryType = {
  WORK: "work",
  PERSONAL: "personal",
  STUDY: "study",
  HEALTH: "health",
  FINANCE: "finance"
} as const;

export type Priority = typeof PriorityLevel[keyof typeof PriorityLevel];
export type Category = typeof CategoryType[keyof typeof CategoryType];

// Todo schema
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  priority: text("priority").notNull().$type<Priority>(),
  category: text("category").notNull().$type<Category>(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTodoSchema = createInsertSchema(todos).omit({
  id: true,
  createdAt: true,
}).extend({
  dueDate: z.string().optional(),
  priority: z.enum([
    PriorityLevel.HIGH, 
    PriorityLevel.MEDIUM, 
    PriorityLevel.LOW
  ]),
  category: z.enum([
    CategoryType.WORK, 
    CategoryType.PERSONAL, 
    CategoryType.STUDY, 
    CategoryType.HEALTH, 
    CategoryType.FINANCE
  ]),
});

export const updateTodoSchema = insertTodoSchema.partial().extend({
  id: z.number(),
});

export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;
export type Todo = typeof todos.$inferSelect;
