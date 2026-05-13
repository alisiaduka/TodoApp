import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const verifyToken: RequestHandler = (req: any, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;
  const token = req.cookies.token || bearerToken;

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key") as { user_id: number };
    req.user = { user_id: decoded.user_id };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default verifyToken;
