# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**Current Phase: Phase 2 - UI Components & Local Development (COMPLETE)**

### Completed Phases

**Phase 1 (Infrastructure Setup): COMPLETE**
- Git repository initialized and synced to GitHub
- React 18 + TypeScript + Vite project scaffolded
- All dependencies installed and verified
- Directory structure created
- Environment configuration ready
- Build process verified successful

**Phase 2 (UI Components & Local Development): COMPLETE**
- All React components built and working:
  - Header (navigation with logo)
  - Hero (landing section)
  - ExcuseForm (input form for excuse generation)
  - ExcuseCards (display generated excuses)
  - LoadingAnimation (loading state)
  - ErrorMessage (error handling)
- Tailwind CSS v4 configured correctly with custom theme
- Custom local development server created (dev-server.js)
- API integration working with Claude API
- Environment variables properly loaded
- **Excuse generation fully functional locally**

## Tech Stack

- **Frontend:** React 18.3.1 + TypeScript 5.6.2 + Vite 6.0.5
- **Styling:** Tailwind CSS 4.1.14 + Framer Motion 12.23.24
- **UI Utilities:** clsx, class-variance-authority, tailwind-merge
- **Icons:** lucide-react 0.545.0
- **Dev Tools:** tsx 4.20.6, concurrently 9.2.1, dotenv 17.2.3
- **Deployment:** Vercel with serverless functions (@vercel/node 5.3.26)
- **AI APIs:** Anthropic Claude & Google Gemini

## Getting Started

### First-Time Setup on a New Computer

1. **Clone the repository:**
   ```bash
   git clone https://github.com/neilastin/not-my-fault.git
   cd not-my-fault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   Create a file called `.env.local` in the project root with your API keys:
   ```
   ANTHROPIC_API_KEY=your-anthropic-key-here
   GEMINI_API_KEY=your-gemini-key-here
   ```
   **IMPORTANT:** No quotes around values, one variable per line

4. **Start development:**
   ```bash
   npm run dev
   ```

### Development Commands

```bash
npm run dev      # Start BOTH Vite dev server AND API server (required!)
npm run dev:vite # Start only Vite (frontend only, API won't work)
npm run dev:api  # Start only API server (backend only)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**IMPORTANT:** Always use `npm run dev` (not `npm run dev:vite`) to run both servers together!

### Project Structure

```
notmyfault/
├── api/                     # Vercel serverless functions
│   ├── generate-excuses.ts # Claude API integration (COMPLETE)
│   └── generate-image.ts   # Gemini image API (NOT YET IMPLEMENTED)
├── public/                  # Static assets
├── src/
│   ├── components/         # React components (ALL COMPLETE)
│   │   ├── Header.tsx      # Navigation header with logo
│   │   ├── Hero.tsx        # Landing hero section
│   │   ├── ExcuseForm.tsx  # Form for excuse generation
│   │   ├── ExcuseCards.tsx # Display generated excuses
│   │   ├── ExcuseCard.tsx  # Individual excuse card
│   │   ├── LoadingAnimation.tsx  # Loading state
│   │   └── ErrorMessage.tsx      # Error display
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # cn() helper for Tailwind classes
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles with Tailwind v4 theme
├── dev-server.js           # Custom local API server (IMPORTANT!)
├── .env.local              # Local environment variables (gitignored - MUST CREATE)
├── .env.example            # Environment variables template
├── vite.config.ts          # Vite config with API proxy
├── tailwind.config.js      # Tailwind v4 config (minimal)
├── vercel.json             # Vercel deployment configuration
└── package.json            # Dependencies and scripts
```

## Architecture

### Frontend Architecture
- **Framework:** React with TypeScript for type safety
- **Bundler:** Vite for fast development and optimized builds
- **Styling:** Tailwind CSS v4 with custom dark theme
  - **IMPORTANT:** Tailwind v4 uses `@theme` directive in CSS (not tailwind.config.js)
  - Custom theme defined in `src/index.css` using CSS variables
  - Dark background (#0a0a0a) with neon accents (green, blue, purple)
- **Animations:** Framer Motion for smooth interactions

### Backend Architecture - Local Development
- **Custom Dev Server:** `dev-server.js` runs serverless functions locally
  - Loads environment variables from `.env.local` using dotenv
  - Manually injects env vars into `process.env` for TypeScript handlers
  - Runs on port 3001 (API endpoints: `http://localhost:3001/api/*`)
- **Vite Proxy:** Configured to forward `/api/*` requests to dev server
- **Concurrently:** Runs both Vite and API server together with `npm run dev`

### Backend Architecture - Production (Vercel)
- **Serverless Functions:** Vercel Edge Functions in `/api` directory
- **API Proxy:** Functions hide API keys and handle external API calls
- **Environment:** Secure key management via Vercel environment variables

### Security Considerations
- API keys stored in `.env.local` (never committed, in `.gitignore`)
- Serverless functions act as secure proxy for API calls
- No API keys exposed to browser/frontend
- `.gitignore` prevents sensitive data exposure

## Current State

**Working Features:**
- ✅ Full UI built with all components
- ✅ Tailwind CSS v4 custom dark theme working
- ✅ Local development environment with custom API server
- ✅ Claude API integration for excuse generation (3 excuses per request)
- ✅ Form validation and error handling
- ✅ Loading animations and transitions
- ✅ Responsive design

**Not Yet Implemented:**
- ❌ Gemini API integration for image generation (`/api/generate-image.ts` exists but not connected)
- ❌ Image upload/headshot processing
- ❌ Deployment to Vercel production

**Next Steps:**
- Phase 3: Image Generation Integration
  - Connect Gemini API for excuse image generation
  - Implement image upload for headshot feature
  - Add image display in ExcuseCards
- Phase 4: Polish & Testing
  - Add more animations
  - Improve mobile responsiveness
  - Add error handling edge cases
- Phase 5: Deployment to Vercel
  - Configure Vercel project
  - Set up environment variables in Vercel dashboard
  - Deploy and test production build

## Important Technical Notes

### Tailwind CSS v4 Configuration
- **Theme customization in CSS, not JS**: All custom colors, spacing, etc. are defined in `src/index.css` using the `@theme` directive
- The `tailwind.config.js` is minimal (only content paths)
- Uses `@import "tailwindcss"` instead of `@tailwind` directives

### Environment Variables
- Dotenv alone doesn't work with ES modules
- `dev-server.js` manually copies parsed values into `process.env`
- Format: `KEY=value` (no quotes, no spaces around `=`)

### Local Development Server
- Port 3001 for API (may need to kill stale processes if EADDRINUSE error)
- Vite auto-selects available port (usually 5173+)
- Both servers MUST run together for full functionality
