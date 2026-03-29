import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.local`, override: true });

const pool = mysql.createPool(process.env.DATABASE_URL);


const prisma = new PrismaClient();

export default prisma;