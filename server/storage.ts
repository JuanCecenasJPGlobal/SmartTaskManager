import { todos, type Todo, type InsertTodo, type UpdateTodo, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods (keeping from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Todo methods
  getAllTodos(): Promise<Todo[]>;
  getTodoById(id: number): Promise<Todo | undefined>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(todo: UpdateTodo): Promise<Todo | undefined>;
  deleteTodo(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private todoItems: Map<number, Todo>;
  private userIdCounter: number;
  private todoIdCounter: number;

  constructor() {
    this.users = new Map();
    this.todoItems = new Map();
    this.userIdCounter = 1;
    this.todoIdCounter = 1;
  }

  // User methods (keeping from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Todo methods
  async getAllTodos(): Promise<Todo[]> {
    return Array.from(this.todoItems.values());
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    return this.todoItems.get(id);
  }

  async createTodo(insertTodo: InsertTodo): Promise<Todo> {
    const id = this.todoIdCounter++;
    const dueDate = insertTodo.dueDate ? new Date(insertTodo.dueDate) : undefined;
    
    const todo: Todo = {
      id,
      title: insertTodo.title,
      description: insertTodo.description || null,
      dueDate: dueDate || null,
      priority: insertTodo.priority,
      category: insertTodo.category,
      completed: insertTodo.completed ?? false,
      createdAt: new Date(),
    };

    this.todoItems.set(id, todo);
    return todo;
  }

  async updateTodo(updateTodo: UpdateTodo): Promise<Todo | undefined> {
    const existingTodo = this.todoItems.get(updateTodo.id);
    
    if (!existingTodo) {
      return undefined;
    }

    // Convert string date to Date object if provided
    const dueDate = updateTodo.dueDate 
      ? new Date(updateTodo.dueDate) 
      : existingTodo.dueDate;

    const updatedTodo: Todo = {
      ...existingTodo,
      title: updateTodo.title ?? existingTodo.title,
      description: updateTodo.description !== undefined ? updateTodo.description : existingTodo.description,
      dueDate: dueDate,
      priority: updateTodo.priority ?? existingTodo.priority,
      category: updateTodo.category ?? existingTodo.category,
      completed: updateTodo.completed !== undefined ? updateTodo.completed : existingTodo.completed,
    };

    this.todoItems.set(updateTodo.id, updatedTodo);
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<boolean> {
    return this.todoItems.delete(id);
  }
}

export const storage = new MemStorage();
