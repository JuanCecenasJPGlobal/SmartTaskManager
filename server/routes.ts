import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTodoSchema, updateTodoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API routes with "/api" prefix
  
  // Get all todos
  app.get("/api/todos", async (req, res) => {
    try {
      const todos = await storage.getAllTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  });

  // Get todo by ID
  app.get("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const todo = await storage.getTodoById(id);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todo" });
    }
  });

  // Create a new todo
  app.post("/api/todos", async (req, res) => {
    try {
      const validationResult = insertTodoSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid todo data", 
          errors: validationResult.error.errors
        });
      }

      const todo = await storage.createTodo(validationResult.data);
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ message: "Failed to create todo" });
    }
  });

  // Update a todo
  app.patch("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const validationResult = updateTodoSchema.safeParse({
        ...req.body,
        id
      });

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid todo data", 
          errors: validationResult.error.errors
        });
      }

      const updatedTodo = await storage.updateTodo(validationResult.data);
      if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ message: "Failed to update todo" });
    }
  });

  // Delete a todo
  app.delete("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const success = await storage.deleteTodo(id);
      if (!success) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete todo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
