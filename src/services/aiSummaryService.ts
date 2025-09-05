import { Post as PostType } from '../types/post';
import { AISummary } from '../types/aiSummary';

// Multilingual AI summary data
const summariesByLanguage: Record<string, Record<number, AISummary>> = {
    en: {
        1: {
            title: "SEBI Powers Analysis",
            keyPoints: [
                "SEBI has extensive regulatory authority over Indian securities markets",
                "Key powers include investigation, enforcement, and policy making",
                "Recent focus on protecting retail investors and market integrity"
            ],
            sentiment: "Informative",
            riskLevel: "Low",
            actionItems: [
                "Understand SEBI regulations if you're investing",
                "Follow SEBI guidelines for compliance",
                "Stay updated with regulatory changes"
            ],
            confidence: 92
        },
        2: {
            title: "Trading Profit Analysis",
            keyPoints: [
                "Small but consistent profits indicate good risk management",
                "Zerodha platform showing positive portfolio performance",
                "Conservative trading approach evident from the screenshot"
            ],
            sentiment: "Positive",
            riskLevel: "Medium",
            actionItems: [
                "Continue with disciplined trading approach",
                "Consider diversifying portfolio for better risk management",
                "Monitor market trends for timing decisions"
            ],
            confidence: 87
        },
        3: {
            title: "Market Update Summary",
            keyPoints: [
                "Quick market insights shared in video format",
                "Focus on current financial trends and opportunities",
                "Educational content for retail investors"
            ],
            sentiment: "Bullish",
            riskLevel: "Medium",
            actionItems: [
                "Research mentioned stocks before investing",
                "Verify information from multiple sources",
                "Consult financial advisor if needed"
            ],
            confidence: 89
        }
    },
    hi: {
        1: {
            title: "सेबी शक्तियों का विश्लेषण",
            keyPoints: [
                "सेबी के पास भारतीय प्रतिभूति बाजारों पर व्यापक नियामक अधिकार है",
                "मुख्य शक्तियों में जांच, प्रवर्तन और नीति निर्माण शामिल है",
                "खुदरा निवेशकों और बाजार की अखंडता की सुरक्षा पर हाल का ध्यान"
            ],
            sentiment: "सूचनात्मक",
            riskLevel: "कम",
            actionItems: [
                "यदि आप निवेश कर रहे हैं तो सेबी नियमों को समझें",
                "अनुपालन के लिए सेबी दिशानिर्देशों का पालन करें",
                "नियामक परिवर्तनों के साथ अपडेट रहें"
            ],
            confidence: 92
        },
        2: {
            title: "ट्रेडिंग लाभ विश्लेषण",
            keyPoints: [
                "छोटे लेकिन लगातार मुनाफे अच्छे जोखिम प्रबंधन का संकेत देते हैं",
                "जेरोधा प्लेटफॉर्म सकारात्मक पोर्टफोलियो प्रदर्शन दिखा रहा है",
                "स्क्रीनशॉट से रूढ़िवादी ट्रेडिंग दृष्टिकोण स्पष्ट है"
            ],
            sentiment: "सकारात्मक",
            riskLevel: "मध्यम",
            actionItems: [
                "अनुशासित ट्रेडिंग दृष्टिकोण जारी रखें",
                "बेहतर जोखिम प्रबंधन के लिए पोर्टफोलियो विविधीकरण पर विचार करें",
                "समय निर्णयों के लिए बाजार के रुझान पर नजर रखें"
            ],
            confidence: 87
        },
        3: {
            title: "बाजार अपडेट सारांश",
            keyPoints: [
                "वीडियो प्रारूप में त्वरित बाजार अंतर्दृष्टि साझा की गई",
                "वर्तमान वित्तीय रुझान और अवसरों पर ध्यान",
                "खुदरा निवेशकों के लिए शैक्षणिक सामग्री"
            ],
            sentiment: "तेजी",
            riskLevel: "मध्यम",
            actionItems: [
                "निवेश से पहले उल्लिखित स्टॉक्स पर शोध करें",
                "कई स्रोतों से जानकारी सत्यापित करें",
                "आवश्यकता होने पर वित्तीय सलाहकार से सलाह लें"
            ],
            confidence: 89
        }
    },
    mr: {
        1: {
            title: "सेबी अधिकार विश्लेषण",
            keyPoints: [
                "सेबीकडे भारतीय सिक्युरिटी मार्केट्सवर व्यापक नियामक अधिकार आहेत",
                "मुख्य अधिकारांमध्ये तपास, अंमलबजावणी आणि धोरण निर्मिती समाविष्ट आहे",
                "किरकोळ गुंतवणूकदार आणि बाजार अखंडतेच्या संरक्षणावर अलीकडील लक्ष"
            ],
            sentiment: "माहितीपूर्ण",
            riskLevel: "कमी",
            actionItems: [
                "जर तुम्ही गुंतवणूक करत असाल तर सेबी नियम समजून घ्या",
                "अनुपालनासाठी सेबी मार्गदर्शक तत्त्वांचे पालन करा",
                "नियामक बदलांसह अद्ययावत राहा"
            ],
            confidence: 92
        },
        2: {
            title: "ट्रेडिंग नफा विश्लेषण",
            keyPoints: [
                "लहान परंतु सातत्यपूर्ण नफा चांगल्या जोखीम व्यवस्थापनाचे संकेत देतो",
                "झेरोधा प्लॅटफॉर्म सकारात्मक पोर्टफोलिओ कामगिरी दाखवत आहे",
                "स्क्रीनशॉटवरून पुराणमतवादी ट्रेडिंग दृष्टिकोन स्पष्ट आहे"
            ],
            sentiment: "सकारात्मक",
            riskLevel: "मध्यम",
            actionItems: [
                "शिस्तबद्ध ट्रेडिंग दृष्टिकोन सुरू ठेवा",
                "चांगल्या जोखीम व्यवस्थापनासाठी पोर्टफोलिओ विविधीकरणाचा विचार करा",
                "वेळेच्या निर्णयांसाठी बाजार ट्रेंडचे निरीक्षण करा"
            ],
            confidence: 87
        },
        3: {
            title: "बाजार अपडेट सारांश",
            keyPoints: [
                "व्हिडिओ फॉर्मॅटमध्ये झटपट बाजार अंतर्दृष्टी सामायिक केली",
                "वर्तमान आर्थिक ट्रेंड आणि संधींवर लक्ष",
                "किरकोळ गुंतवणूकदारांसाठी शैक्षणिक सामग्री"
            ],
            sentiment: "तेजी",
            riskLevel: "मध्यम",
            actionItems: [
                "गुंतवणूक करण्यापूर्वी नमूद केलेल्या शेअर्सवर संशोधन करा",
                "अनेक स्रोतांकडून माहिती सत्यापित करा",
                "आवश्यकतेनुसार आर्थिक सल्लागाराचा सल्ला घ्या"
            ],
            confidence: 89
        }
    }
};

// Dummy AI summary data - In a real app, this would be an API call
export const generateAISummary = (post: PostType, language: string = 'en'): AISummary => {
    // Get summaries for the current language, fallback to English if not available
    const summaries = summariesByLanguage[language] || summariesByLanguage['en'];

    return summaries[post.id as keyof typeof summaries] || {
        title: language === 'hi' ? "सामग्री विश्लेषण" : language === 'mr' ? "सामग्री विश्लेषण" : "Content Analysis",
        keyPoints: language === 'hi' ? [
            "वित्तीय सामग्री का पता चला",
            "बाजार संबंधी चर्चा की पहचान की गई",
            "शैक्षणिक या सूचनात्मक प्रकृति"
        ] : language === 'mr' ? [
            "आर्थिक सामग्री आढळली",
            "बाजार संबंधित चर्चा ओळखली",
            "शैक्षणिक किंवा माहितीपूर्ण स्वरूप"
        ] : [
            "Financial content detected",
            "Market-related discussion identified",
            "Educational or informational nature"
        ],
        sentiment: language === 'hi' ? "तटस्थ" : language === 'mr' ? "तटस्थ" : "Neutral",
        riskLevel: language === 'hi' ? "कम" : language === 'mr' ? "कमी" : "Low",
        actionItems: language === 'hi' ? [
            "सामग्री की सावधानीपूर्वक समीक्षा करें",
            "विश्वसनीय स्रोतों के साथ क्रॉस-रेफरेंस करें",
            "आवश्यकता होने पर वित्तीय सलाहकार से सलाह लें"
        ] : language === 'mr' ? [
            "सामग्रीचे काळजीपूर्वक पुनरावलोकन करा",
            "विश्वसनीय स्रोतांसह क्रॉस-रेफरन्स करा",
            "आवश्यकतेनुसार आर्थिक सल्लागाराचा सल्ला घ्या"
        ] : [
            "Review content carefully",
            "Cross-reference with reliable sources",
            "Consult financial advisor if needed"
        ],
        confidence: 75
    };
};

// Simulate AI processing with a delay
export const processAISummary = async (post: PostType, language: string = 'en'): Promise<AISummary> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const summary = generateAISummary(post, language);
            resolve(summary);
        }, 1500); // 1.5 second delay to simulate API call
    });
};
