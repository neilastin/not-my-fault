import { Triangle } from 'lucide-react';

interface HeaderProps {
  onScrollToForm?: () => void;
}

export default function Header({ onScrollToForm }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-background-card/95 backdrop-blur-sm border-b border-background-input">
      <div className="max-w-container mx-auto px-mobile md:px-desktop py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Triangle className="h-6 w-6 text-accent-purple fill-accent-purple" />
            <h1 className="text-2xl font-bold text-text-primary">
              Not My Fault
            </h1>
          </div>

          {/* Navigation */}
          <nav>
            <button
              onClick={onScrollToForm}
              className="text-accent-green hover:text-accent-green/80 transition-colors font-medium"
              aria-label="Navigate to excuse generator form"
            >
              Generate Excuses
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
