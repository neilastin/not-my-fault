import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'

// Initialize Sentry error monitoring
// Get your free Sentry DSN at: https://sentry.io/signup/
// Then replace 'YOUR_SENTRY_DSN_HERE' with your actual DSN
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN_HERE',
  environment: import.meta.env.DEV ? 'development' : 'production',
  // Only send events in production (comment this out to test in development)
  enabled: !import.meta.env.DEV,
  // Capture 100% of transactions for performance monitoring (low traffic app)
  tracesSampleRate: 1.0,
  // Capture 100% of sessions with errors for replay
  replaysOnErrorSampleRate: 1.0,
  // Capture 10% of all sessions for general replay analysis
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
})

// Simple error fallback component for Sentry ErrorBoundary
const ErrorFallback = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem',
      textAlign: 'center',
    }}
  >
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
      Something went wrong
    </h1>
    <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#a3a3a3' }}>
      We've been notified and are looking into it.
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        backgroundColor: '#22c55e',
        color: '#ffffff',
        padding: '0.75rem 2rem',
        borderRadius: '0.5rem',
        border: 'none',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#16a34a'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#22c55e'
      }}
    >
      Reload Page
    </button>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog>
      <App />
      {/* Vercel Analytics - only tracks in production */}
      <Analytics />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
