import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-container mx-auto px-mobile md:px-desktop py-3">
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-white">Not My</span>
            <span className="ml-2 bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text text-transparent">
              Fault
            </span>
          </h1>

          {/* AI Badge moved from Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-green/10 to-accent-blue/10 border border-accent-green/20">
              <Sparkles className="w-4 h-4 text-accent-green" />
              <span className="text-sm font-medium text-accent-green">
                AI-Powered Excuse Generation
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
