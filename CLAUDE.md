# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Phase 1 (Infrastructure Setup): COMPLETE
- Git repository initialized
- React 18 + TypeScript + Vite project scaffolded
- All dependencies installed and verified
- Directory structure created
- Environment configuration ready
- Build process verified successful

## Tech Stack

- **Frontend:** React 18.3.1 + TypeScript 5.6.2 + Vite 6.0.5
- **Styling:** Tailwind CSS 4.1.14 + Framer Motion 12.23.24
- **UI Utilities:** clsx, class-variance-authority, tailwind-merge
- **Icons:** lucide-react 0.545.0
- **Deployment:** Vercel with serverless functions (@vercel/node 5.3.26)
- **AI APIs:** Anthropic Claude & Google Gemini

## Getting Started

### Development Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your API keys to `.env.local`:
   - ANTHROPIC_API_KEY (from https://console.anthropic.com/)
   - GEMINI_API_KEY (from https://aistudio.google.com/)

### Project Structure

```
notmyfault/
├── api/                  # Vercel serverless functions
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   └── ui/         # Reusable UI components
│   ├── lib/            # Utility functions (cn() helper included)
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── .env.local          # Local environment variables (gitignored)
├── .env.example        # Environment variables template
├── vercel.json         # Vercel deployment configuration
└── package.json        # Dependencies and scripts
```

## Architecture

### Frontend Architecture
- **Framework:** React with TypeScript for type safety
- **Bundler:** Vite for fast development and optimized builds
- **Styling:** Tailwind CSS with PostCSS processing
- **Animations:** Framer Motion for smooth interactions

### Backend Architecture
- **Serverless Functions:** Vercel Edge Functions in `/api` directory
- **API Proxy:** Functions hide API keys and handle external API calls
- **Environment:** Secure key management via Vercel environment variables

### Security Considerations
- API keys stored in `.env.local` (never committed)
- Serverless functions act as secure proxy for API calls
- `.gitignore` prevents sensitive data exposure

## Current State

The project foundation is fully initialized and ready for development. Next phases:
- Phase 2: UI Component Development
- Phase 3: Serverless API Functions
- Phase 4: AI Integration
- Phase 5: Deployment to Vercel

## Notes

- Build verified successful (1.41s build time)
- Dev server starts successfully (323ms)
- No blocking issues
- 4 npm audit warnings in @vercel/node (development-only dependencies, non-critical)
