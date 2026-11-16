import test from "node:test";
import assert from "node:assert/strict";
import { checkDbHealth, pool, closePool } from "../src/config/db.js";

test.after(async () => {
  await closePool();
});

test("Database - Connection Health Check", async () => {
  const isHealthy = await checkDbHealth();
  assert.equal(isHealthy, true, "Database should be healthy and accessible");
});

test("Database - Simple Query Execution", async () => {
  const res = await pool.query("SELECT 1 + 1 AS sum");
  assert.equal(res.rows[0].sum, 2, "Query should return correct calculation");
});
