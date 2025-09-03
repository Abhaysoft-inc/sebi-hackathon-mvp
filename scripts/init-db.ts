import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the parent directory's .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');

    // Create enum for case status if not exists
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CaseStatus') THEN
          CREATE TYPE "CaseStatus" AS ENUM ('DRAFT','PUBLISHED','ARCHIVED');
        END IF;
      EXCEPTION WHEN duplicate_object THEN
        -- Type already exists, continue
        NULL;
      END$$;
    `);

    // Create tables
    await pool.query(`
      -- CaseStudy table
      CREATE TABLE IF NOT EXISTS "CaseStudy" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "refinedTitle" TEXT,
        "slug" VARCHAR UNIQUE,
        "narrative" TEXT NOT NULL,
        "challengeQuestion" TEXT NOT NULL,
        "options" JSONB,
        "correctOptionIndex" INTEGER,
        "explanation" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        -- Extended metadata (nullable for backward compatibility)
        "companyName" TEXT,
        "ticker" VARCHAR(12),
        "periodStart" TIMESTAMP,
        "periodEnd" TIMESTAMP,
        "shortSummary" TEXT,
        "fullNarrative" TEXT,
        "sources" JSONB,
        "status" "CaseStatus" DEFAULT 'DRAFT'
      );
    `);

    await pool.query(`
      -- User table
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT,
        "email" TEXT UNIQUE,
        "emailVerified" TIMESTAMP,
        "image" TEXT,
        "totalScore" INTEGER DEFAULT 0
      );
    `);

    await pool.query(`
      -- UserProgress table
      CREATE TABLE IF NOT EXISTS "UserProgress" (
        "id" SERIAL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "caseStudyId" INTEGER NOT NULL,
        "completed" BOOLEAN DEFAULT false,
        "score" INTEGER DEFAULT 0,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
        FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE,
        UNIQUE("userId", "caseStudyId")
      );
    `);

    // New QuizQuestion table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "QuizQuestion" (
        "id" SERIAL PRIMARY KEY,
        "caseStudyId" INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0,
        "prompt" TEXT NOT NULL,
        "options" JSONB NOT NULL,
        "correctOptionIndex" INTEGER NOT NULL,
        "explanation" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE
      );
    `);

    // Create function for trigger
    await pool.query(`
      CREATE OR REPLACE FUNCTION set_quizquestion_updated_at() RETURNS trigger AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END; $$ LANGUAGE plpgsql;
    `);

    // Create trigger if it doesn't exist
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'quizquestion_updated_at') THEN
          CREATE TRIGGER quizquestion_updated_at BEFORE UPDATE ON "QuizQuestion" FOR EACH ROW EXECUTE PROCEDURE set_quizquestion_updated_at();
        END IF;
      END$$;
    `);

    // CaseGenerationLog table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "CaseGenerationLog" (
        "id" SERIAL PRIMARY KEY,
        "caseStudyId" INTEGER,
        "phase" TEXT NOT NULL,
        "inputPayload" JSONB,
        "outputPayload" JSONB,
        "error" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE SET NULL
      );
    `);

    await pool.query(`
      -- Account table for NextAuth
      CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
        UNIQUE("provider", "providerAccountId")
      );
    `);

    await pool.query(`
      -- Session table for NextAuth
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT PRIMARY KEY,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
    `);

    await pool.query(`
      -- VerificationToken table for NextAuth
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT UNIQUE NOT NULL,
        "expires" TIMESTAMP NOT NULL,
        UNIQUE("identifier", "token")
      );
    `);

    console.log('Tables created / verified successfully!');

    // Insert sample case studies
    const caseStudies = [
      {
        title: 'The Madoff Scheme',
        narrative: 'Bernie Madoff\'s investment firm delivered unusually consistent and high returns for decades, making him a legend in finance. Investors flocked to his exclusive fund, drawn by steady 10-12% annual returns regardless of market conditions.',
        challengeQuestion: 'Madoff\'s investment strategy was a lie. His firm was actually operating as a massive...?',
        options: JSON.stringify(['Insider trading ring', 'Ponzi scheme', 'Money laundering operation', 'High-frequency trading algorithm']),
        correctOptionIndex: 1,
        explanation: 'It was the largest Ponzi scheme in history. Returns paid to older investors were simply funds taken from new investors. When the 2008 financial crisis hit and too many investors wanted their money back, the scheme collapsed.',
      },
      {
        title: 'The Enron Scandal',
        narrative: 'Enron was once the seventh-largest company in the United States, praised for its innovation in energy trading. The company reported massive profits year after year, and its stock price soared.',
        challengeQuestion: 'What was the primary method Enron used to hide its massive debts and inflate profits?',
        options: JSON.stringify(['Creating fake offshore accounts', 'Using special purpose entities (SPEs)', 'Bribing government officials', 'Manipulating energy prices']),
        correctOptionIndex: 1,
        explanation: 'Enron used special purpose entities (SPEs) to move debt off its balance sheet and create the illusion of profitability. These complex financial structures hid billions in debt from investors and regulators.',
      },
      {
        title: 'The Theranos Deception',
        narrative: 'Elizabeth Holmes founded Theranos, claiming to revolutionize blood testing with technology that could run hundreds of tests from a single drop of blood. The company was valued at $9 billion at its peak.',
        challengeQuestion: 'What was the fatal flaw in Theranos\' business model?',
        options: JSON.stringify(['The technology never actually worked as advertised', 'They were stealing competitors\' technology', 'Government regulations prevented them from operating', 'They ran out of funding too quickly']),
        correctOptionIndex: 0,
        explanation: 'The revolutionary blood-testing technology that Theranos claimed to have developed never actually worked. Most tests were run on traditional machines, not their proprietary technology, and results were often inaccurate.',
      },
      {
        title: 'The GameStop Short Squeeze',
        narrative: 'In early 2021, GameStop stock went from around $20 to over $400 in a matter of days. Retail investors on Reddit coordinated to buy the heavily shorted stock, causing massive losses for hedge funds.',
        challengeQuestion: 'What mechanism caused GameStop\'s stock price to skyrocket so dramatically?',
        options: JSON.stringify(['Market manipulation by hedge funds', 'A short squeeze triggered by retail investors', 'Positive earnings reports', 'A merger announcement']),
        correctOptionIndex: 1,
        explanation: 'A short squeeze occurred when retail investors coordinated to buy GameStop stock, forcing short sellers to cover their positions by buying shares, which drove the price even higher in a feedback loop.',
      },
      {
        title: 'The FTX Collapse',
        narrative: 'FTX was one of the world\'s largest cryptocurrency exchanges, founded by Sam Bankman-Fried. The company was valued at $32 billion and was considered one of the most reputable crypto platforms.',
        challengeQuestion: 'What led to FTX\'s sudden collapse in November 2022?',
        options: JSON.stringify(['Regulatory shutdown by the SEC', 'Customer funds were improperly used to cover losses at Alameda Research', 'A major hack that stole billions', 'Competition from other exchanges']),
        correctOptionIndex: 1,
        explanation: 'FTX collapsed when it was revealed that customer funds had been improperly lent to Alameda Research, Bankman-Fried\'s trading firm, to cover massive losses. When customers tried to withdraw funds, FTX couldn\'t meet the demand.',
      },
    ];

    // Check if case studies already exist
    const existingCases = await pool.query('SELECT COUNT(*) FROM "CaseStudy"');
    const caseCount = parseInt(existingCases.rows[0].count);

    if (caseCount === 0) {
      console.log('Inserting case studies...');
      for (const cs of caseStudies) {
        await pool.query(`
          INSERT INTO "CaseStudy" (title, narrative, "challengeQuestion", options, "correctOptionIndex", explanation)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [cs.title, cs.narrative, cs.challengeQuestion, cs.options, cs.correctOptionIndex, cs.explanation]);
      }
      console.log('Case studies inserted successfully!');
    } else {
      console.log(`Database already has ${caseCount} case studies.`);
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
