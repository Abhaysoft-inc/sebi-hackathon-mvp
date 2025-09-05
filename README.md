# 🎯 EduFinX - Spreading Investing Knowledge (MVP)

**EduFinX** is a comprehensive financial education platform designed to enhance financial literacy in India through interactive learning experiences. Built for the SEBI Hackathon, this platform democratizes access to financial knowledge through gamified learning, multilingual support, and real-world case studies.

<!-- ![EduFinX Logo](public/logo.jpg) -->

## 🎥 Live Demo

<video src="public/sebi-hackathon-video-submission.webm" controls width="600"></video>

🎬 **[Click here to watch the full demo](https://www.youtube.com/watch?v=rAU94IH44_w)**


## 📸 App Screenshots

### 🏠 **Social Feed - Financial News & Updates**
<img src="public/screenshots/feed.png" alt="Social Feed" width="300"/>

### 📚 **Interactive Case Studies**
<img src="public/screenshots/case-studies.png" alt="Case Studies" width="300"/>

### 📊 **IPO Analysis Dashboard**
<img src="public/screenshots/ipos.png" alt="IPO Analysis" width="300"/>

### 🎯 **Gamified Quiz System**
<img src="public/screenshots/quizze.png" alt="Quiz System" width="300"/>

### 🏆 **Leaderboard & Competition**
<img src="public/screenshots/leaderboard.png" alt="Leaderboard" width="300"/>

### 🌍 **Multi-Language Support**
<img src="public/screenshots/multi-language-support.png" alt="Multi-Language Support" width="300"/>

### 🎤 **AI-Powered Voice Assistant**
<img src="public/screenshots/LLM-backed-voice-assistant.png" alt="Voice Assistant" width="300"/>

### 🤖 **AI Summary Generation**
<img src="public/screenshots/ai-summary.png" alt="AI Summary" width="300"/>

### 📋 **Latest SEBI Circulars**
<img src="public/screenshots/latest-sebi-circulars.png" alt="SEBI Circulars" width="300"/>


See how EduFinX transforms financial education through:
- 🎯 Interactive case studies and real-world scenarios
- 🌍 Seamless multilingual translation capabilities  
- 🎤 AI-powered voice assistant navigation
- 📊 Live IPO analysis with expert insights
- 🏆 Gamified learning with leaderboards
- 📱 Responsive design across all devices

## 🌟 Key Features

### 📚 **Interactive Learning Modules**
- **Case Studies**: Real-world financial scenarios with interactive challenges
- **Quizzes**: Ranked and practice quiz systems with scoring
- **IPO Analysis**: Live IPO data with expert opinions and financial metrics
- **SEBI Circulars**: Latest regulatory updates with multilingual translation

### 🌍 **Multilingual Support**
- Support for 10+ Indian languages (Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi)
- Real-time translation using NLP Cloud API
- Auto-translate functionality for complex financial terms
- Right-to-left (RTL) language support

### 🎮 **Gamification & Engagement**
- **Leaderboard System**: Track progress and compete with peers
- **Scoring System**: Points for completing cases and quizzes
- **Progress Tracking**: Monitor learning journey across modules
- **Stories Modal**: Interactive content discovery

### 🎤 **Voice Assistant Integration**
- Voice-controlled navigation using Web Speech API
- Hands-free browsing experience
- Natural language command processing
- Accessibility enhancement for visually impaired users

### 📱 **Modern User Experience**
- Responsive design optimized for mobile and desktop
- Dark/Light theme support
- Smooth animations and transitions
- Progressive Web App (PWA) capabilities

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Framework**: Next.js 15.5.2 with React 19.1.0
- **Styling**: Tailwind CSS 3.4.17 with custom components
- **Language**: TypeScript with strict type checking
- **State Management**: React Context API for global state
- **UI Components**: Custom component library with Lucide React icons

### **Backend & Database**
- **Database**: PostgreSQL with Prisma ORM 6.15.0
- **Authentication**: NextAuth.js 4.24.7 with multiple providers
- **API Routes**: RESTful API design with Next.js API routes
- **Data Validation**: Zod schema validation

### **External Integrations**
- **Translation API**: NLP Cloud for multilingual support
- **Voice Recognition**: Web Speech API for voice commands
- **PDF Generation**: jsPDF for document export
- **Search**: Fuse.js for fuzzy search capabilities

## 📂 Project Structure

```
client/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.cjs              # Database seeding
│   └── seed.ts               # TypeScript seed file
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   ├── cases/           # Case studies
│   │   ├── circulars/       # SEBI circulars
│   │   ├── feed/            # Social feed
│   │   ├── ipos/            # IPO analysis
│   │   ├── leaderboard/     # User rankings
│   │   ├── quiz/            # Quiz system
│   │   └── translation-demo/ # Translation features
│   ├── components/          # Reusable components
│   │   ├── landing/         # Landing page components
│   │   └── ui/             # UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── services/           # External service integrations
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── public/                 # Static assets
└── scripts/               # Database initialization scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Abhaysoft-inc/sebi-hackathon-mvp.git
cd sebi-hackathon-mvp/client
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/edufinx"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Translation API
NLPCLOUD_API_KEY="your-nlpcloud-api-key"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **Database Setup**
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run migrate:dev

# Seed the database with sample data
npm run seed
```

5. **Start Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Core Models
- **CaseStudy**: Interactive financial case studies with questions
- **QuizQuestion**: Multiple-choice questions for assessment
- **User**: User authentication and profile management
- **UserProgress**: Track learning progress and scores
- **IPO**: Initial Public Offering data and analysis
- **CaseGenerationLog**: Audit trail for AI-generated content

### Key Relationships
- Users can have multiple progress records across case studies
- Case studies contain multiple quiz questions
- IPOs have expert opinions and financial metrics
- Generation logs track AI content creation process

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Indigo primary with amber accents
- **Typography**: Geist Sans and Geist Mono fonts
- **Components**: Consistent button styles, form inputs, and cards
- **Animations**: Smooth transitions and loading states

### Accessibility
- WCAG 2.1 compliance
- Screen reader support
- Keyboard navigation
- High contrast mode
- Voice control integration

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/case-studies` - Fetch case studies
- `GET /api/ipos` - IPO listings with expert opinions
- `POST /api/translate` - Text translation service
- `GET /api/leaderboard` - User rankings

### Protected Endpoints
- `POST /api/submit-answer` - Submit quiz answers
- `GET /api/voice-index` - Voice command index
- `POST /admin/api/cases` - Create new case studies

## 🧪 Testing & Quality

### Code Quality
- ESLint configuration for code consistency
- TypeScript strict mode enabled
- Prettier for code formatting
- Husky pre-commit hooks

### Performance Optimization
- Next.js Image optimization
- Lazy loading for components
- Code splitting and bundling
- Responsive image delivery

## 🚢 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure all environment variables are properly configured for production deployment.

### Recommended Platforms
- **Vercel**: Seamless Next.js deployment
- **Railway**: PostgreSQL hosting
- **Supabase**: Database and authentication
- **Netlify**: Alternative hosting option

