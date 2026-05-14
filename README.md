# ElectIQ - AI-Powered Election Assistant

ElectIQ is a modern web application built with Next.js that empowers citizens to participate in democratic processes. Using advanced AI technology powered by Google Gemini, ElectIQ provides personalized assistance for voter registration, election information, and civic engagement.

## 🌟 Features

- **🤖 AI Chat Assistant**: Ask questions in plain language and get instant, personalized answers about elections and voting
- **📋 Step-by-Step Guide**: Follow personalized registration guides with progress tracking and XP rewards
- **📅 Interactive Timeline**: Visual election timeline from announcement to results, with Google Calendar integration
- **🗺️ Polling Station Finder**: Discover nearby polling booths and registration centers using Google Maps
- **🌐 Multi-Language Support**: Available in 8 languages with voice input/output via Web Speech API
- **🎮 Gamified Experience**: Earn XP, unlock badges, and level up as you complete your civic journey
- **📊 Election Data**: Comprehensive information for India and USA elections
- **🔍 Eligibility Checker**: Verify voting eligibility based on age and residency
- **❓ FAQ Section**: Common questions and answers about voting processes

## 🚀 Live Demo

Visit the deployed application: [https://electiq-495956506438.asia-south1.run.app/](https://electiq-495956506438.asia-south1.run.app/)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Frontend**: React 19, Tailwind CSS 4
- **Animations**: Framer Motion
- **AI**: Google Generative AI (Gemini)
- **Backend**: Firebase
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Maps**: Google Maps integration
- **Voice**: Web Speech API

## 📁 Project Structure

```
prompt-wars-h2s/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js          # Landing page
│   │   └── assistant/
│   │       └── page.js      # Main assistant interface
│   ├── components/
│   │   ├── ChatUI.js        # AI chat interface
│   │   ├── StepGuide.js     # Registration steps
│   │   ├── Timeline.js      # Election timeline
│   │   ├── MapPanel.js      # Polling station map
│   │   ├── FAQPanel.js      # Frequently asked questions
│   │   └── ...
│   ├── context/
│   │   └── AppContext.js    # Global app state
│   ├── data/
│   │   ├── india.json       # Election data for India
│   │   └── usa.json         # Election data for USA
│   └── services/
│       └── api.js           # Data processing functions
├── public/                  # Static assets
├── package.json
├── next.config.mjs
└── README.md
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google AI API key (for Gemini integration)
- Firebase project (for backend services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhisheksinghcodebase/prompt-wars-h2s.git
cd prompt-wars-h2s
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your API keys:
```env
GOOGLE_AI_API_KEY=your_google_ai_api_key
FIREBASE_API_KEY=your_firebase_api_key
# Add other Firebase config variables
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📊 Data Sources

The application includes comprehensive election data for:
- **India**: Voter eligibility, registration steps, polling methods, election timeline, FAQs
- **USA**: Similar data structure for US elections

Data is stored in JSON format in the `src/data/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- AI powered by [Google Gemini](https://ai.google.dev)
- Icons from [Lucide React](https://lucide.dev)
- Animations with [Framer Motion](https://www.framer.com/motion)

# Follow @abhisheksinghcodebase for more such projects
