# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**Current Phase: Phase 4 - Custom Excuse Generation Feature (COMPLETE)**

### ✅ Phase 4 Completion: "Customise" Feature for Advanced Excuse Generation

**Major Accomplishments (2025-10-27):**

#### 1. Customise Feature Implementation
- **Feature Name:** "Customise" (previously "Spice It Up" - renamed for better UX psychology)
- **Purpose:** Optional advanced excuse generation with user control over style, narrative elements, and focus
- **Design Philosophy:** Non-intrusive, preserves value of free tier, prepares for future monetization
- **New Component:** `CustomiseModal.tsx` - compact modal with all customization options
- **Button Design:** Subtle grey button (~20% width of main button) - visually de-emphasized
- **Auto-close:** Modal automatically closes when excuse generation completes

#### 2. Customization Options (9 Comedy Styles + 8 Narrative Elements + 9 Excuse Focus)
**Comedy Styles (9 total):**
- Surprise Me (default - random selection)
- Absurdist, Observational, Deadpan, Hyperbolic, Self-Deprecating, Ironic, Meta, Paranoid

**Special Ingredients - Always Available (8 total):**
- 🐦 Barrister Pigeon
- 🦆 Suspicious Duck
- 🐕 Dog with Shifty Eyes
- 🎩 Victorian Gentleman
- 👽 Alien Involvement
- 🌧️ Freak Weather
- 🤖 Robot Malfunction
- ⏰ Time Traveler

**Special Ingredients - Limited Time (5 seasonal, date-based):**
- 💘 Cupid's Revenge (Feb 1-14)
- 🐰 Easter Bunny (Mar 15 - Apr 30)
- 🎆 Fireworks Disaster (Jul 1-14)
- 🎃 Halloween Chaos (Oct 1-31)
- 🎅 Santa's Fault (Dec 1-25)

**Excuse Focus (9 total):**
- Let AI Decide (default)
- Blame Technology, Blame Nature, Blame Animals, Blame Other People
- Blame Yourself, Blame Universe, Blame Transport, Blame Time Itself

**Selection Rules:**
- Comedy Style: Single selection (radio behavior)
- Narrative Elements: Up to 3 selections (always available + limited time combined)
- Excuse Focus: Single selection (radio behavior)

#### 3. Advanced Prompt Engineering
- **Additive & Empowering:** Custom options enhance creativity, don't constrain it
- **Natural Language:** "Weave these in naturally", "seasoning not the main dish"
- **Creative Freedom:** "Primarily" instead of "only", explicit permission for flexibility
- **Paragraph Formatting:** Longer excuses (4+ sentences) automatically broken into 2-3 paragraphs for readability
- **Backward Compatible:** Simple "Generate Excuses" button works unchanged (no custom options)

#### 4. UI/UX Design Decisions
**Button Hierarchy:**
- Main button: "Generate Excuses" (green, 4x width, prominent)
- Customise button: "Customise" (subtle grey, 1x width, ~20% of main button)
- No emoji on Customise button - clean, understated

**Modal Design:**
- Compact 600px width with tighter spacing
- Two-column layout on desktop (Comedy Style | Excuse Focus)
- Single column on mobile (fully responsive)
- Loading state stays inside modal
- Auto-close on completion

**Visual Hierarchy:**
- Limited Time elements have purple tint/accent to distinguish from always-available
- Selection counter shows "X/3 selected" with color feedback
- Checkboxes disable when max limit reached

#### 5. Freemium Strategy Preparation
- Feature designed to NOT devalue the free tier
- "Customise" = optional enhancement, not necessary upgrade
- Neutral naming avoids FOMO (fear of missing out)
- Modal architecture ready for future video ad integration
- Respects free users while providing clear upsell value

**Verified Working (2025-10-27):**
- ✅ Customise button with subtle grey styling
- ✅ Modal with all customization options (9 styles, 8+ elements, 9 focus options)
- ✅ Auto-close modal after generation
- ✅ Paragraph formatting in longer excuses
- ✅ Limited time elements show/hide based on current date
- ✅ Selection limits enforced (max 3 narrative elements)
- ✅ Responsive design across all breakpoints
- ✅ Backward compatible with simple generation

**Future Enhancement Note:**
- The customization approach implemented for excuse generation should be replicated for photo/image generation in a future update
- This would allow users to customize image styles, visual elements, and composition preferences
- Same modal-based UI pattern and freemium strategy should apply

---

### ✅ Phase 3 Completion: Comedic Style System & Image Preview Modal

**Major Accomplishments (2025-10-27):**

#### 1. Excuse Generation Prompt Redesign
- **Removed:** Wordplay comedic style (didn't work well for excuse context)
- **Added:** 8 comedic styles with rich descriptive guidance instead of examples
  - Absurdist (surreal, impossible scenarios)
  - Observational (modern life observations)
  - Deadpan (formal tone, absurd content)
  - Hyperbolic (exaggerated, epic scale)
  - Self-deprecating (personal incompetence)
  - Ironic (contradictions, opposite outcomes)
  - Meta (fourth wall breaking, self-aware)
  - Paranoid (conspiracy theories, connections)
- **Implementation:** Random rotation system selects one style per generation
- **Result:** Excuses are now genuinely funny, varied, and avoid excessive British cultural references

#### 2. Image Generation Style Matching
- **Visual Styles:** 8 visual styles matching excuse comedic styles
- **Headshot Variants:** Each style has "withHeadshot" and "withoutHeadshot" instructions
- **Text Prevention:** Strengthened NO TEXT rules across all visual styles
- **People Rules:** Explicit guidance preventing generation of known people while allowing strangers
- **Result:** Images now visually align with excuse humor, creating cohesive user experience

#### 3. Full-Screen Image Preview Modal
- **New Component:** `ImageModal.tsx` with:
  - Full-screen dark backdrop (90% opacity)
  - Centered image scaled to fit viewport
  - Close button (top-right, ESC key support)
  - Floating download button (bottom-right, green accent)
  - Auto-close after 800ms delay post-download
  - Click-outside-to-close functionality
  - Download state feedback ("Downloaded! ✓")
  - Accessibility: ARIA labels, keyboard navigation
  - Framer Motion animations
- **Updated UI:** `ImageDisplay.tsx` made clickable with hover effects
  - Scale up 1.02x on hover
  - Dark overlay appears (30% opacity)
  - Maximize icon appears
  - "Click to view full screen" hint text
  - Keyboard support (Enter/Space to open)
- **Result:** Much improved UX for viewing and downloading images

**Verified Working (2025-10-27):**
- ✅ Excuse generation with randomized comedic styles
- ✅ Style-specific visual image generation
- ✅ Full-screen modal with clear download button
- ✅ Auto-close after download with visual feedback
- ✅ Responsive design across mobile/tablet/desktop
- ✅ No unwanted text in generated images
- ✅ No random people in backgrounds

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
- API integration working with Claude API (2 excuses: believable + risky)
- Environment variables properly loaded
- **Excuse generation fully functional and verified working**

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
│   ├── generate-excuses.ts # Claude API with 8 comedic styles (COMPLETE)
│   └── generate-image.ts   # Gemini 2.5 Flash Image with style matching (COMPLETE)
├── public/                  # Static assets
├── src/
│   ├── components/         # React components (ALL COMPLETE)
│   │   ├── Header.tsx      # Navigation header with logo
│   │   ├── Hero.tsx        # Landing hero section
│   │   ├── ExcuseForm.tsx  # Form for excuse generation with Customise button
│   │   ├── ExcuseCards.tsx # Display generated excuses
│   │   ├── ExcuseCard.tsx  # Individual excuse card
│   │   ├── CustomiseModal.tsx   # Advanced excuse customization modal
│   │   ├── PhotoEvidence.tsx    # Image generation & upload
│   │   ├── ImageDisplay.tsx     # Image display with clickable preview
│   │   ├── ImageModal.tsx       # Full-screen preview modal
│   │   ├── HeadshotUpload.tsx   # Drag-and-drop file upload
│   │   ├── LoadingAnimation.tsx  # Loading state
│   │   └── ErrorMessage.tsx      # Error display
│   ├── lib/                # Utility functions
│   │   ├── utils.ts        # cn() helper for Tailwind classes
│   │   ├── constants.ts    # App constants (loading messages, file constraints, etc.)
│   │   ├── spiceItUpOptions.ts  # Customise feature options (styles, elements, focus)
│   │   └── taglineVariations.ts # Hero tagline variations
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types + CustomExcuseOptions
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
- ✅ Claude API integration for excuse generation (2 excuses with 8 comedic styles)
- ✅ **Customise feature** - Advanced excuse generation with user control
  - 9 comedy styles (including "Surprise Me")
  - 8 always-available narrative elements + 5 seasonal elements
  - 9 excuse focus options
  - Compact modal with auto-close on completion
  - Paragraph formatting for longer excuses (4+ sentences)
- ✅ Gemini 2.5 Flash Image API for image generation with style matching
- ✅ Full-screen image preview modal with download functionality
- ✅ Drag-and-drop headshot upload with file validation
- ✅ Image caching per excuse type
- ✅ Tabbed interface with smooth animations
- ✅ Form validation and error handling
- ✅ Loading animations and transitions
- ✅ Responsive design across all breakpoints
- ✅ Accessibility features (ARIA labels, keyboard navigation)

**Not Yet Implemented:**
- ❌ Deployment to Vercel production
- ❌ E2E tests (Playwright)
- ❌ Performance monitoring/analytics

**Next Steps:**
- Phase 4: Testing & Quality Assurance
  - Create comprehensive E2E tests with Playwright
  - Test excuse generation across all 8 styles
  - Test image generation with/without headshots
  - Test modal interactions and downloads
  - Responsive design testing (mobile, tablet, desktop)
- Phase 5: Deployment to Vercel
  - Configure Vercel project
  - Set up environment variables in Vercel dashboard
  - Deploy and test production build
  - Monitor for errors
- Phase 6: Optional Enhancements
  - Add more comedic styles
  - Implement history/favorites
  - Share functionality
  - Analytics integration

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

---

## Agent Workflow Strategy

### Available Specialized Agents

Claude Code has access to specialized agents that should be used for specific types of tasks. **Always delegate to the appropriate agent rather than handling complex tasks directly.**

#### 1. **Explore Agent**
**When to use:** Codebase exploration, understanding project structure, finding files/patterns
**Capabilities:** Fast file pattern matching, code search, reading files
**Use cases:**
- "Where is X feature implemented?"
- "How does Y work in this codebase?"
- "What's the project structure?"
- "Find all files related to Z"
- Any open-ended codebase exploration

**Example triggers:**
- User asks "where..." or "how does..."
- Need to understand code before making changes
- Searching for patterns across multiple files

#### 2. **frontend-architect Agent**
**When to use:** React components, UI architecture, TypeScript frontend work
**Capabilities:** Full toolkit for building/modifying/reviewing React components
**Use cases:**
- Building new React components
- Modifying existing components
- Reviewing component architecture
- TypeScript type issues in frontend
- Vite configuration
- State management patterns

**Example triggers:**
- "Create a new component for..."
- "Fix the React component..."
- "Review my component code"
- "Add TypeScript types for..."

#### 3. **backend-serverless-expert Agent**
**When to use:** Serverless functions, API routes, backend logic, API integrations
**Capabilities:** Full toolkit for serverless function development
**Use cases:**
- Creating/modifying `/api` directory functions
- API key handling and security
- External API integrations (Claude, Gemini)
- Server-side validation
- Backend error handling

**Example triggers:**
- "Create an API endpoint for..."
- "Fix the serverless function..."
- "Integrate X API..."
- "Move this to the backend..."
- Any work in `/api` directory

**IMPORTANT:** This agent should ALWAYS be consulted when:
- Adding new API endpoints
- Modifying existing serverless functions
- Integrating external APIs
- Handling sensitive data or API keys

#### 4. **styling-animation-specialist Agent**
**When to use:** CSS, Tailwind, animations, visual design, UI styling
**Capabilities:** Full toolkit for styling and animations
**Use cases:**
- Tailwind CSS configuration
- Custom theme modifications
- Framer Motion animations
- Responsive design
- Visual polish and UI improvements
- CSS debugging

**Example triggers:**
- "Style this component..."
- "Add animation to..."
- "Make it responsive..."
- "Fix the Tailwind config..."
- "The design looks off..."

**IMPORTANT for this project:**
- Tailwind v4 uses `@theme` in CSS, not config file
- Custom theme in `src/index.css`
- Dark theme with neon accents (green, blue, purple)

#### 5. **security-guardian Agent**
**When to use:** Security audits, API key handling, input validation
**Capabilities:** Read-only analysis + web research for security best practices
**Use cases:**
- Audit API integrations
- Review serverless functions for security issues
- Check environment variable handling
- Validate input sanitization
- Review authentication/authorization

**Example triggers:**
- After implementing new API endpoints
- After adding environment variables
- Before deploying to production
- When handling user input or file uploads

**IMPORTANT:** Use proactively after any backend/API changes

#### 6. **playwright-tester Agent**
**When to use:** End-to-end testing, UI testing, integration tests
**Capabilities:** Playwright tools for browser automation and testing
**Use cases:**
- Creating E2E tests for new features
- Testing form submissions
- Testing API integrations through UI
- Validating user flows
- Regression testing

**Example triggers:**
- "Test the excuse generation flow"
- "Create tests for..."
- "Verify the form works..."
- After completing features that need validation

#### 7. **devops-deployment-specialist Agent**
**When to use:** Deployment, CI/CD, Vercel configuration, GitHub operations
**Capabilities:** GitHub tools, bash, deployment automation
**Use cases:**
- Deploying to Vercel
- Setting up environment variables in Vercel
- GitHub repository management
- CI/CD pipeline setup
- Build optimization
- Deployment troubleshooting

**Example triggers:**
- "Deploy to Vercel"
- "Fix deployment error..."
- "Set up environment variables..."
- "Configure Vercel..."
- Deployment failures (500 errors, build errors)

---

### Workflow Decision Tree

**When you receive a task, follow this decision tree:**

```
1. Is this codebase exploration/understanding?
   → Use Explore Agent

2. Is this React/TypeScript frontend work?
   → Use frontend-architect Agent

3. Is this serverless function/API/backend work?
   → Use backend-serverless-expert Agent
   → Then use security-guardian Agent for review

4. Is this styling/CSS/animation work?
   → Use styling-animation-specialist Agent

5. Is this testing/validation?
   → Use playwright-tester Agent

6. Is this deployment/DevOps/Vercel?
   → Use devops-deployment-specialist Agent

7. Is this a multi-domain task?
   → Break it down and use multiple agents sequentially
   → Example: "Add styled component with API" =
     a) frontend-architect (component)
     b) styling-animation-specialist (styling)
     c) backend-serverless-expert (API)
     d) security-guardian (security review)
```

---

### Agent Usage Best Practices

**DO:**
- ✅ Always use agents for complex, multi-step tasks
- ✅ Use Explore agent before making changes to unfamiliar code
- ✅ Use security-guardian proactively after backend changes
- ✅ Run agents in parallel when tasks are independent
- ✅ Provide clear, detailed instructions to agents
- ✅ Trust agent outputs and recommendations

**DON'T:**
- ❌ Try to handle complex tasks without agents
- ❌ Use direct tools (Grep/Glob) for open-ended exploration
- ❌ Skip security review for API/backend changes
- ❌ Make styling changes without styling-animation-specialist
- ❌ Deploy without devops-deployment-specialist guidance

---

### Project-Specific Agent Guidelines

**For this "Not My Fault" project:**

1. **Frontend Component Work** → frontend-architect
   - All React component modifications
   - TypeScript type updates
   - Component architecture decisions

2. **Styling Changes** → styling-animation-specialist
   - Must know: Tailwind v4 with `@theme` in CSS
   - Custom dark theme with neon accents
   - Framer Motion for animations

3. **API/Backend Work** → backend-serverless-expert + security-guardian
   - All `/api` directory changes
   - Claude API integration modifications
   - Gemini API integration (Phase 3)
   - Always follow with security review

4. **Deployment Issues** → devops-deployment-specialist
   - Vercel configuration
   - Environment variable setup
   - Build errors
   - 500 errors in production

5. **Testing** → playwright-tester
   - E2E tests for excuse generation
   - Form validation testing
   - API integration testing through UI

---

### Example Workflows

**Scenario 1: "Add a new excuse category"**
```
1. Explore Agent: Find where categories are defined
2. frontend-architect: Update ExcuseForm component
3. backend-serverless-expert: Update API validation
4. security-guardian: Review changes
5. playwright-tester: Create tests for new category
```

**Scenario 2: "Implement Gemini image generation (Phase 3)"**
```
1. Explore Agent: Understand current image API setup
2. backend-serverless-expert: Connect Gemini API in /api/generate-image.ts
3. security-guardian: Audit API integration
4. frontend-architect: Add image display to ExcuseCards
5. styling-animation-specialist: Style image display with animations
6. playwright-tester: Test image generation flow
7. devops-deployment-specialist: Deploy and verify in production
```

**Scenario 3: "Fix styling issue"**
```
1. Explore Agent: Find related styling code (if unclear)
2. styling-animation-specialist: Fix the styling issue
3. playwright-tester: Verify fix across different viewports (optional)
```

**Scenario 4: "Deployment failing with 500 error"**
```
1. devops-deployment-specialist: Diagnose and fix deployment
   (Usually environment variables or build configuration)
```
