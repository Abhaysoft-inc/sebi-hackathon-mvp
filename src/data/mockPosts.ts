import { Post } from '../types/post';

export const mockPosts: Post[] = [
    {
        id: 1,
        user: {
            name: "SEBI",
            avatar: "https://rna-cs.com/wp-content/uploads/2021/08/R-A-website-Blog-Images-New-size.png",
            isVerified: true,
        },
        type: "image",
        image: "https://lh3.googleusercontent.com/JhwI4D-ir5r92n9vM4R6hYPKfn4VWCnc9eUfR776FRleclGiTeLmpgvLK6g1eEz0Yl_R-o7ykhksx7hsnkDFi4186u_Jcw966Rb_RXOoqrcl18j-B7accRmihoCfKA",
        caption: "Powers of SEBI!",
        likes: 120,
        comments: [
            { user: "Jane", text: "Amazing view!" },
            { user: "Alex", text: "Love this!" },
        ],
    },
    {
        id: 2,
        user: {
            name: "Abhay",
            avatar: "https://avatars.githubusercontent.com/u/57512017?v=4",
            isVerified: true,
        },
        type: "image",
        image: "https://s3.ap-south-1.amazonaws.com/staticassets.zerodha.net/support-portal/2022/03/16/Article/N0GSVUD0_Untitled_22_2.png",
        caption: "A little profit",
        likes: 89,
        comments: [
            { user: "Chris", text: "Looks fun!" },
        ],
    },
    {
        id: 3,
        user: {
            name: "Alex Rivera",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            isVerified: true,
        },
        type: "short_video",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        caption: "Quick market update! 📈 #StockTips #FinancialAdvice",
        likes: 245,
        duration: "0:45",
        comments: [
            { user: "Sarah", text: "Great insights!" },
            { user: "Mike", text: "Thanks for the tip!" },
            { user: "Lisa", text: "More videos like this please!" },
        ],
    },
    {
        id: 4,
        user: {
            name: "Financial Guru",
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
            isVerified: true,
        },
        type: "long_video",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
        caption: "Complete Guide to Investment Portfolio Diversification 💼 Learn the fundamentals of building a balanced investment portfolio",
        likes: 892,
        duration: "12:34",
        comments: [
            { user: "David", text: "Excellent explanation!" },
            { user: "Emma", text: "This helped me understand diversification better" },
            { user: "James", text: "Can you make more educational content?" },
        ],
    },
    {
        id: 5,
        user: {
            name: "Economic Times",
            avatar: "https://img.etimg.com/thumb/msid-70418161,width-300,height-225,imgsize-252215,,resizemode-75/et-logo.jpg",
            isVerified: true,
        },
        type: "article",
        articleTitle: "RBI Announces New Monetary Policy: Key Rate Cuts Expected",
        articleContent: "The Reserve Bank of India is set to announce major policy changes that could impact interest rates across the banking sector. Financial experts predict a potential rate cut of 0.25% to boost economic growth...",
        articleImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
        articleLink: "https://economictimes.com/news/economy/policy",
        caption: "Breaking: RBI's latest monetary policy could reshape India's financial landscape 🏛️ #RBI #MonetaryPolicy #FinanceNews",
        likes: 1250,
        comments: [
            { user: "InvestorPro", text: "Finally! This will help boost investments" },
            { user: "MarketWatch", text: "Great news for borrowers" },
            { user: "FinanceGuru", text: "This could impact stock markets significantly" },
        ],
    },
    {
        id: 6,
        user: {
            name: "Business Today",
            avatar: "https://akm-img-a-in.tosshub.com/businesstoday/resource/images/logo-bt.png",
            isVerified: true,
        },
        type: "article",
        articleTitle: "Top 10 Mutual Funds That Outperformed in 2024",
        articleContent: "Our comprehensive analysis reveals the best performing mutual funds this year. These funds have consistently delivered returns above 15% and maintained low expense ratios. Here's what makes them stand out...",
        articleImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
        articleLink: "https://businesstoday.in/markets/mutual-funds",
        caption: "Investment alert! 📊 These mutual funds are crushing it this year. Which ones are in your portfolio? #MutualFunds #Investment #Returns",
        likes: 890,
        comments: [
            { user: "RetailInvestor", text: "SIP in progress for 3 of these!" },
            { user: "WealthBuilder", text: "Great research, very helpful" },
        ],
    },
];