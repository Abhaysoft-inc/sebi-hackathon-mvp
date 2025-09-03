// JS seed script to avoid ts-node dependency during prisma migrate reset
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const caseStudies = [
  { title: 'Seed Placeholder Case', narrative: 'Placeholder narrative', challengeQuestion: 'Placeholder?', options: ['A','B','C','D'], correctOptionIndex: 0, explanation: 'Placeholder explanation' }
];

async function main(){
  for (const cs of caseStudies) {
    await prisma.caseStudy.create({ data: cs });
  }
}
main().finally(()=>prisma.$disconnect());
