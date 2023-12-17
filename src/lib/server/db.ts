import { DRIZZLE_DATABASE_URL } from '$env/static/private';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;
const sql = neon(DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

export default db;
