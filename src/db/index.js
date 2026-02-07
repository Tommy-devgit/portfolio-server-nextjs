import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const dbPassword = process.env.DB_PASSWORD;
if (dbPassword == null) {
  console.warn("Warning: DB_PASSWORD is not set in environment (.env). pg will fail to authenticate without a valid password.");
} else {
  console.log("DB_PASSWORD present (masked):", dbPassword ? "***" : "(empty string)", "type:", typeof dbPassword);
}

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: dbPassword != null ? String(dbPassword) : undefined,
  database: "portfolio_blog",
});
