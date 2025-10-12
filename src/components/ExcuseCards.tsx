import type { ExcusesResponse } from '@/types';
import ExcuseCard from './ExcuseCard';

interface ExcuseCardsProps {
  excuses: ExcusesResponse | null;
  isVisible: boolean;
}

export default function ExcuseCards({ excuses, isVisible }: ExcuseCardsProps) {
  if (!isVisible || !excuses) {
    return null;
  }

  const excusesList = [
    { ...excuses.excuse1, accentColor: 'blue' as const, key: 'excuse1' },
    { ...excuses.excuse2, accentColor: 'purple' as const, key: 'excuse2' },
    { ...excuses.excuse3, accentColor: 'green' as const, key: 'excuse3' },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
        Your Custom Excuses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
        {excusesList.map((excuse, index) => (
          <ExcuseCard
            key={excuse.key}
            title={excuse.title}
            text={excuse.text}
            accentColor={excuse.accentColor}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
