import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

dotenv.config();

export const db = drizzle(sql, { schema });
