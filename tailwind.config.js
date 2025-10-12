/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          DEFAULT: '#0a0a0a', // Deep black
          card: '#1a1a1a',    // Dark charcoal
          input: '#2a2a2a',   // Lighter charcoal
        },
        // Accent colors
        accent: {
          green: '#00ff88',   // Neon green (Primary CTA, Level 3)
          blue: '#00d9ff',    // Electric blue (Level 1)
          purple: '#b57bff',  // Vibrant purple (Level 2, logo)
        },
        // Text colors
        text: {
          primary: '#ffffff',   // White
          secondary: '#a0a0a0', // Gray
          muted: '#666666',     // Dark gray
        },
      },
      borderRadius: {
        card: '12px',
        input: '8px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      maxWidth: {
        container: '1400px',
        form: '800px',
      },
      spacing: {
        mobile: '24px',
        desktop: '48px',
      },
    },
  },
  plugins: [],
}
