// prisma.config.ts
import { defineConfig } from '@prisma/config';
import { PrismaMysql } from '@prisma/adapter-mysql';
import mysql from 'mysql2/promise';

const connectionString = process.env.DATABASE_URL;
const pool = mysql.createPool(connectionString);
const adapter = new PrismaMysql(pool);

export default defineConfig({
  datasource: {
    adapter,
  },
});