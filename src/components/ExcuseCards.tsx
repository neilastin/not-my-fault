import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ExcusesResponse } from '@/types';
import { getRandomExcuseTitle } from '@/lib/constants';
import ExcuseCard from './ExcuseCard';
import { cn } from '@/lib/utils';

interface ExcuseCardsProps {
  excuses: ExcusesResponse | null;
  isVisible: boolean;
}

type ExcuseType = 'technical' | 'believable' | 'outrageous';

export default function ExcuseCards({ excuses, isVisible }: ExcuseCardsProps) {
  const [activeTab, setActiveTab] = useState<ExcuseType>('believable');

  // Generate random titles once when excuses are loaded
  const excuseData = useMemo(() => {
    if (!excuses) return null;

    return {
      technical: {
        ...excuses.excuse1,
        title: getRandomExcuseTitle('technical'),
        type: 'technical' as const,
        accentColor: 'blue' as const,
      },
      believable: {
        ...excuses.excuse2,
        title: getRandomExcuseTitle('believable'),
        type: 'believable' as const,
        accentColor: 'purple' as const,
      },
      outrageous: {
        ...excuses.excuse3,
        title: getRandomExcuseTitle('outrageous'),
        type: 'outrageous' as const,
        accentColor: 'green' as const,
      },
    };
  }, [excuses]);

  if (!isVisible || !excuseData) {
    return null;
  }

  const tabs: { type: ExcuseType; label: string; emoji?: string }[] = [
    { type: 'technical', label: 'Technical' },
    { type: 'believable', label: 'Believable' },
    { type: 'outrageous', label: 'Outrageous', emoji: '✨' },
  ];

  const activeExcuse = excuseData[activeTab];

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
        Your Excuses
      </h2>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-8 max-w-2xl mx-auto">
        {tabs.map(({ type, label, emoji }) => {
          const isActive = activeTab === type;
          const isOutrageous = type === 'outrageous';

          return (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={cn(
                'relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                isActive
                  ? 'bg-accent-green text-background shadow-lg shadow-accent-green/30 scale-105'
                  : 'bg-background-card text-text-secondary hover:text-text-primary hover:bg-background-input',
                isOutrageous && !isActive && 'outrageous-tab',
                isOutrageous && 'focus:ring-accent-green'
              )}
              aria-pressed={isActive}
              aria-label={`Show ${label} excuse`}
            >
              <span className="flex items-center justify-center gap-2">
                {label}
                {emoji && (
                  <span className={cn(
                    'text-lg',
                    isOutrageous && !isActive && 'animate-pulse'
                  )}>
                    {emoji}
                  </span>
                )}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-accent-green rounded-lg -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Single Card Display with Animation */}
      <div className="max-w-3xl mx-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          <ExcuseCard
            title={activeExcuse.title}
            text={activeExcuse.text}
            accentColor={activeExcuse.accentColor}
            index={0}
          />
        </motion.div>
      </div>
    </section>
  );
}
