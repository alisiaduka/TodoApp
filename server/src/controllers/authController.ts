import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db";
import { AuthBody, MutationResult, UserRow } from "../models/models";

const TOKEN_SECRET = "secret-key";

export const authRegister: RequestHandler = async (req, res) => {
  const { user_name, email, password } = req.body as AuthBody;

  if (!user_name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existingUsers] = await db.promise().query<UserRow[]>(
      "SELECT * FROM User WHERE email = ?",
      [email.trim()]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const [result] = await db.promise().query<MutationResult>(
      "INSERT INTO User (user_name, email, password) VALUES (?, ?, ?)",
      [user_name.trim(), email.trim(), password.trim()]
    );

    res.status(201).json({
      message: "User registration successful",
      user: {
        user_id: result.insertId,
        user_name: user_name.trim(),
        email: email.trim(),
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const authLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body as AuthBody;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [users] = await db.promise().query<UserRow[]>(
      "SELECT * FROM User WHERE email = ? AND password = ?",
      [email.trim(), password.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const currentUser = users[0];
    const token = jwt.sign({ user_id: currentUser.user_id }, TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: currentUser.user_id,
        user_name: currentUser.user_name,
        email: currentUser.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const currentUser: RequestHandler = async (req: any, res) => {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [users] = await db.promise().query<UserRow[]>(
      "SELECT user_id, user_name, email, password FROM User WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    res.status(200).json({
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const authLogout: RequestHandler = async (_req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export const authenticated: RequestHandler = (req: any, res) => {
  res.status(200).json({ user: req.user });
};
