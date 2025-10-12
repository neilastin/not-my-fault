import { useState, useRef } from 'react';
import type { ExcusesResponse } from '@/types';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ExcuseForm from '@/components/ExcuseForm';
import LoadingAnimation from '@/components/LoadingAnimation';
import ExcuseCards from '@/components/ExcuseCards';
import ErrorMessage from '@/components/ErrorMessage';

function App() {
  // Loading states
  const [isGeneratingExcuses, setIsGeneratingExcuses] = useState(false);

  // Generated content
  const [excuses, setExcuses] = useState<ExcusesResponse | null>(null);

  // UI state
  const [showExcuses, setShowExcuses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for scroll target
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const generateExcuses = async (data: { scenario: string; audience: string; importance: string }) => {
    try {
      setIsGeneratingExcuses(true);
      setError(null);
      setShowExcuses(false);

      const response = await fetch('/api/generate-excuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate excuses');
      }

      const excusesData: ExcusesResponse = await response.json();
      setExcuses(excusesData);
      setShowExcuses(true);
    } catch (err) {
      console.error('Error generating excuses:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate excuses. Please try again.'
      );
    } finally {
      setIsGeneratingExcuses(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onScrollToForm={scrollToForm} />

      <main className="pt-20">
        <Hero />

        <div ref={formRef} className="max-w-form mx-auto px-mobile md:px-desktop py-12">
          <ExcuseForm
            onSubmit={generateExcuses}
            isLoading={isGeneratingExcuses}
          />

          {isGeneratingExcuses && <LoadingAnimation isLoading={true} />}

          {error && <ErrorMessage message={error} />}

          {showExcuses && excuses && (
            <ExcuseCards excuses={excuses} isVisible={showExcuses} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
