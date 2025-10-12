function App() {
  return (
    <div className="min-h-screen bg-background p-mobile md:p-desktop">
      <div className="max-w-container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            Not My Fault
          </h1>
          <p className="text-text-secondary text-lg">
            Tailwind Configuration Verification
          </p>
        </div>

        {/* Background Colors Test */}
        <div className="bg-background-card p-6 rounded-card space-y-4">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Background Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-input border border-text-muted">
              <p className="text-text-primary font-mono text-sm">#0a0a0a</p>
              <p className="text-text-secondary text-xs">Deep Black</p>
            </div>
            <div className="bg-background-card p-4 rounded-input border border-text-muted">
              <p className="text-text-primary font-mono text-sm">#1a1a1a</p>
              <p className="text-text-secondary text-xs">Dark Charcoal</p>
            </div>
            <div className="bg-background-input p-4 rounded-input border border-text-muted">
              <p className="text-text-primary font-mono text-sm">#2a2a2a</p>
              <p className="text-text-secondary text-xs">Lighter Charcoal</p>
            </div>
          </div>
        </div>

        {/* Accent Colors Test */}
        <div className="bg-background-card p-6 rounded-card space-y-4">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Accent Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="bg-accent-green h-20 rounded-input"></div>
              <p className="text-accent-green font-mono text-sm">#00ff88</p>
              <p className="text-text-secondary text-xs">Neon Green (Level 3)</p>
            </div>
            <div className="space-y-2">
              <div className="bg-accent-blue h-20 rounded-input"></div>
              <p className="text-accent-blue font-mono text-sm">#00d9ff</p>
              <p className="text-text-secondary text-xs">Electric Blue (Level 1)</p>
            </div>
            <div className="space-y-2">
              <div className="bg-accent-purple h-20 rounded-input"></div>
              <p className="text-accent-purple font-mono text-sm">#b57bff</p>
              <p className="text-text-secondary text-xs">Vibrant Purple (Level 2)</p>
            </div>
          </div>
        </div>

        {/* Text Colors Test */}
        <div className="bg-background-card p-6 rounded-card space-y-4">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Text Colors
          </h2>
          <div className="space-y-2">
            <p className="text-text-primary text-lg">
              Primary Text (#ffffff) - Main content
            </p>
            <p className="text-text-secondary text-lg">
              Secondary Text (#a0a0a0) - Supporting content
            </p>
            <p className="text-text-muted text-lg">
              Muted Text (#666666) - Subtle information
            </p>
          </div>
        </div>

        {/* Border Radius & Spacing Test */}
        <div className="bg-background-card p-6 rounded-card space-y-4">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Border Radius & Spacing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background-input p-4 rounded-card border border-accent-purple">
              <p className="text-text-primary font-mono text-sm">rounded-card</p>
              <p className="text-text-secondary text-xs">12px border radius</p>
            </div>
            <div className="bg-background-input p-4 rounded-input border border-accent-blue">
              <p className="text-text-primary font-mono text-sm">rounded-input</p>
              <p className="text-text-secondary text-xs">8px border radius</p>
            </div>
          </div>
        </div>

        {/* Interactive States Test */}
        <div className="bg-background-card p-6 rounded-card space-y-4">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Interactive States (Hover/Focus)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-accent-green text-background font-bold py-3 px-6 rounded-input hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background transition-opacity">
              Green Button
            </button>
            <button className="bg-accent-blue text-background font-bold py-3 px-6 rounded-input hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background transition-opacity">
              Blue Button
            </button>
            <button className="bg-accent-purple text-white font-bold py-3 px-6 rounded-input hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-background transition-opacity">
              Purple Button
            </button>
          </div>
        </div>

        {/* Max Width Test */}
        <div className="bg-background-card p-6 rounded-card">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Max Width Constraints
          </h2>
          <div className="space-y-4">
            <div className="max-w-container bg-background-input p-4 rounded-input">
              <p className="text-text-primary font-mono text-sm">max-w-container</p>
              <p className="text-text-secondary text-xs">1400px max width</p>
            </div>
            <div className="max-w-form bg-background-input p-4 rounded-input mx-auto">
              <p className="text-text-primary font-mono text-sm">max-w-form</p>
              <p className="text-text-secondary text-xs">800px max width (centered)</p>
            </div>
          </div>
        </div>

        {/* Build Info */}
        <div className="bg-background-card p-6 rounded-card text-center">
          <p className="text-accent-green font-bold text-lg">
            Configuration Verified Successfully!
          </p>
          <p className="text-text-secondary text-sm mt-2">
            Tailwind CSS v4.1.14 | Gzipped CSS: 0.58 kB
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
