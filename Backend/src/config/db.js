import pg from "pg";
import env from "./env.js";
import logger from "../utils/logger.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle PostgreSQL client", err.message);
});

export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();

export const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const checkDbHealth = async () => {
  try {
    const res = await pool.query("SELECT 1 AS healthy");
    return res.rows[0]?.healthy === 1;
  } catch (error) {
    logger.error("Database health check failed", error.message);
    return false;
  }
};

export const closePool = async () => {
  await pool.end();
  logger.info("PostgreSQL pool closed.");
};

export default {
  pool,
  query,
  getClient,
  withTransaction,
  checkDbHealth,
  closePool
};
