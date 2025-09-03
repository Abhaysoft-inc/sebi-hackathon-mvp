import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the parent directory's .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function addMissingColumns() {
    try {
        console.log('Adding missing columns to CaseStudy table...');

        // Add refinedTitle column
        await pool.query(`
      ALTER TABLE "CaseStudy" 
      ADD COLUMN IF NOT EXISTS "refinedTitle" TEXT;
    `);
        console.log('✅ Added refinedTitle column');

        // Add slug column
        await pool.query(`
      ALTER TABLE "CaseStudy" 
      ADD COLUMN IF NOT EXISTS "slug" VARCHAR UNIQUE;
    `);
        console.log('✅ Added slug column');

        console.log('Adding missing columns to QuizQuestion table...');

        // Add category column
        await pool.query(`
            ALTER TABLE "QuizQuestion" 
            ADD COLUMN IF NOT EXISTS "category" VARCHAR(40);
        `);
        console.log('✅ Added category column');

        // Add difficulty column  
        await pool.query(`
            ALTER TABLE "QuizQuestion" 
            ADD COLUMN IF NOT EXISTS "difficulty" VARCHAR(20);
        `);
        console.log('✅ Added difficulty column');

        console.log('✅ All missing columns added successfully!');

    } catch (error) {
        console.error('Error adding columns:', error);
    } finally {
        await pool.end();
    }
}

addMissingColumns();
