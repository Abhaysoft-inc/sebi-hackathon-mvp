import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  try {
    console.log('🔄 Creating database tables...');

    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('✅ Users table created');

    // Create CaseStudy table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS CaseStudy (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        narrative TEXT NOT NULL,
        challengeQuestion TEXT NOT NULL,
        options JSONB NOT NULL,
        correctOptionIndex INT NOT NULL,
        explanation TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('✅ CaseStudy table created');

    // Create UserProgress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS UserProgress (
        user_id UUID PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
        score INT DEFAULT 0,
        streak INT DEFAULT 0,
        completedCases UUID[] DEFAULT '{}',
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('✅ UserProgress table created');

    console.log('🔄 Populating initial case studies...');

    // Check if data already exists
    const existingCases = await pool.query('SELECT COUNT(*) FROM CaseStudy');
    if (parseInt(existingCases.rows[0].count) > 0) {
      console.log('📋 Case studies already exist, skipping population');
      return;
    }

    // Insert initial case studies
    const caseStudies = [
      {
        title: 'The Enron Illusion',
        narrative: 'Enron, an American energy company, reported soaring and consistent profits for years, making it a Wall Street darling. However, its financial statements were hiding a mountain of debt.',
        challengeQuestion: 'How did Enron\'s executives conceal billions of dollars in debt from the company\'s balance sheet?',
        options: JSON.stringify([
          'Using special purpose vehicles (SPVs)',
          'Bribing auditors to ignore the debt',
          'Converting debt to equity secretly',
          'Moving operations offshore'
        ]),
        correctOptionIndex: 0,
        explanation: 'Enron created complex SPVs to move liabilities off its official balance sheet, making the company appear far more profitable and stable than it actually was. This was a massive accounting fraud.'
      },
      {
        title: 'The Theranos Deception',
        narrative: 'Theranos promised to revolutionize healthcare with a device that could run hundreds of blood tests from a single drop of blood. It raised over $700 million from investors.',
        challengeQuestion: 'What was the fundamental fraud at the heart of the Theranos scandal?',
        options: JSON.stringify([
          'Stealing technology from competitors',
          'The technology never actually worked as advertised',
          'Using unqualified technicians',
          'Overcharging for simple tests'
        ]),
        correctOptionIndex: 1,
        explanation: 'Despite the company\'s claims, its proprietary "Edison" machines could not perform the vast majority of the tests advertised. The company was secretly using commercially available, third-party machines to run tests.'
      },
      {
        title: 'The Madoff Scheme',
        narrative: 'Bernie Madoff\'s investment firm delivered unusually consistent and high returns for decades, making him a legend in finance. Investors flocked to his exclusive fund.',
        challengeQuestion: 'What type of fraud was Bernie Madoff operating?',
        options: JSON.stringify([
          'Insider trading ring',
          'Ponzi scheme',
          'Money laundering operation',
          'High-frequency trading manipulation'
        ]),
        correctOptionIndex: 1,
        explanation: 'Madoff was running the largest Ponzi scheme in history. He used new investor money to pay fake "returns" to existing investors, creating the illusion of legitimate profits.'
      },
      {
        title: 'The FTX Collapse',
        narrative: 'FTX was one of the world\'s largest cryptocurrency exchanges, founded by Sam Bankman-Fried. The company was valued at $32 billion and was considered highly reputable.',
        challengeQuestion: 'What led to FTX\'s sudden collapse in November 2022?',
        options: JSON.stringify([
          'A major hack that stole billions',
          'Customer funds were improperly used to cover losses at Alameda Research',
          'Regulatory shutdown by the SEC',
          'Competition from other exchanges'
        ]),
        correctOptionIndex: 1,
        explanation: 'FTX collapsed when it was revealed that customer funds had been improperly lent to Alameda Research, Bankman-Fried\'s trading firm, to cover massive losses. When customers tried to withdraw funds, FTX couldn\'t meet the demand.'
      },
      {
        title: 'The GameStop Short Squeeze',
        narrative: 'In early 2021, GameStop stock went from around $20 to over $400 in a matter of days. Retail investors on Reddit coordinated to buy the heavily shorted stock.',
        challengeQuestion: 'What mechanism caused GameStop\'s stock price to skyrocket so dramatically?',
        options: JSON.stringify([
          'Market manipulation by hedge funds',
          'A short squeeze triggered by retail investors',
          'Positive earnings reports',
          'A merger announcement'
        ]),
        correctOptionIndex: 1,
        explanation: 'A short squeeze occurred when retail investors coordinated to buy GameStop stock, forcing short sellers to cover their positions by buying shares, which drove the price even higher in a feedback loop.'
      }
    ];

    for (const caseStudy of caseStudies) {
      await pool.query(`
        INSERT INTO CaseStudy (title, narrative, challengeQuestion, options, correctOptionIndex, explanation)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        caseStudy.title,
        caseStudy.narrative,
        caseStudy.challengeQuestion,
        caseStudy.options,
        caseStudy.correctOptionIndex,
        caseStudy.explanation
      ]);
    }

    console.log('✅ Case studies populated successfully');
    console.log('🎉 Database initialization complete!');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

initializeDatabase()
  .then(() => {
    console.log('✅ Database setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  });
