#!/usr/bin/env node
/**
 * Applies supabase/migrations/*.sql in order via DATABASE_URL.
 *
 * Usage (from repo root):
 *   node --env-file=.env scripts/apply-migrations.mjs
 *
 * If direct db.*.supabase.co DNS fails, set DATABASE_URL to the
 * Session pooler URI from Supabase → Connect (host like
 * aws-0-<region>.pooler.supabase.com, user postgres.<project-ref>).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const migrationsDir = path.join(root, "supabase", "migrations");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort((a, b) => a.localeCompare(b));

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

async function applyMigration(file) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
  console.log("apply", file);
  try {
    await client.query("begin");
    await client.query(sql);
    await client.query(`insert into public.schema_migrations (id) values ($1)`, [
      file,
    ]);
    await client.query("commit");
    console.log("ok", file);
  } catch (error) {
    await client.query("rollback");
    console.error("failed", file, error.message);
    await client.end();
    process.exit(1);
  }
}

async function applyPendingMigrations(pending, index = 0) {
  if (index >= pending.length) {
    return;
  }
  await applyMigration(pending[index]);
  await applyPendingMigrations(pending, index + 1);
}

await client.connect();
await client.query(`
  create table if not exists public.schema_migrations (
    id text primary key,
    applied_at timestamptz not null default now()
  );
`);

const { rows: appliedRows } = await client.query(
  `select id from public.schema_migrations`,
);
const appliedIds = new Set(appliedRows.map((row) => row.id));

const pending = [];
for (const file of files) {
  if (appliedIds.has(file)) {
    console.log("skip", file);
    continue;
  }
  pending.push(file);
}

await applyPendingMigrations(pending);
await client.end();
console.log("done");
