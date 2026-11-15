import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db";
import { sendEmail } from "./config/email";
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Basic server test
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "KekeGo backend is running successfully!",
  });
});

// Database connection test
app.get("/api/health/db", async (req, res) => {
  try {
    const [result] = await db.query("SELECT 1");

    res.status(200).json({
      message: "Database connected successfully!",
      result,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed.",
    });
  }
});

app.post("/api/test-email", async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      res.status(400).json({
        message: "Please provide a recipient email.",
      });
      return;
    }

    await sendEmail(
      to,
      "KekeGo Email Test",
      "Congratulations! KekeGo can now send emails successfully. Your email service is working!"
    );

    res.status(200).json({
      message: "Test email sent successfully!",
    });
  } catch (error) {
    console.error("Email sending error:", error);

    res.status(500).json({
      message: "Unable to send test email.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`KekeGo backend running at http://localhost:${PORT}`);
});