import path from 'node:path';

import 'dotenv/config';

import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import { validateEnv } from '../config/env';

const migrationsFolder = path.resolve(__dirname, '../../drizzle');

async function main() {
  const env = validateEnv(process.env);
  const pool = mysql.createPool(env.DATABASE_URL);
  const database = drizzle(pool, {
    mode: 'default',
  });

  await migrate(database, {
    migrationsFolder,
  });

  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
