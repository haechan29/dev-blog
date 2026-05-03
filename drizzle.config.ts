import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  schemaFilter: ['public'],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_DATABASE_URL!,
  },
});
