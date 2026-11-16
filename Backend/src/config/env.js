import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });


const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret_development_only",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET || "default_jwt_refresh_secret_development_only",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "",

  GURBANI_PROVIDER: process.env.GURBANI_PROVIDER || "igranth",
  IGRANTH_BASE_URL: process.env.IGRANTH_BASE_URL || "https://api.igranth.net",
  IGRANTH_API_KEY: process.env.IGRANTH_API_KEY || "",

  OTP_DELIVERY_MODE: process.env.OTP_DELIVERY_MODE || "console",

  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID || "",
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET || "",
  GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI || "",
  GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN || "",
  GMAIL_SENDER_EMAIL: process.env.GMAIL_SENDER_EMAIL || ""
};

if (env.NODE_ENV === "production" || process.env.VERCEL) {
  if (!process.env.DATABASE_URL) {
    throw new Error("CRITICAL: Environment variable DATABASE_URL is required in production!");
  }
  if (!process.env.JWT_ACCESS_SECRET && !env.JWT_ACCESS_SECRET) {
    throw new Error("CRITICAL: Environment variable JWT_ACCESS_SECRET is required in production!");
  }
}

export default env;
