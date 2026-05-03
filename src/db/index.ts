import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as relations from '../../drizzle/relations';

const client = postgres(process.env.POOLER_DATABASE_URL!, { prepare: false });
export const db = drizzle(client, { schema: { ...schema, ...relations } });
