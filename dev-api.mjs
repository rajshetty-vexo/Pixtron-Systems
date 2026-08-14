import express from "express";
import dotenv from "dotenv";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
app.use(express.json());

// Import TypeScript handlers directly using tsx launcher
const { default: brochureHandler } = await import("./api/brochure.ts");
const { default: contactHandler } = await import("./api/contact.ts");

app.post("/api/brochure", (req, res) => brochureHandler(req, res));
app.post("/api/contact", (req, res) => contactHandler(req, res));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Dev API Server running on http://localhost:${PORT}`);
  console.log(`🔑 Resend Key status: ${process.env.RESEND_API_KEY ? "LOADED ✅" : "NOT FOUND ❌"}`);
  console.log(`📌 Proxy route: http://localhost:8080/api/brochure -> http://localhost:${PORT}/api/brochure\n`);
});