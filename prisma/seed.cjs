// JS seed script to avoid ts-node dependency during prisma migrate reset
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const caseStudies = [
  { title: 'Seed Placeholder Case', narrative: 'Placeholder narrative', challengeQuestion: 'Placeholder?', options: ['A','B','C','D'], correctOptionIndex: 0, explanation: 'Placeholder explanation' }
];

const ipoSeedData = [
  // 1. Kinetic India – enriched with full data blocks
  {
    companyName: 'Kinetic India',
    logoUrl: 'https://placehold.co/100x100/EBF5FF/1E40AF?text=KI',
    issueOpenDate: new Date('2025-09-10'),
    issueCloseDate: new Date('2025-09-12'),
    priceBandLower: 450,
    priceBandUpper: 465,
    lotSize: 30,
    aboutCompany: 'Kinetic India designs and manufactures advanced electric vehicle (EV) powertrain and energy management systems serving leading two- and three-wheeler OEMs across India and Southeast Asia.',
    financialsJson: [
      { metric: 'Revenue (FY25)', value: '₹850 Cr', growth: '+35%' },
      { metric: 'PAT (FY25)', value: '₹120 Cr', growth: '+55%' },
      { metric: 'EBITDA Margin', value: '21.4%' }
    ],
    strengths: [
      'Leading share in EV BMS modules (>38%).',
      'Sticky OEM relationships; 5+ year supply agreements.',
      'R&D driven with 120 patents filed.',
      'Capacity expansion already funded – operating leverage ahead.'
    ],
    risks: [
      'Client concentration in top 3 OEMs (~62% revenue).',
      'Technology disruption risk (solid-state batteries).',
      'High working capital cycle due to inventory buffers.'
    ],
    statsJson: {
      faceValue: '₹10 per share',
      issueType: 'Book Built',
      listingAt: 'NSE, BSE',
      saleType: 'Fresh Issue',
      totalIssueShares: '1,10,00,000',
      totalIssueValue: '₹495 Cr',
      marketCap: '₹3,100 Cr (est.)'
    },
    reservationJson: {
      QIB: { shares: '55,00,000', percent: '50.00%' },
      NII: { shares: '16,50,000', percent: '15.00%' },
      Retail: { shares: '38,50,000', percent: '35.00%' }
    },
    anchorDetailsJson: {
      bidDate: '2025-09-09',
      sharesOffered: '30,25,000',
      amountCr: '₹136.1 Cr',
      lockIn50End: '2025-11-08',
      lockInRemainderEnd: '2026-01-07'
    },
    timelineJson: {
      open: '2025-09-10',
      close: '2025-09-12',
      allotment: '2025-09-15',
      refunds: '2025-09-16',
      creditToDemat: '2025-09-16',
      listing: '2025-09-17',
      upiCutoff: '2025-09-12 17:00'
    },
    lotSizeJson: {
      retail: { minLots: 1, maxLots: 13, sharesRange: '30 - 390', amountRange: '₹13,950 - ₹1,81,350' },
  sHNI: { minLots: 14, maxLots: 67, sharesRange: '420 - 2,010', amountRange: '₹1,95,300 - ₹9,34,650' },
      bHNI: { minLots: 68, sharesMin: 2040, amountMin: '₹9,48,600' }
    },
    financialsTableJson: {
      unit: '₹ Crore',
      periods: ['FY25', 'FY24', 'FY23'],
      rows: [
        { label: 'Revenue', values: ['850', '629', '466'] },
        { label: 'EBITDA', values: ['182', '118', '78'] },
        { label: 'PAT', values: ['120', '77', '49'] },
        { label: 'Net Worth', values: ['640', '498', '392'] },
        { label: 'Total Debt', values: ['150', '162', '175'] }
      ]
    },
    kpiJson: {
      ROE: '18.8%',
      ROCE: '24.1%',
      DebtEquity: '0.23',
      PATMargin: '14.1%',
      EBITDAMargin: '21.4%',
      PreIPO_PE: '25.9x',
      PostIPO_PE: '26.8x'
    },
    objectsOfIssueJson: [
      { sn: 1, object: 'Capacity expansion (Phase IV)', amountCr: '220' },
      { sn: 2, object: 'R&D centre enhancement', amountCr: '90' },
      { sn: 3, object: 'Working capital', amountCr: '140' },
      { sn: 4, object: 'General corporate purposes', amountCr: '—' }
    ],
    subscriptionStatusJson: {
      asOf: '2025-09-05T10:15:00+05:30',
      overall: '0.12x',
      categories: {
        QIB: { subscribed: '0.05x', offered: '55,00,000', bids: '2,75,000' },
        NII: { subscribed: '0.08x', offered: '16,50,000', bids: '1,32,000' },
        Retail: { subscribed: '0.25x', offered: '38,50,000', bids: '9,62,500' }
      },
      totalBids: '13,69,500',
      totalApplications: 48
    },
    opinions: {
      create: [
        {
          expertName: 'Choice Broking',
          expertImage: 'https://placehold.co/100x100/1E40AF/ffffff?text=CB',
          expertType: 'BROKER',
          registrationNumber: 'SEBI/RA/100001',
          stance: 'APPLY',
          summary: 'Dominant positioning and operating leverage visibility justify premium.',
          fullQuote: 'Kinetic has established technological depth and sticky OEM relationships. Margin expansion path is credible with Phase IV utilization. Valuations at ~27x FY25 post-money EPS are acceptable for a high-growth EV ancillary. We recommend APPLY for long-term compounding.'
        },
        {
          expertName: 'StreetAlpha Research',
          expertImage: 'https://placehold.co/100x100/1E40AF/ffffff?text=SR',
          expertType: 'BROKER',
          registrationNumber: 'SEBI/RA/100045',
          stance: 'NEUTRAL_APPLY_FOR_LISTING_GAINS',
          summary: 'Fairly valued; momentum + EV narrative may drive listing pop.',
          fullQuote: 'While product depth is strong, current pricing leaves limited valuation arbitrage. Apply tactically for potential listing gains; reassess post-results.'
        },
        {
          expertName: 'Delta Advisors',
          expertImage: 'https://placehold.co/100x100/1E40AF/ffffff?text=DA',
          expertType: 'BROKER',
          registrationNumber: 'SEBI/RA/100078',
          stance: 'AVOID',
          summary: 'Execution priced in; client concentration risk underappreciated.',
          fullQuote: 'Over 60% of revenues tied to three OEMs exposes downside if EV adoption slows. We prefer waiting for a cheaper re-rating opportunity.'
        }
      ]
    }
  },
  // 2. Vigor Plast India – now with expert opinions
  {
    companyName: 'Vigor Plast India Ltd',
    logoUrl: 'https://placehold.co/100x100/FFF3E0/FB8C00?text=VP',
    issueOpenDate: new Date('2025-09-04'),
    issueCloseDate: new Date('2025-09-09'),
    priceBandLower: 77,
    priceBandUpper: 81,
    lotSize: 1600,
    aboutCompany: 'Vigor Plast manufactures CPVC/UPVC pipe systems across plumbing, sewage, agri and industrial segments with expanding distribution in Tier II/III markets.',
    financialsJson: [
      { metric: 'Revenue (FY25)', value: '₹46.02 Cr', growth: '+8%' },
      { metric: 'PAT (FY25)', value: '₹5.15 Cr', growth: '+76%' },
      { metric: 'EBITDA (FY25)', value: '₹12.08 Cr' }
    ],
    strengths: [
      'Diverse end-market exposure',
      'Automation driving margin expansion',
      'Pan-India distributor base (440)',
      'Improving capital efficiency'
    ],
    risks: [
      'Fragmented competitive landscape',
      'Recent profitability spike may normalize',
      'Working capital / receivable stretch risk'
    ],
    statsJson: {
      faceValue: '₹10 per share',
      issueType: 'Bookbuilding IPO',
      listingAt: 'NSE SME',
      saleType: 'Fresh + OFS',
      totalIssueShares: '30,99,200',
      totalIssueValue: '₹25.10 Cr',
      marketCap: '₹83.85 Cr (est.)'
    },
    reservationJson: {
      marketMaker: { shares: '1,55,200', percent: '5.01%' },
      QIB: { shares: '14,64,000', percent: '47.24%' },
      NII: { shares: '4,46,400', percent: '14.40%' },
      Retail: { shares: '10,33,600', percent: '33.35%' },
      Anchor: { shares: '8,73,600', percent: '28.19%' }
    },
    anchorDetailsJson: {
      bidDate: '2025-09-03',
      sharesOffered: '8,73,600',
      amountCr: '₹7.08 Cr',
      lockIn50End: '2025-10-09',
      lockInRemainderEnd: '2025-12-08'
    },
    timelineJson: {
      open: '2025-09-04',
      close: '2025-09-09',
      allotment: '2025-09-10',
      refunds: '2025-09-11',
      creditToDemat: '2025-09-11',
      listing: '2025-09-12',
      upiCutoff: '2025-09-09 17:00'
    },
    lotSizeJson: {
      retail: { minLots: 2, maxLots: 2, sharesMin: 3200, amountMin: '₹2,59,200' },
      sHNI: { minLots: 3, maxLots: 7, sharesRange: '4,800 - 11,200', amountRange: '₹3,88,800 - ₹9,07,200' },
      bHNI: { minLots: 8, sharesMin: 12800, amountMin: '₹10,36,800' }
    },
    financialsTableJson: {
      unit: '₹ Crore',
      periods: ['31 Mar 2025', '31 Mar 2024', '31 Mar 2023'],
      rows: [
        { label: 'Assets', values: ['40.51','35.89','20.09'] },
        { label: 'Total Income', values: ['46.02','42.52','37.39'] },
        { label: 'PAT', values: ['5.15','2.93','0.30'] },
        { label: 'EBITDA', values: ['12.08','7.55','3.08'] },
        { label: 'Net Worth', values: ['12.78','4.57','1.64'] },
        { label: 'Reserves & Surplus', values: ['4.93','4.07','1.14'] },
        { label: 'Total Borrowing', values: ['17.72','21.57','11.29'] }
      ]
    },
    kpiJson: {
      ROE: '59.39%',
      ROCE: '28.24%',
      DebtEquity: '1.39',
      PATMargin: '11.30%',
      EBITDAMargin: '26.51%',
      PreIPO_PE: '12.35',
      PostIPO_PE: '16.28'
    },
    objectsOfIssueJson: [
      { sn: 1, object: 'Repayment of certain secured borrowings', amountCr: '11.39' },
      { sn: 2, object: 'Capex for new Ahmedabad warehouse', amountCr: '3.80' },
      { sn: 3, object: 'General corporate purposes', amountCr: '—' }
    ],
    subscriptionStatusJson: {
      asOf: '2025-09-04T18:54:59+05:30',
      overall: '0.33x',
      categories: {
        QIB: { subscribed: '0.42x', offered: '5,90,400', bids: '2,46,400', applications: 1 },
        NII: { subscribed: '0.50x', offered: '4,46,400', bids: '2,22,400', applications: 28, breakdown: { bNII: '0.39x', sNII: '0.71x' } },
        Retail: { subscribed: '0.20x', offered: '10,33,600', bids: '2,08,000', applications: 65 }
      },
      totalBids: '6,76,800',
      totalApplications: 94
    },
    opinions: {
      create: [
        {
          expertName: 'ValueEdge Analytics',
          expertImage: 'https://placehold.co/100x100/FB8C00/ffffff?text=VE',
          expertType: 'BROKER',
          registrationNumber: 'SEBI/RA/200010',
          stance: 'NEUTRAL_APPLY_FOR_LISTING_GAINS',
          summary: 'Sustained margin expansion is uncertain; apply selectively for gains.',
          fullQuote: 'Sharp PAT jump rests on operating leverage and lower resin volatility. Sustainability through a cycle unproven; tactical listing approach suggested.'
        },
        {
          expertName: 'RetailAlpha Forum',
          expertImage: 'https://placehold.co/100x100/FB8C00/ffffff?text=RA',
          expertType: 'INFLUENCER',
          registrationNumber: 'SEBI/RA/200022',
          stance: 'AVOID',
          summary: 'Size + concentration + cyclicality = better opportunities elsewhere.',
          fullQuote: 'Competitive intensity + recent earnings spike create asymmetric downside risk if normalization sets in. We suggest avoiding unless pricing re-adjusts.'
        }
      ]
    }
  },
  // 3. Nova Renewables Limited – hypothetical green energy IPP
  {
    companyName: 'Nova Renewables Limited',
    logoUrl: 'https://placehold.co/100x100/E0F7FA/006064?text=NR',
    issueOpenDate: new Date('2025-09-18'),
    issueCloseDate: new Date('2025-09-20'),
    priceBandLower: 315,
    priceBandUpper: 330,
    lotSize: 45,
    aboutCompany: 'Nova Renewables operates utility-scale hybrid wind-solar parks with integrated storage pilots across western and southern India delivering firm power to C&I and discom offtakers.',
    financialsJson: [
      { metric: 'Revenue (FY25)', value: '₹1,420 Cr', growth: '+28%' },
      { metric: 'PAT (FY25)', value: '₹210 Cr', growth: '+31%' },
      { metric: 'Operating Capacity', value: '2.4 GW' }
    ],
    strengths: [
      'Hybrid + storage early-mover advantage',
      'Long tenor PPAs (weighted avg 18 yrs)',
      'Declining levelized cost of energy (LCOE)',
      'Robust execution pipeline (1.1 GW under construction)'
    ],
    risks: [
      'Regulatory tariff resets',
      'Counterparty receivable delays (state discoms)',
      'Project execution weather dependency'
    ],
    statsJson: {
      faceValue: '₹5 per share',
      issueType: 'Book Built',
      listingAt: 'NSE, BSE',
      saleType: 'Fresh + OFS',
      totalIssueShares: '6,50,00,000',
      totalIssueValue: '₹2,112 Cr',
      marketCap: '₹13,900 Cr (est.)'
    },
    reservationJson: {
      QIB: { shares: '4,87,50,000', percent: '75.00%' },
      NII: { shares: '97,50,000', percent: '15.00%' },
      Retail: { shares: '65,00,000', percent: '10.00%' }
    },
    anchorDetailsJson: {
      bidDate: '2025-09-17',
      sharesOffered: '1,95,00,000',
      amountCr: '₹643.5 Cr',
      lockIn50End: '2025-11-14',
      lockInRemainderEnd: '2026-01-13'
    },
    timelineJson: {
      open: '2025-09-18',
      close: '2025-09-20',
      allotment: '2025-09-22',
      refunds: '2025-09-23',
      creditToDemat: '2025-09-23',
      listing: '2025-09-24',
      upiCutoff: '2025-09-20 17:00'
    },
    lotSizeJson: {
      retail: { minLots: 1, maxLots: 13, sharesRange: '45 - 585', amountRange: '₹14,850 - ₹1,93,050' },
      sHNI: { minLots: 14, maxLots: 67, sharesRange: '630 - 3,015', amountRange: '₹2,07,900 - ₹9,94,950' },
      bHNI: { minLots: 68, sharesMin: 3060, amountMin: '₹10,09,800' }
    },
    financialsTableJson: {
      unit: '₹ Crore',
      periods: ['FY25', 'FY24', 'FY23'],
      rows: [
        { label: 'Revenue', values: ['1,420','1,110','868'] },
        { label: 'EBITDA', values: ['990','780','602'] },
        { label: 'PAT', values: ['210','160','120'] },
        { label: 'Net Worth', values: ['5,100','4,250','3,640'] },
        { label: 'Total Debt', values: ['6,350','5,980','5,500'] }
      ]
    },
    kpiJson: {
      ROE: '4.1%',
      ROCE: '9.8%',
      DebtEquity: '1.25',
      PATMargin: '14.8%',
      EBITDAMargin: '69.7%',
      PreIPO_PE: '65.9x',
      PostIPO_PE: '66.7x'
    },
    objectsOfIssueJson: [
      { sn: 1, object: 'Debt reduction (project SPVs)', amountCr: '850' },
      { sn: 2, object: 'Battery storage pilot capex', amountCr: '420' },
      { sn: 3, object: 'Working capital', amountCr: '300' },
      { sn: 4, object: 'Group corporate purposes', amountCr: '—' }
    ],
    subscriptionStatusJson: {
      asOf: '2025-09-05T10:15:00+05:30',
      overall: '0.05x',
      categories: {
        QIB: { subscribed: '0.03x', offered: '4,87,50,000', bids: '14,62,500' },
        NII: { subscribed: '0.04x', offered: '97,50,000', bids: '3,90,000' },
        Retail: { subscribed: '0.12x', offered: '65,00,000', bids: '7,80,000' }
      },
      totalBids: '26,32,500',
      totalApplications: 22
    },
    opinions: {
      create: [
        {
          expertName: 'GreenCap Advisors',
          expertImage: 'https://placehold.co/100x100/006064/ffffff?text=GC',
          expertType: 'BROKER',
          registrationNumber: 'SEBI/RA/300050',
          stance: 'APPLY',
          summary: 'Rare scale + hybrid optionality; structural growth visibility.',
          fullQuote: 'Hybrid renewable + early storage adoption underpins premium EBITDA profile. Despite optically rich PE, EV/EBITDA discount vs global peers offers upside. Long-term APPLY.'
        },
        {
          expertName: 'Sceptic Research',
          expertImage: 'https://placehold.co/100x100/006064/ffffff?text=SR',
          expertType: 'BROKER',
          registrationNumber: 'SEBI/RA/300066',
          stance: 'AVOID',
          summary: 'Leverage + valuation stretch; limited margin of safety.',
          fullQuote: 'High leverage amid rate uncertainty + premium multiple leave asymmetric risk. Execution must remain flawless to justify entry. We stay on sidelines.'
        }
      ]
    }
  },
  // 4. UrbanKart Logistics Ltd – e-commerce last mile & fulfillment
  {
    companyName: 'UrbanKart Logistics Ltd',
    logoUrl: 'https://placehold.co/100x100/F3E8FF/6B21A8?text=UL',
    issueOpenDate: new Date('2025-09-22'),
    issueCloseDate: new Date('2025-09-25'),
    priceBandLower: 145,
    priceBandUpper: 153,
    lotSize: 97,
    aboutCompany: 'UrbanKart Logistics provides tech-enabled last-mile delivery, dark store micro-fulfillment and reverse logistics solutions to omnichannel retailers and D2C brands.',
    financialsJson: [
      { metric: 'Revenue (FY25)', value: '₹910 Cr', growth: '+42%' },
      { metric: 'PAT (FY25)', value: '₹54 Cr', growth: '+61%' },
      { metric: 'Active Cities', value: '118' }
    ],
    strengths: [
      'Asset-light variable capacity model',
      'Proprietary route optimization engine',
      'High retention enterprise contracts',
      'Expanding high-margin reverse logistics vertical'
    ],
    risks: [
      'Unit economics pressure in hyperlocal segment',
      'Labour availability / attrition swings',
      'Client pricing renegotiation risk in downturn'
    ],
    statsJson: {
      faceValue: '₹2 per share',
      issueType: 'Book Built',
      listingAt: 'NSE, BSE',
      saleType: 'Fresh Issue',
      totalIssueShares: '2,40,00,000',
      totalIssueValue: '₹360 Cr',
      marketCap: '₹2,050 Cr (est.)'
    },
    reservationJson: {
      QIB: { shares: '1,08,00,000', percent: '45.00%' },
      NII: { shares: '36,00,000', percent: '15.00%' },
      Retail: { shares: '84,00,000', percent: '35.00%' },
      Employees: { shares: '12,00,000', percent: '5.00%' }
    },
    anchorDetailsJson: {
      bidDate: '2025-09-20',
      sharesOffered: '54,00,000',
      amountCr: '₹82.6 Cr',
      lockIn50End: '2025-11-19',
      lockInRemainderEnd: '2026-01-18'
    },
    timelineJson: {
      open: '2025-09-22',
      close: '2025-09-25',
      allotment: '2025-09-26',
      refunds: '2025-09-29',
      creditToDemat: '2025-09-29',
      listing: '2025-09-30',
      upiCutoff: '2025-09-25 17:00'
    },
    lotSizeJson: {
  retail: { minLots: 1, maxLots: 13, sharesRange: '97 - 1,261', amountRange: '₹14,841 - ₹1,92,933' },
  sHNI: { minLots: 14, maxLots: 67, sharesRange: '1,358 - 6,499', amountRange: '₹2,07,774 - ₹9,94,347' },
  bHNI: { minLots: 68, sharesMin: 6596, amountMin: '₹10,09,188' }
    },
    financialsTableJson: {
      unit: '₹ Crore',
      periods: ['FY25', 'FY24', 'FY23'],
      rows: [
        { label: 'Revenue', values: ['910','641','452'] },
        { label: 'EBITDA', values: ['126','85','52'] },
        { label: 'PAT', values: ['54','33','19'] },
        { label: 'Net Worth', values: ['420','366','318'] },
        { label: 'Total Debt', values: ['90','104','116'] }
      ]
    },
    kpiJson: {
      ROE: '12.9%',
      ROCE: '18.4%',
      DebtEquity: '0.21',
      PATMargin: '5.9%',
      EBITDAMargin: '13.8%',
      PreIPO_PE: '37.9x',
      PostIPO_PE: '38.6x'
    },
    objectsOfIssueJson: [
      { sn: 1, object: 'Technology platform scaling', amountCr: '110' },
      { sn: 2, object: 'Working capital', amountCr: '120' },
      { sn: 3, object: 'Fleet partner enablement program', amountCr: '60' },
      { sn: 4, object: 'General corporate purposes', amountCr: '—' }
    ],
    subscriptionStatusJson: {
      asOf: '2025-09-05T10:15:00+05:30',
      overall: '0.07x',
      categories: {
        QIB: { subscribed: '0.03x', offered: '1,08,00,000', bids: '3,24,000' },
        NII: { subscribed: '0.05x', offered: '36,00,000', bids: '1,80,000' },
        Retail: { subscribed: '0.11x', offered: '84,00,000', bids: '9,24,000' },
        Employees: { subscribed: '0.21x', offered: '12,00,000', bids: '2,52,000' }
      },
      totalBids: '16,80,000',
      totalApplications: 58
    },
    opinions: {
      create: [
        {
          expertName: 'LogiTech Research',
          expertImage: 'https://placehold.co/100x100/6B21A8/ffffff?text=LR',
          expertType: 'BROKER',
          registrationNumber: 'SEBI/RA/400012',
          stance: 'APPLY',
          summary: 'Platform leverage + reverse logistics optionality.',
          fullQuote: 'Unit economics discipline + diversified client mix de-risk growth. Upside from reverse logistics margin mix visible. We rate APPLY for medium-term rerating potential.'
        },
        {
          expertName: 'Prudent Investors Network',
          expertImage: 'https://placehold.co/100x100/6B21A8/ffffff?text=PI',
          expertType: 'INFLUENCER',
          registrationNumber: 'SEBI/RA/400034',
          stance: 'NEUTRAL_APPLY_FOR_LISTING_GAINS',
          summary: 'Valuation full; tactical listing participation acceptable.',
          fullQuote: 'Growth + improving margins encouraging, yet valuation embeds optimistic forward scaling. Apply only for listing momentum; hold decision post Q2 results.'
        }
      ]
    }
  }
];

async function main(){
  console.log('Seeding start...');

  // Case studies (idempotent by title for simplicity)
  for (const cs of caseStudies) {
    const exists = await prisma.caseStudy.findFirst({ where: { title: cs.title } });
    if (exists) {
      console.log(`CaseStudy: '${cs.title}' already exists (id ${exists.id}) – skipping`);
    } else {
      const created = await prisma.caseStudy.create({ data: cs });
      console.log(`CaseStudy: '${created.title}' created (id ${created.id})`);
    }
  }

  let createdCount = 0; let updatedCount = 0;
  for (const ipo of ipoSeedData) {
    const existing = await prisma.iPO.findUnique({ where: { companyName: ipo.companyName } });
    const result = await prisma.iPO.upsert({
      where: { companyName: ipo.companyName },
      update: {
        logoUrl: ipo.logoUrl,
        issueOpenDate: ipo.issueOpenDate,
        issueCloseDate: ipo.issueCloseDate,
        priceBandLower: ipo.priceBandLower,
        priceBandUpper: ipo.priceBandUpper,
        lotSize: ipo.lotSize,
        aboutCompany: ipo.aboutCompany,
        financialsJson: ipo.financialsJson,
        strengths: ipo.strengths,
        risks: ipo.risks,
        statsJson: ipo.statsJson,
        reservationJson: ipo.reservationJson,
        anchorDetailsJson: ipo.anchorDetailsJson,
        timelineJson: ipo.timelineJson,
        lotSizeJson: ipo.lotSizeJson,
        financialsTableJson: ipo.financialsTableJson,
        kpiJson: ipo.kpiJson,
        objectsOfIssueJson: ipo.objectsOfIssueJson,
        subscriptionStatusJson: ipo.subscriptionStatusJson,
        opinions: { deleteMany: {}, create: ipo.opinions.create }
      },
      create: ipo
    });
    if (existing) {
      updatedCount++; console.log(`IPO: '${result.companyName}' updated (id ${result.id})`);
    } else {
      createdCount++; console.log(`IPO: '${result.companyName}' created (id ${result.id})`);
    }
  }
  console.log(`Seeding complete. IPOs created: ${createdCount}, updated: ${updatedCount}`);
}
main().catch(e=>{console.error('Seed error', e); process.exit(1);}).finally(()=>prisma.$disconnect());
