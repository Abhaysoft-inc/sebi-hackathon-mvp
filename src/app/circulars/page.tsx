'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, FileText, Search } from 'lucide-react';
import BottomBar from '@/components/BottomBar';

interface Circular {
    id: string;
    date: string;
    title: string;
    content: string;
}

const circulars: Circular[] = [
    {
        id: 'framework-intraday-position-limits',
        date: 'Sep 01, 2025',
        title: 'Framework for Intraday Position Limits Monitoring for Equity Index Derivatives',
        content: 'This circular establishes a comprehensive framework for monitoring intraday position limits in equity index derivatives. The framework aims to enhance market surveillance and risk management by implementing real-time monitoring systems that track position limits throughout the trading session. Key provisions include automated alert systems, enhanced reporting requirements, and standardized procedures for limit breaches. Market participants are required to implement robust systems to ensure compliance with position limits on an intraday basis. The framework also introduces penalty structures for violations and provides guidelines for exemptions in specific circumstances. Implementation timeline has been set with phased rollout starting from October 2025.'
    },
    {
        id: 'digital-accessibility-extension',
        date: 'Aug 29, 2025',
        title: 'Extension of timelines and Update of reporting authority for IAs and RAs w.r.t. SEBI Circular for Compliance to Digital Accessibility Circular \'Rights of Persons with Disabilities Act, 2016 and rules made thereunder- mandatory compliance by all Regulated Entities\' dated July 31, 2025 (Circular No. SEBI/HO/ITD-1/ITD_VIAP/P/CIR/2025/111)',
        content: 'This circular extends the compliance timeline for Investment Advisers (IAs) and Research Analysts (RAs) regarding digital accessibility requirements under the Rights of Persons with Disabilities Act, 2016. The extension provides additional time for regulated entities to implement necessary changes to their digital platforms to ensure accessibility compliance. Updated reporting authorities have been designated to oversee compliance monitoring. Key requirements include website accessibility standards, mobile application compliance, and alternative communication channels for disabled investors. The circular also provides detailed guidelines on implementation procedures and compliance verification processes.'
    },
    {
        id: 'cybersecurity-technical-clarifications',
        date: 'Aug 28, 2025',
        title: 'Technical Clarifications to Cybersecurity and Cyber Resilience Framework (CSCRF) for SEBI Regulated Entities (REs)',
        content: 'This circular provides technical clarifications on the implementation of the Cybersecurity and Cyber Resilience Framework (CSCRF) for SEBI Regulated Entities. The clarifications address common queries regarding incident reporting procedures, vulnerability management protocols, and third-party risk assessment requirements. Key areas covered include data encryption standards, network security protocols, access control mechanisms, and business continuity planning. The circular also provides guidance on compliance assessment procedures and penalty framework for non-compliance. Regular updates to cybersecurity policies and staff training requirements are emphasized.'
    },
    {
        id: 'margin-trading-net-worth-relaxation',
        date: 'Aug 26, 2025',
        title: 'Relaxation in the timeline to submit net worth certificate by the Stock Brokers to offer margin trading facility to their clients',
        content: 'This circular provides relaxation in the timeline for stock brokers to submit net worth certificates required for offering margin trading facilities to clients. The extended timeline acknowledges practical challenges faced by brokers in obtaining audited financial statements and net worth certificates. Key provisions include revised submission deadlines, alternative documentation procedures, and interim arrangements for continued operations. The circular also clarifies the minimum net worth requirements and provides guidelines for calculating eligible net worth. Penalty structures for non-compliance and procedures for seeking further extensions are also outlined.'
    },
    {
        id: 'margin-obligations-pledge-extension',
        date: 'Aug 18, 2025',
        title: 'Extension of timeline for implementation of SEBI Circular \'Margin obligations to be given by way of pledge/Re-pledge in the Depository System\' dated June 03, 2025',
        content: 'This circular extends the implementation timeline for margin obligations through pledge/re-pledge mechanisms in the depository system. The extension provides additional time for market participants to implement necessary system changes and operational procedures. Key requirements include integration with depository systems, automated pledge creation and release mechanisms, and enhanced reporting frameworks. The circular addresses technical challenges in implementation and provides guidance on system testing and validation procedures. Risk management enhancements and investor protection measures are emphasized throughout the implementation process.'
    },
    {
        id: 'liquid-mutual-funds-deposit-requirement',
        date: 'Aug 12, 2025',
        title: 'Use of liquid mutual funds and overnight mutual funds for compliance with deposit requirement by Investment Advisers and Research Analysts',
        content: 'This circular allows Investment Advisers and Research Analysts to use liquid mutual funds and overnight mutual funds for meeting deposit requirements. The provision aims to provide greater flexibility in compliance while maintaining the security of deposits. Key conditions include fund eligibility criteria, valuation methodologies, and monitoring mechanisms. The circular also provides guidelines on fund selection, risk assessment procedures, and reporting requirements. Procedures for fund substitution and emergency liquidation are outlined to ensure continuous compliance with deposit requirements.'
    },
    {
        id: 'mutual-fund-distributor-charges',
        date: 'Aug 08, 2025',
        title: 'Transaction charges paid to Mutual Fund Distributors',
        content: 'This circular addresses the framework for transaction charges paid to mutual fund distributors. It establishes standardized fee structures, disclosure requirements, and payment mechanisms to ensure transparency in distributor compensation. Key provisions include maximum charge limits, disclosure formats, and investor communication requirements. The circular also addresses conflict of interest management and fair treatment of investors across different distribution channels. Implementation guidelines and compliance monitoring procedures are detailed to ensure adherence to the new framework.'
    },
    {
        id: 'private-public-invit-conversion-review',
        date: 'Aug 08, 2025',
        title: 'Review of Framework for conversion of Private Listed InvIT into Public InvIT',
        content: 'This circular reviews and updates the framework for conversion of Private Listed Infrastructure Investment Trusts (InvITs) into Public InvITs. The revised framework aims to facilitate easier conversion while maintaining investor protection standards. Key changes include simplified conversion procedures, revised eligibility criteria, and streamlined documentation requirements. The circular also addresses valuation methodologies, investor approval processes, and regulatory compliance during conversion. Timeline requirements and fee structures for conversion applications are also specified.'
    },
    {
        id: 'joint-annual-inspection-miis',
        date: 'Aug 07, 2025',
        title: 'Ease of doing business (EODB) - Policy for joint annual inspection by MIIs – information sharing mechanism– action by Lead MII',
        content: 'This circular establishes a policy framework for joint annual inspections by Market Infrastructure Institutions (MIIs) to enhance ease of doing business. The framework introduces information sharing mechanisms and designates lead MII responsibilities for coordinated inspections. Key features include standardized inspection procedures, shared inspection schedules, and unified reporting formats. The circular aims to reduce regulatory burden on market participants while maintaining oversight effectiveness. Procedures for conflict resolution and appeal mechanisms are also outlined.'
    },
    {
        id: 'member-committee-penalty-review',
        date: 'Aug 05, 2025',
        title: 'Review, Appeal or Waiver of penalty requests emanating out of actions taken by the Member Committee',
        content: 'This circular establishes procedures for review, appeal, or waiver of penalties imposed by Member Committees. The framework provides a structured approach for handling penalty disputes and ensures fair treatment of market participants. Key provisions include appeal timelines, review criteria, and waiver conditions. The circular also outlines the composition and powers of review committees and establishes precedent-based decision making processes. Documentation requirements and fee structures for appeals are also specified.'
    },
    {
        id: 'disability-rights-compliance',
        date: 'Jul 31, 2025',
        title: 'Rights of Persons with Disabilities Act, 2016 and rules made thereunder- mandatory compliance by all Regulated Entities',
        content: 'This circular mandates compliance with the Rights of Persons with Disabilities Act, 2016 by all SEBI regulated entities. The compliance framework ensures equal access to financial services for persons with disabilities. Key requirements include accessible website design, alternative communication formats, physical accessibility of offices, and staff training programs. The circular provides detailed implementation guidelines, compliance timelines, and monitoring mechanisms. Penalty structures for non-compliance and procedures for obtaining exemptions are also outlined.'
    },
    {
        id: 'nomination-phase-extension',
        date: 'Jul 30, 2025',
        title: 'Extension of timeline for implementation of Phase II & III of Nomination Circular dated January 10, 2025 read with Circular dated February 28, 2025',
        content: 'This circular extends the implementation timeline for Phase II and III of the nomination framework as outlined in previous circulars. The extension provides additional time for market participants to implement necessary system changes and operational procedures. Key aspects include updated timelines for different phases, interim arrangements, and compliance monitoring procedures. The circular addresses practical challenges in implementation and provides guidance on system testing and validation. Risk management considerations and investor protection measures are emphasized throughout the extended implementation period.'
    },
    {
        id: 'nri-position-limits-monitoring',
        date: 'Jul 29, 2025',
        title: 'Operational Efficiency in Monitoring of Non-Resident Indians (NRIs) Position Limits in Exchange Traded Derivatives Contracts - Ease of Doing Investment',
        content: 'This circular enhances operational efficiency in monitoring NRI position limits in exchange traded derivatives contracts. The framework introduces automated monitoring systems and simplified reporting procedures to ease investment processes for NRIs. Key features include real-time position tracking, automated alert systems, and streamlined compliance procedures. The circular also addresses documentation requirements, exemption procedures, and penalty frameworks. Enhanced investor services and support mechanisms for NRI investors are emphasized throughout the framework.'
    },
    {
        id: 'mirsd-circular-extension',
        date: 'Jul 29, 2025',
        title: 'Extension of timeline for implementation of SEBI Circular SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/0000013 dated February 04, 2025',
        content: 'This circular extends the implementation timeline for the MIRSD circular dated February 04, 2025. The extension addresses practical challenges faced by market participants in implementing the required changes. Key aspects include revised implementation schedules, interim compliance measures, and monitoring procedures. The circular provides guidance on system modifications, staff training requirements, and compliance verification processes. Risk management considerations and investor protection measures are maintained throughout the extended implementation period.'
    },
    {
        id: 'sif-minimum-investment-monitoring',
        date: 'Jul 29, 2025',
        title: 'Monitoring of Minimum Investment Threshold under Specialized Investment Funds (SIF)',
        content: 'This circular establishes monitoring mechanisms for minimum investment thresholds under Specialized Investment Funds (SIF). The framework ensures compliance with investment limits while providing flexibility for fund operations. Key provisions include automated monitoring systems, reporting requirements, and compliance verification procedures. The circular addresses calculation methodologies, exemption criteria, and penalty structures. Enhanced investor protection measures and fund governance requirements are emphasized throughout the monitoring framework.'
    },
    {
        id: 'research-analysts-faqs',
        date: 'Jul 23, 2025',
        title: 'Frequently Asked Questions (FAQs) related to regulatory provisions for Research Analysts',
        content: 'This circular provides comprehensive FAQs addressing common queries related to regulatory provisions for Research Analysts. The FAQs cover registration procedures, compliance requirements, reporting obligations, and operational guidelines. Key areas addressed include conflict of interest management, research report standards, investor communication requirements, and penalty frameworks. The circular also provides clarifications on exemptions, fee structures, and appeal procedures. Updated guidance on emerging issues and technological developments in research analysis is also included.'
    },
    {
        id: 'physical-shares-transfer-window',
        date: 'Jul 02, 2025',
        title: 'Ease of Doing Investment - Special Window for Re-lodgement of Transfer Requests of Physical Shares',
        content: 'This circular establishes a special window for re-lodgement of transfer requests for physical shares to ease investment processes. The framework provides additional opportunities for investors to complete pending transfer requests with simplified procedures. Key features include extended timelines, reduced documentation requirements, and streamlined processing procedures. The circular addresses common issues in physical share transfers and provides guidance on documentation, verification, and approval processes. Enhanced investor support services and grievance redressal mechanisms are also outlined.'
    },
    {
        id: 'cybersecurity-framework-extension',
        date: 'Jun 30, 2025',
        title: 'Extension towards Adoption and Implementation of Cybersecurity and Cyber Resilience Framework (CSCRF) for SEBI Regulated Entities (REs)',
        content: 'This circular extends the timeline for adoption and implementation of the Cybersecurity and Cyber Resilience Framework (CSCRF) by SEBI Regulated Entities. The extension provides additional time for entities to implement comprehensive cybersecurity measures. Key requirements include risk assessment procedures, incident response protocols, and business continuity planning. The circular also addresses staff training requirements, third-party risk management, and compliance monitoring procedures. Regular security audits and vulnerability assessments are emphasized throughout the implementation process.'
    },
    {
        id: 'related-party-transactions-standards',
        date: 'Jun 26, 2025',
        title: 'Industry Standards on "Minimum information to be provided to the Audit Committee and Shareholders for approval of Related Party Transactions"',
        content: 'This circular establishes industry standards for information disclosure requirements for Related Party Transactions (RPTs) seeking approval from Audit Committees and shareholders. The standards ensure comprehensive disclosure and transparency in RPT approvals. Key requirements include standardized information formats, materiality assessments, and disclosure timelines. The circular also addresses conflict of interest management, independent director involvement, and shareholder communication procedures. Enhanced governance mechanisms and compliance monitoring procedures are outlined throughout the framework.'
    },
    {
        id: 'mutual-fund-portfolio-rebalancing',
        date: 'Jun 26, 2025',
        title: 'Timelines for rebalancing of portfolios of mutual fund schemes in cases of all passive breaches',
        content: 'This circular establishes timelines for portfolio rebalancing by mutual fund schemes in cases of passive breaches. The framework provides clear guidelines for fund managers to restore portfolio compliance while minimizing market impact. Key provisions include breach identification procedures, rebalancing timelines, and reporting requirements. The circular addresses different types of breaches, exemption criteria, and penalty structures. Enhanced investor communication and transparency measures are emphasized throughout the rebalancing process.'
    },
    {
        id: 'invit-investor-charter',
        date: 'Jun 12, 2025',
        title: 'Investor Charter Infrastructure Investment Trusts (InvITs)',
        content: 'This circular establishes an Investor Charter for Infrastructure Investment Trusts (InvITs) to enhance investor protection and service standards. The charter outlines investor rights, service commitments, and grievance redressal mechanisms. Key features include standardized service levels, communication protocols, and complaint resolution procedures. The circular also addresses investor education initiatives, transparency requirements, and performance monitoring mechanisms. Enhanced disclosure standards and investor engagement procedures are outlined throughout the charter.'
    },
    {
        id: 'reit-investor-charter',
        date: 'Jun 12, 2025',
        title: 'Investor Charter Real Estate Investment Trusts (REITs)',
        content: 'This circular establishes an Investor Charter for Real Estate Investment Trusts (REITs) to enhance investor protection and service standards. The charter outlines investor rights, service commitments, and grievance redressal mechanisms specific to REIT investments. Key features include standardized service levels, communication protocols, and complaint resolution procedures. The circular also addresses investor education initiatives, transparency requirements, and performance monitoring mechanisms. Enhanced disclosure standards and investor engagement procedures are outlined throughout the charter.'
    },
    {
        id: 'product-advisory-committee-review',
        date: 'Jun 12, 2025',
        title: 'Review of provisions relating to Product Advisory Committee (PAC)',
        content: 'This circular reviews and updates provisions relating to Product Advisory Committees (PAC) to enhance product governance and investor protection. The revised framework strengthens PAC responsibilities, improves decision-making processes, and enhances accountability mechanisms. Key changes include updated composition requirements, enhanced independence criteria, and strengthened oversight powers. The circular also addresses meeting procedures, documentation requirements, and reporting obligations. Enhanced transparency and stakeholder engagement mechanisms are emphasized throughout the updated framework.'
    },
    {
        id: 'standardised-upi-ids',
        date: 'Jun 11, 2025',
        title: 'Adoption of Standardised, Validated and Exclusive UPI IDs for Payment Collection by SEBI Registered Intermediaries from Investors',
        content: 'This circular mandates the adoption of standardised, validated, and exclusive UPI IDs for payment collection by SEBI registered intermediaries from investors. The framework aims to enhance payment security, reduce fraud, and improve investor confidence. Key requirements include UPI ID validation procedures, exclusivity arrangements, and security protocols. The circular also addresses implementation timelines, compliance monitoring, and penalty structures. Enhanced investor protection measures and grievance redressal mechanisms are outlined throughout the payment framework.'
    },
    {
        id: 'vcf-liquidation-extension',
        date: 'Jun 06, 2025',
        title: 'Extension of timeline of additional liquidation period for VCFs migrating to SEBI (Alternative Investment Funds) Regulations, 2012',
        content: 'This circular extends the timeline for additional liquidation period for Venture Capital Funds (VCFs) migrating to SEBI Alternative Investment Funds Regulations, 2012. The extension provides additional time for funds to complete migration procedures while maintaining investor protection. Key provisions include extended liquidation timelines, interim reporting requirements, and compliance monitoring procedures. The circular addresses practical challenges in migration and provides guidance on documentation, valuation, and approval processes. Enhanced investor communication and transparency measures are maintained throughout the extended period.'
    }
];

export default function CircularsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const filteredCirculars = circulars.filter(circular => {
        const matchesSearch = circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            circular.date.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMonth = selectedMonth === '' || circular.date.includes(selectedMonth);
        return matchesSearch && matchesMonth;
    });

    const months = ['Jun', 'Jul', 'Aug', 'Sep'];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src="/sebi-logo.png"
                            alt="SEBI Logo"
                            className="h-10 w-10 object-contain"
                        />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SEBI Circulars</h1>
                            <p className="text-xs sm:text-sm text-gray-600">Latest regulatory updates and guidelines</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search circulars..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base min-w-0 sm:min-w-[140px]"
                        >
                            <option value="">All Months</option>
                            {months.map(month => (
                                <option key={month} value={month}>{month} 2025</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Circulars List */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="space-y-3 sm:space-y-4">
                    {filteredCirculars.map((circular) => (
                        <Link
                            key={circular.id}
                            href={`/circulars/${circular.id}`}
                            className="block bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                                        <span className="text-xs sm:text-sm font-medium text-blue-600">{circular.date}</span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                                        {circular.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                                        {circular.content.substring(0, 150)}...
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCirculars.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No circulars found</h3>
                        <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>

            <BottomBar />
        </div>
    );
}
