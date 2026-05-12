import { RequestHandler } from "express";
import db from "../config/db";
import { MutationResult, TodoBody, TodoRow } from "../models/models";

const sanitizeTodoBody = (body: Partial<TodoBody>) => ({
  task_name: body.task_name?.trim() ?? "",
  description: body.description?.trim() ?? "",
  priority: body.priority?.trim() ?? "Later",
});

export const getAllTodos: RequestHandler = async (_req, res) => {
  try {
    const [allTodos] = await db.promise().query<TodoRow[]>(
      "SELECT * FROM Todos ORDER BY timestamp DESC"
    );
    res.status(200).json({ allTodos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTodoByUserId: RequestHandler = async (req, res) => {
  const userId = Number(req.params.user_id);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const [todos] = await db.promise().query<TodoRow[]>(
      "SELECT * FROM Todos WHERE user_id = ? ORDER BY timestamp DESC",
      [userId]
    );

    res.status(200).json({ todo: todos, user_id: userId });
  } catch (error) {
    console.error(`Error fetching todos for user ${userId}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTodo: RequestHandler = async (req, res) => {
  const userId = Number(req.params.user_id);
  const { task_name, description, priority } = sanitizeTodoBody(req.body);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!task_name || !description) {
    return res.status(400).json({
      message: "Task name and description are required",
    });
  }

  try {
    const [result] = await db.promise().query<MutationResult>(
      "INSERT INTO Todos (task_name, description, priority, user_id) VALUES (?, ?, ?, ?)",
      [task_name, description, priority, userId]
    );

    res.status(201).json({
      message: "Task created successfully",
      todo_id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTodo: RequestHandler = async (req, res) => {
  const todoId = Number(req.params.todo_id);
  const { task_name, description, priority } = sanitizeTodoBody(req.body);

  if (Number.isNaN(todoId)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }

  if (!task_name || !description) {
    return res.status(400).json({
      message: "Task name and description are required",
    });
  }

  try {
    const [result] = await db.promise().query<MutationResult>(
      "UPDATE Todos SET task_name = ?, description = ?, priority = ? WHERE todo_id = ?",
      [task_name, description, priority, todoId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error(`Error updating todo ${todoId}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTodo: RequestHandler = async (req, res) => {
  const todoId = Number(req.params.todo_id);

  if (Number.isNaN(todoId)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }

  try {
    const [result] = await db.promise().query<MutationResult>(
      "DELETE FROM Todos WHERE todo_id = ?",
      [todoId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(`Error deleting todo ${todoId}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};
