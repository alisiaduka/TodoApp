import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connection from "./config/db";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import verifyToken from "./middleware/authMiddleware";

const app = express();
const PORT = 3005;
const CLIENT_ORIGIN = "http://localhost:3000";

app.use(
  cors({
    credentials: true,
    origin: CLIENT_ORIGIN,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, _res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.get("/", (_req, res) => {
  res.json({ message: "Todo API running" });
});

app.get("/protected-route", verifyToken, (req: any, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

connection.connect((err: any) => {
  if (err) {
    return console.error(`MySQL connection error: ${err.message}`);
  }

  console.log("Connected to the MySQL server");
});
