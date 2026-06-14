require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const analyticsRouter = require("./routes/analytics");
const chatRouter = require("./routes/chat");
const parseRouter = require("./routes/parse");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:8080" }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api", analyticsRouter);
app.use("/api", chatRouter);
app.use("/api", parseRouter);

// Serve frontend static assets in production
const frontendDistPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.listen(PORT, () => console.log(`SpendPilot backend running on port ${PORT}`));
