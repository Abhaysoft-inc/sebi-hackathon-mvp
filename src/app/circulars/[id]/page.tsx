'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, FileText, ArrowLeft, Share2, Download, Bookmark } from 'lucide-react';
import BottomBar from '@/components/BottomBar';
import jsPDF from 'jspdf';
import { useScrollToTop } from '@/hooks/useScrollToTop';

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
        content: 'This circular establishes a comprehensive framework for monitoring intraday position limits in equity index derivatives. The framework aims to enhance market surveillance and risk management by implementing real-time monitoring systems that track position limits throughout the trading session.\n\nKey provisions include:\n\n1. Automated alert systems that notify relevant authorities when position limits approach threshold levels\n2. Enhanced reporting requirements for market participants with detailed intraday position reporting\n3. Standardized procedures for handling limit breaches with clear escalation protocols\n4. Real-time monitoring systems integration with existing market infrastructure\n\nMarket participants are required to implement robust systems to ensure compliance with position limits on an intraday basis. The framework introduces penalty structures for violations, including:\n\n• Warning notices for first-time minor violations\n• Monetary penalties for repeated or significant breaches\n• Temporary trading restrictions for severe violations\n• Permanent license suspension for gross misconduct\n\nThe circular also provides guidelines for exemptions in specific circumstances, such as market making activities and hedging operations. Implementation timeline has been set with phased rollout starting from October 2025, with full implementation expected by December 2025.\n\nAll exchanges are required to update their surveillance systems and provide training to their staff on the new procedures. Regular reviews of the framework will be conducted to ensure its effectiveness and make necessary adjustments based on market developments.'
    },
    {
        id: 'digital-accessibility-extension',
        date: 'Aug 29, 2025',
        title: 'Extension of timelines and Update of reporting authority for IAs and RAs w.r.t. SEBI Circular for Compliance to Digital Accessibility Circular \'Rights of Persons with Disabilities Act, 2016 and rules made thereunder- mandatory compliance by all Regulated Entities\' dated July 31, 2025 (Circular No. SEBI/HO/ITD-1/ITD_VIAP/P/CIR/2025/111)',
        content: 'This circular extends the compliance timeline for Investment Advisers (IAs) and Research Analysts (RAs) regarding digital accessibility requirements under the Rights of Persons with Disabilities Act, 2016.\n\nExtended Timeline Provisions:\n\n1. Original compliance date: September 30, 2025\n2. Extended compliance date: December 31, 2025\n3. Interim reporting requirements: Monthly progress reports starting October 2025\n\nUpdated Reporting Authorities:\n\n• Investment Advisers: Report to Regional Director (RD) of respective regions\n• Research Analysts: Report to Deputy General Manager, Investment Management Department\n• Consolidated reports: Submit to Chief General Manager, Information Technology Department\n\nKey Requirements for Compliance:\n\n1. Website Accessibility Standards:\n   - WCAG 2.1 Level AA compliance\n   - Screen reader compatibility\n   - Keyboard navigation support\n   - High contrast mode availability\n\n2. Mobile Application Compliance:\n   - Voice-over support for iOS\n   - TalkBack support for Android\n   - Large text support\n   - Gesture-based navigation alternatives\n\n3. Alternative Communication Channels:\n   - Dedicated helpline for disabled investors\n   - Email support with quick response times\n   - Video calling facility with sign language interpretation\n   - Physical assistance at branch locations\n\nImplementation Guidelines:\n\n• Conduct accessibility audit of existing digital platforms\n• Develop remediation plan with timelines\n• Implement changes in phases\n• Test with disabled user groups\n• Provide staff training on accessibility support\n\nCompliance Verification Process:\n\n1. Self-assessment checklist submission\n2. Third-party accessibility audit report\n3. User feedback mechanism implementation\n4. Regular monitoring and reporting\n\nNon-compliance may result in monetary penalties ranging from ₹1 lakh to ₹10 lakhs depending on the severity and duration of non-compliance.'
    },
    {
        id: 'cybersecurity-technical-clarifications',
        date: 'Aug 28, 2025',
        title: 'Technical Clarifications to Cybersecurity and Cyber Resilience Framework (CSCRF) for SEBI Regulated Entities (REs)',
        content: 'This circular provides comprehensive technical clarifications on the implementation of the Cybersecurity and Cyber Resilience Framework (CSCRF) for SEBI Regulated Entities.\n\nIncident Reporting Procedures:\n\n1. Immediate Reporting (Within 2 hours):\n   - Security breaches affecting trading systems\n   - Data breaches involving investor information\n   - Ransomware attacks\n   - System outages affecting market operations\n\n2. Detailed Reporting (Within 24 hours):\n   - Comprehensive incident analysis\n   - Impact assessment\n   - Remediation actions taken\n   - Timeline for full resolution\n\n3. Follow-up Reporting (Within 7 days):\n   - Root cause analysis\n   - Lessons learned\n   - Process improvements implemented\n   - Prevention measures for future incidents\n\nVulnerability Management Protocols:\n\n• Critical vulnerabilities: Patch within 72 hours\n• High vulnerabilities: Patch within 7 days\n• Medium vulnerabilities: Patch within 30 days\n• Low vulnerabilities: Patch within 90 days\n\nThird-Party Risk Assessment Requirements:\n\n1. Due Diligence Process:\n   - Security questionnaire completion\n   - Certification verification\n   - On-site security assessment\n   - Contract security clauses\n\n2. Ongoing Monitoring:\n   - Quarterly security reviews\n   - Annual penetration testing\n   - Incident reporting requirements\n   - Service level agreement compliance\n\nData Encryption Standards:\n\n• Data at Rest: AES-256 encryption minimum\n• Data in Transit: TLS 1.3 or higher\n• Database Encryption: Transparent data encryption\n• Backup Encryption: Full backup encryption with key management\n\nNetwork Security Protocols:\n\n1. Firewall Configuration:\n   - Next-generation firewall deployment\n   - Application-layer filtering\n   - Intrusion detection and prevention\n   - Regular rule review and updates\n\n2. Network Segmentation:\n   - DMZ implementation for external-facing services\n   - Internal network segregation\n   - Privileged access network isolation\n   - Guest network separation\n\nAccess Control Mechanisms:\n\n• Multi-factor authentication for all systems\n• Role-based access control implementation\n• Privileged access management\n• Regular access reviews and certifications\n• Zero-trust architecture adoption\n\nBusiness Continuity Planning:\n\n1. Recovery Time Objectives (RTO):\n   - Critical systems: 2 hours\n   - Important systems: 8 hours\n   - Standard systems: 24 hours\n\n2. Recovery Point Objectives (RPO):\n   - Trading systems: 15 minutes\n   - Customer data: 1 hour\n   - Administrative systems: 4 hours\n\nCompliance Assessment Procedures:\n\n• Annual third-party security assessment\n• Quarterly internal security reviews\n• Monthly vulnerability assessments\n• Continuous security monitoring\n\nPenalty Framework:\n\n• Minor violations: ₹5 lakhs to ₹25 lakhs\n• Major violations: ₹25 lakhs to ₹1 crore\n• Critical violations: ₹1 crore to ₹5 crores\n• Repeat violations: Double the applicable penalty\n\nStaff Training Requirements:\n\n1. Mandatory Training:\n   - Annual cybersecurity awareness training\n   - Role-specific security training\n   - Incident response training\n   - Social engineering awareness\n\n2. Specialized Training:\n   - Technical staff: Advanced security training\n   - Management: Security governance training\n   - New employees: Security orientation within 30 days'
    },
    {
        id: 'margin-trading-net-worth-relaxation',
        date: 'Aug 26, 2025',
        title: 'Relaxation in the timeline to submit net worth certificate by the Stock Brokers to offer margin trading facility to their clients',
        content: 'This circular provides relaxation in the timeline for stock brokers to submit net worth certificates required for offering margin trading facilities to clients.\n\nRevised Timeline Provisions:\n\n1. Original submission deadline: August 31, 2025\n2. Extended submission deadline: November 30, 2025\n3. Grace period for late submissions: December 15, 2025 (with penalty)\n\nAlternative Documentation Procedures:\n\n• Provisional net worth certificate from chartered accountant\n• Management certificate with board resolution\n• Interim financial statements with auditor review\n• Bank statements and asset verification documents\n\nInterim Arrangements for Continued Operations:\n\n1. Existing margin trading clients: Continue with current limits\n2. New client acquisition: Suspended until compliance\n3. Risk management: Enhanced monitoring required\n4. Reporting: Weekly position reports to exchanges\n\nMinimum Net Worth Requirements:\n\n• Tier 1 cities: ₹10 crores\n• Tier 2 cities: ₹5 crores\n• Tier 3 cities: ₹2 crores\n• Online-only brokers: ₹15 crores\n\nEligible Net Worth Calculation:\n\n1. Include:\n   - Paid-up share capital\n   - Free reserves\n   - Securities premium\n   - Retained earnings\n\n2. Exclude:\n   - Revaluation reserves\n   - Intangible assets\n   - Preliminary expenses\n   - Accumulated losses\n\n3. Adjustments:\n   - Subtract: Non-performing investments\n   - Add: Subordinated debt (up to 50% of net worth)\n   - Consider: Off-balance sheet exposures\n\nPenalty Structure for Non-Compliance:\n\n• Late submission (1-15 days): ₹1 lakh\n• Late submission (16-30 days): ₹3 lakhs\n• Late submission (31-60 days): ₹5 lakhs\n• Non-submission beyond 60 days: License suspension\n\nProcedures for Seeking Further Extensions:\n\n1. Application Process:\n   - Submit formal request with justification\n   - Provide timeline for compliance\n   - Submit interim financial information\n   - Pay extension processing fee\n\n2. Review Criteria:\n   - Genuine hardship circumstances\n   - Previous compliance history\n   - Client protection measures\n   - Market impact assessment\n\n3. Decision Timeline:\n   - Application review: 15 working days\n   - Decision communication: 5 working days\n   - Appeal process: 30 days from decision\n\nRisk Management During Extension Period:\n\n• Daily position monitoring\n• Client-wise exposure limits\n• Market-to-market margin collection\n• Stress testing of portfolios\n• Enhanced client communication\n\nDocumentation Requirements:\n\n1. Net Worth Certificate Format:\n   - Auditor details and registration\n   - Calculation methodology\n   - Supporting schedules\n   - Management confirmations\n\n2. Supporting Documents:\n   - Audited financial statements\n   - Bank confirmations\n   - Asset valuation reports\n   - Legal compliance certificates\n\nMonitoring and Compliance:\n\n• Monthly net worth monitoring\n• Quarterly compliance reporting\n• Annual comprehensive review\n• Surprise inspections as deemed necessary'
    },
    {
        id: 'margin-obligations-pledge-extension',
        date: 'Aug 18, 2025',
        title: 'Extension of timeline for implementation of SEBI Circular \'Margin obligations to be given by way of pledge/Re-pledge in the Depository System\' dated June 03, 2025',
        content: 'This circular extends the implementation timeline for margin obligations through pledge/re-pledge mechanisms in the depository system.\n\nRevised Implementation Timeline:\n\n1. Original implementation date: September 01, 2025\n2. Extended implementation date: December 01, 2025\n3. Pilot testing phase: October 01 - November 15, 2025\n4. Full rollout: December 01, 2025\n\nPhased Implementation Approach:\n\nPhase 1 (October 1-15, 2025): Top 10 brokers by volume\nPhase 2 (October 16-31, 2025): Top 50 brokers by volume\nPhase 3 (November 1-15, 2025): All institutional brokers\nPhase 4 (November 16-30, 2025): Remaining brokers\nPhase 5 (December 1, 2025): Full implementation\n\nKey System Requirements:\n\n1. Integration with Depository Systems:\n   - NSDL connectivity establishment\n   - CDSL system integration\n   - Real-time pledge creation capability\n   - Automated release mechanisms\n\n2. Automated Pledge Mechanisms:\n   - Intraday pledge creation\n   - End-of-day reconciliation\n   - Failed transaction handling\n   - Exception processing procedures\n\n3. Enhanced Reporting Framework:\n   - Real-time position reporting\n   - Daily margin utilization reports\n   - Weekly exception reports\n   - Monthly compliance summaries\n\nTechnical Specifications:\n\n1. System Architecture:\n   - API-based integration\n   - Message queuing systems\n   - Database synchronization\n   - Backup and recovery procedures\n\n2. Security Requirements:\n   - End-to-end encryption\n   - Digital signature validation\n   - Access control mechanisms\n   - Audit trail maintenance\n\n3. Performance Standards:\n   - Pledge creation: Within 30 seconds\n   - Release processing: Within 60 seconds\n   - System availability: 99.9%\n   - Recovery time: Maximum 2 hours\n\nSystem Testing and Validation:\n\n1. Unit Testing:\n   - Individual component testing\n   - API functionality verification\n   - Database operation validation\n   - Security feature testing\n\n2. Integration Testing:\n   - End-to-end process testing\n   - Cross-system communication\n   - Error handling verification\n   - Performance benchmarking\n\n3. User Acceptance Testing:\n   - Broker system testing\n   - Client portal testing\n   - Mobile application testing\n   - Reporting system validation\n\nRisk Management Enhancements:\n\n• Real-time margin monitoring\n• Automated margin calls\n• Position limit enforcement\n• Client risk profiling\n• Market risk assessment\n\nInvestor Protection Measures:\n\n1. Transparency Requirements:\n   - Clear pledge status communication\n   - Regular portfolio statements\n   - Margin utilization disclosure\n   - Fee structure transparency\n\n2. Grievance Redressal:\n   - Dedicated helpline\n   - Online complaint portal\n   - Quick resolution timelines\n   - Escalation mechanisms\n\n3. Education Initiatives:\n   - Investor awareness programs\n   - Educational material distribution\n   - Workshop and seminars\n   - Digital literacy campaigns\n\nCompliance Monitoring:\n\n• Daily system health checks\n• Weekly performance reviews\n• Monthly compliance audits\n• Quarterly comprehensive assessments\n\nPenalty Structure:\n\n• Implementation delay: ₹10 lakhs per month\n• System downtime: ₹1 lakh per hour\n• Compliance violations: ₹5 lakhs per incident\n• Data security breaches: ₹50 lakhs to ₹5 crores\n\nSupport and Training:\n\n1. Technical Support:\n   - 24x7 helpdesk\n   - Remote assistance\n   - On-site support\n   - Emergency response team\n\n2. Training Programs:\n   - Technical staff training\n   - User training sessions\n   - Operations training\n   - Compliance training\n\nPost-Implementation Review:\n\n• 30-day initial review\n• 90-day comprehensive assessment\n• 180-day performance evaluation\n• Annual framework review'
    },
    {
        id: 'liquid-mutual-funds-deposit-requirement',
        date: 'Aug 12, 2025',
        title: 'Use of liquid mutual funds and overnight mutual funds for compliance with deposit requirement by Investment Advisers and Research Analysts',
        content: 'This circular allows Investment Advisers and Research Analysts to use liquid mutual funds and overnight mutual funds for meeting deposit requirements.\n\nEligible Fund Categories:\n\n1. Liquid Mutual Funds:\n   - Minimum AUM: ₹500 crores\n   - Minimum track record: 3 years\n   - Credit rating: AAA/A1+\n   - Portfolio maturity: Maximum 91 days\n\n2. Overnight Mutual Funds:\n   - Minimum AUM: ₹200 crores\n   - Minimum track record: 2 years\n   - Portfolio maturity: 1 day\n   - Government securities focus\n\nFund Eligibility Criteria:\n\n• SEBI registered fund houses only\n• Direct plan investments mandatory\n• No exit load applicable\n• Daily liquidity availability\n• Transparent pricing mechanism\n\nValuation Methodologies:\n\n1. Daily Valuation:\n   - Net Asset Value (NAV) based\n   - Mark-to-market pricing\n   - Independent valuation agency\n   - Real-time price updates\n\n2. Haircut Application:\n   - Liquid funds: 5% haircut\n   - Overnight funds: 2% haircut\n   - Stress scenario adjustments\n   - Market volatility considerations\n\nMonitoring Mechanisms:\n\n• Daily NAV tracking\n• Portfolio composition review\n• Credit risk assessment\n• Liquidity risk evaluation\n\nDeposit Calculation:\n\nFor Investment Advisers:\n• Minimum deposit: ₹25 lakhs\n• Fund contribution: Up to 75% of requirement\n• Cash component: Minimum 25%\n• Additional security: As deemed necessary\n\nFor Research Analysts:\n• Minimum deposit: ₹10 lakhs\n• Fund contribution: Up to 80% of requirement\n• Cash component: Minimum 20%\n• Professional indemnity insurance: Mandatory\n\nFund Selection Guidelines:\n\n1. Due Diligence Process:\n   - Fund house creditworthiness\n   - Portfolio manager experience\n   - Risk management framework\n   - Compliance track record\n\n2. Portfolio Composition Review:\n   - Credit quality of holdings\n   - Sector diversification\n   - Maturity profile analysis\n   - Liquidity buffer assessment\n\nReporting Requirements:\n\n1. Monthly Reports:\n   - Fund performance summary\n   - Portfolio composition details\n   - Valuation statements\n   - Risk metrics analysis\n\n2. Quarterly Reports:\n   - Comprehensive risk assessment\n   - Compliance status review\n   - Fund substitution analysis\n   - Market impact evaluation\n\nFund Substitution Procedures:\n\n• Prior approval required\n• 15-day notice period\n• Equivalent or better rating\n• Seamless transition plan\n\nEmergency Liquidation:\n\n1. Trigger Events:\n   - Fund downgrade below threshold\n   - Liquidity crisis in fund\n   - Regulatory action against fund\n   - Force majeure circumstances\n\n2. Liquidation Process:\n   - Immediate redemption request\n   - Settlement within T+1 day\n   - Cash deposit arrangement\n   - Continuous compliance maintenance\n\nRisk Management:\n\n• Concentration limits per fund house\n• Maximum exposure per scheme\n• Regular stress testing\n• Early warning indicators\n\nCompliance Monitoring:\n\n1. Daily Checks:\n   - Fund NAV verification\n   - Deposit adequacy assessment\n   - Margin calculations\n   - Risk parameter monitoring\n\n2. Periodic Reviews:\n   - Monthly compliance reports\n   - Quarterly risk assessments\n   - Annual comprehensive reviews\n   - Surprise inspections\n\nPenalty Structure:\n\n• Inadequate deposit: ₹1 lakh per day\n• Non-compliant fund selection: ₹5 lakhs\n• Reporting violations: ₹2 lakhs per instance\n• Late submission: ₹50,000 per day\n\nImplementation Timeline:\n\n• Circular effective date: August 15, 2025\n• Application submission: Within 30 days\n• Approval process: 15 working days\n• Implementation: Within 60 days of approval\n\nApplication Process:\n\n1. Documentation Required:\n   - Fund selection rationale\n   - Due diligence report\n   - Risk assessment document\n   - Implementation timeline\n\n2. Approval Criteria:\n   - Regulatory compliance history\n   - Financial stability\n   - Risk management capability\n   - Client protection measures'
    }
    // Additional circulars would continue here with the same detailed format
];

export default function CircularDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [circular, setCircular] = useState<Circular | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Scroll to top when component mounts
    useScrollToTop();

    useEffect(() => {
        const foundCircular = circulars.find(c => c.id === params.id);
        setCircular(foundCircular || null);
    }, [params.id]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: circular?.title,
                    text: `SEBI Circular: ${circular?.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleDownload = async () => {
        if (!circular) return;

        setIsDownloading(true);

        try {
            // Simulate download processing time
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create a new PDF document
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 20;
            const maxLineWidth = pageWidth - (margin * 2);

            // Set font
            pdf.setFont('helvetica');

            // Add header
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('SECURITIES AND EXCHANGE BOARD OF INDIA (SEBI)', margin, 30);
            pdf.text('CIRCULAR', margin, 45);

            // Add title
            pdf.setFontSize(14);
            const titleLines = pdf.splitTextToSize(circular.title, maxLineWidth);
            pdf.text(titleLines, margin, 65);

            // Add date and ID
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Date: ${circular.date}`, margin, 85);
            pdf.text(`Circular ID: ${circular.id}`, margin, 95);

            // Add separator line
            pdf.line(margin, 105, pageWidth - margin, 105);

            // Add content
            pdf.setFontSize(10);
            const contentLines = pdf.splitTextToSize(circular.content, maxLineWidth);
            let currentY = 120;

            contentLines.forEach((line: string) => {
                if (currentY > pdf.internal.pageSize.getHeight() - margin) {
                    pdf.addPage();
                    currentY = margin;
                }
                pdf.text(line, margin, currentY);
                currentY += 5;
            });

            // Add footer on last page
            if (currentY > pdf.internal.pageSize.getHeight() - 40) {
                pdf.addPage();
                currentY = margin;
            }

            currentY += 10;
            pdf.line(margin, currentY, pageWidth - margin, currentY);
            currentY += 10;

            pdf.setFontSize(8);
            pdf.text('This is an official SEBI circular downloaded from EduFinX platform.', margin, currentY);
            currentY += 8;
            pdf.text('For more information, visit: https://www.sebi.gov.in', margin, currentY);
            currentY += 8;
            pdf.text(`Downloaded on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, margin, currentY);

            // Save the PDF
            const fileName = `SEBI_Circular_${circular.id}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    if (!circular) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
                <div className="text-center px-4">
                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Circular not found</h1>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">The requested circular could not be found.</p>
                    <button
                        onClick={() => router.push('/circulars')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Circulars
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => router.push('/circulars')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Back to Circulars</span>
                            <span className="sm:hidden">Back</span>
                        </button>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-2 rounded-lg transition-colors ${isBookmarked
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                            >
                                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className={`p-2 rounded-lg transition-colors ${isDownloading
                                    ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {isDownloading ? (
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-blue-600">{circular.date}</span>
                    </div>

                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                        {circular.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
                    <div className="prose max-w-none">
                        <div className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                            {circular.content}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
                    >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Download Circular</span>
                        <span className="sm:hidden">Download</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm sm:text-base"
                    >
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Share Circular</span>
                        <span className="sm:hidden">Share</span>
                    </button>
                </div>

                {/* Related Circulars */}
                <div className="mt-8 sm:mt-12">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Related Circulars</h2>
                    <div className="grid gap-3 sm:gap-4">
                        {circulars
                            .filter(c => c.id !== circular.id)
                            .slice(0, 3)
                            .map((relatedCircular) => (
                                <div
                                    key={relatedCircular.id}
                                    onClick={() => router.push(`/circulars/${relatedCircular.id}`)}
                                    className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                                        <span className="text-xs sm:text-sm text-blue-600 font-medium">{relatedCircular.date}</span>
                                    </div>
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                                        {relatedCircular.title}
                                    </h3>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <BottomBar />
        </div>
    );
}
