import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the parent directory's .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testConnection() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));

        // Test basic connection
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Connection successful!');
        console.log('Current time:', result.rows[0].now);

        // Test if database exists
        const dbResult = await pool.query('SELECT current_database()');
        console.log('✅ Connected to database:', dbResult.rows[0].current_database);

    } catch (error) {
        console.error('❌ Connection failed:', error.message);

        if (error.code === '3D000') {
            console.log('💡 Database does not exist. You need to create it first.');
            console.log('Run this command in psql or pgAdmin:');
            console.log('CREATE DATABASE sebi_hackathon_db;');
        } else if (error.code === '28P01') {
            console.log('💡 Authentication failed. Check username/password.');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('💡 PostgreSQL server is not running or not accessible.');
        }
    } finally {
        await pool.end();
    }
}

testConnection();
