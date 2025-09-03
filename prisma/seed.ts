// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const caseStudies = [
  {
    title: 'The Madoff Scheme',
    narrative: 'Bernie Madoff\'s investment firm delivered unusually consistent and high returns for decades, making him a legend in finance. Investors flocked to his exclusive fund, drawn by steady 10-12% annual returns regardless of market conditions.',
    challengeQuestion: 'Madoff\'s investment strategy was a lie. His firm was actually operating as a massive...?',
    options: ['Insider trading ring', 'Ponzi scheme', 'Money laundering operation', 'High-frequency trading algorithm'],
    correctOptionIndex: 1,
    explanation: 'It was the largest Ponzi scheme in history. Returns paid to older investors were simply funds taken from new investors. When the 2008 financial crisis hit and too many investors wanted their money back, the scheme collapsed.',
  },
  {
    title: 'The Enron Scandal',
    narrative: 'Enron was once the seventh-largest company in the United States, praised for its innovation in energy trading. The company reported massive profits year after year, and its stock price soared.',
    challengeQuestion: 'What was the primary method Enron used to hide its massive debts and inflate profits?',
    options: ['Creating fake offshore accounts', 'Using special purpose entities (SPEs)', 'Bribing government officials', 'Manipulating energy prices'],
    correctOptionIndex: 1,
    explanation: 'Enron used special purpose entities (SPEs) to move debt off its balance sheet and create the illusion of profitability. These complex financial structures hid billions in debt from investors and regulators.',
  },
  {
    title: 'The Theranos Deception',
    narrative: 'Elizabeth Holmes founded Theranos, claiming to revolutionize blood testing with technology that could run hundreds of tests from a single drop of blood. The company was valued at $9 billion at its peak.',
    challengeQuestion: 'What was the fatal flaw in Theranos\' business model?',
    options: ['The technology never actually worked as advertised', 'They were stealing competitors\' technology', 'Government regulations prevented them from operating', 'They ran out of funding too quickly'],
    correctOptionIndex: 0,
    explanation: 'The revolutionary blood-testing technology that Theranos claimed to have developed never actually worked. Most tests were run on traditional machines, not their proprietary technology, and results were often inaccurate.',
  },
  {
    title: 'The GameStop Short Squeeze',
    narrative: 'In early 2021, GameStop stock went from around $20 to over $400 in a matter of days. Retail investors on Reddit coordinated to buy the heavily shorted stock, causing massive losses for hedge funds.',
    challengeQuestion: 'What mechanism caused GameStop\'s stock price to skyrocket so dramatically?',
    options: ['Market manipulation by hedge funds', 'A short squeeze triggered by retail investors', 'Positive earnings reports', 'A merger announcement'],
    correctOptionIndex: 1,
    explanation: 'A short squeeze occurred when retail investors coordinated to buy GameStop stock, forcing short sellers to cover their positions by buying shares, which drove the price even higher in a feedback loop.',
  },
  {
    title: 'The FTX Collapse',
    narrative: 'FTX was one of the world\'s largest cryptocurrency exchanges, founded by Sam Bankman-Fried. The company was valued at $32 billion and was considered one of the most reputable crypto platforms.',
    challengeQuestion: 'What led to FTX\'s sudden collapse in November 2022?',
    options: ['Regulatory shutdown by the SEC', 'Customer funds were improperly used to cover losses at Alameda Research', 'A major hack that stole billions', 'Competition from other exchanges'],
    correctOptionIndex: 1,
    explanation: 'FTX collapsed when it was revealed that customer funds had been improperly lent to Alameda Research, Bankman-Fried\'s trading firm, to cover massive losses. When customers tried to withdraw funds, FTX couldn\'t meet the demand.',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const cs of caseStudies) {
    const caseStudy = await prisma.caseStudy.create({
      data: cs,
    });
    console.log(`Created case study with id: ${caseStudy.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
