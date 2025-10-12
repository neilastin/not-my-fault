# Not My Fault

An interactive web application for creative blame shifting using AI.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Deployment:** Vercel with serverless functions
- **AI Integration:** Anthropic Claude & Google Gemini APIs

## Project Structure

```
notmyfault/
├── api/                  # Vercel serverless functions (API routes)
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   └── ui/         # Reusable UI components
│   ├── lib/            # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles with Tailwind directives
├── .env.local          # Local environment variables (gitignored)
├── .env.example        # Environment variables template
└── vercel.json         # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Anthropic API key (from https://console.anthropic.com/)
- Google Gemini API key (from https://aistudio.google.com/)

### Installation

1. Clone the repository (once GitHub repo is created):
```bash
git clone <repository-url>
cd notmyfault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your API keys to `.env.local`

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel dashboard
3. Configure environment variables in Vercel project settings
4. Deploy!

## Security Notes

- Never commit `.env.local` to version control
- API keys are securely stored in Vercel environment variables
- Serverless functions act as a proxy to hide API keys from the client

## Development Status

Phase 1 (Infrastructure Setup): Complete
- Git repository initialized
- Vite + React + TypeScript configured
- Tailwind CSS + Framer Motion installed
- Directory structure created
- Environment files configured
- Build verified successful

## License

TBD
