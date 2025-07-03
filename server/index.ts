import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  exportToGoogleSheets,
  logEggCollection,
  healthCheck,
  setupGoogleSheets,
  syncGoogleSheets,
} from "./routes/egg-logs";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Legacy API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Hornworm Egg Logger API routes
  app.get("/api/health", healthCheck);
  app.post("/api/egg-logs", logEggCollection);
  app.post("/api/export/google-sheets", exportToGoogleSheets);
  app.post("/api/setup-google-sheets", setupGoogleSheets);
  app.post("/api/sync-google-sheets", syncGoogleSheets);

  return app;
}
