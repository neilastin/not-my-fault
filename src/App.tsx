import { useState, useRef, useEffect } from 'react';
import type { ExcusesResponse, GenerateImageResponse, CustomExcuseOptions } from '@/types';
import { getRandomVariation, type TaglineVariation } from '@/lib/taglineVariations';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ExcuseForm from '@/components/ExcuseForm';
import ExcuseCards from '@/components/ExcuseCards';
import ErrorMessage from '@/components/ErrorMessage';
import PhotoEvidence from '@/components/PhotoEvidence';

function App() {
  // Tagline variation (selected on mount)
  const [variation, setVariation] = useState<TaglineVariation>(() => getRandomVariation());

  // Loading states
  const [isGeneratingExcuses, setIsGeneratingExcuses] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Generated content
  const [excuses, setExcuses] = useState<ExcusesResponse | null>(null);
  const [imagesByExcuse, setImagesByExcuse] = useState<
    Record<'excuse1' | 'excuse2', string | null>
  >({
    excuse1: null,
    excuse2: null,
  });

  // UI state
  const [showExcuses, setShowExcuses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExcuseTab, setSelectedExcuseTab] = useState<'excuse1' | 'excuse2'>(
    'excuse1'
  ); // Default to 'believable' which maps to excuse1

  // Ref for scroll target
  const formRef = useRef<HTMLDivElement>(null);

  // Select random variation on mount
  useEffect(() => {
    setVariation(getRandomVariation());
  }, []);

  const generateExcuses = async (data: {
    scenario: string;
    audience: string;
    customOptions?: CustomExcuseOptions;
  }) => {
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

      // Reset images when new excuses are generated
      setImagesByExcuse({
        excuse1: null,
        excuse2: null,
      });
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

  const generateImage = async (
    excuseType: 'excuse1' | 'excuse2',
    headshotBase64?: string,
    headshotMimeType?: 'image/jpeg' | 'image/png'
  ) => {
    if (!excuses) return;

    setIsGeneratingImage(true);
    setError(null);

    try {
      const excuse = excuses[excuseType];
      // Use 'Observational' style for excuse1 (believable), actual style for excuse2 (risky)
      const styleToUse = excuseType === 'excuse1' ? 'Observational' : excuses.comedicStyle;

      // Debug logging
      console.log('=== IMAGE GENERATION DEBUG ===');
      console.log('Excuse type:', excuseType);
      console.log('Excuses object:', excuses);
      console.log('Style to use:', styleToUse);
      console.log('==============================');

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          excuseText: excuse.text,
          comedicStyle: styleToUse,
          headshotBase64,
          headshotMimeType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data: GenerateImageResponse = await response.json();
      setImagesByExcuse((prev) => ({ ...prev, [excuseType]: data.imageUrl }));
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleTabChange = (excuseType: 'excuse1' | 'excuse2') => {
    setSelectedExcuseTab(excuseType);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Header />

      <main className="pt-28">
        <Hero variation={variation} />

        <div ref={formRef} className="max-w-form mx-auto px-mobile md:px-desktop">
          <ExcuseForm
            variation={variation}
            onSubmit={generateExcuses}
            isLoading={isGeneratingExcuses}
          />

          {error && <ErrorMessage message={error} />}

          {showExcuses && excuses && (
            <>
              <ExcuseCards
                excuses={excuses}
                isVisible={showExcuses}
                onTabChange={handleTabChange}
              />

              <PhotoEvidence
                excuseText={excuses[selectedExcuseTab].text}
                excuseType={selectedExcuseTab}
                accentColor={
                  selectedExcuseTab === 'excuse1'
                    ? 'purple'
                    : 'green'
                }
                isGenerating={isGeneratingImage}
                generatedImage={imagesByExcuse[selectedExcuseTab]}
                onGenerate={(headshotBase64, headshotMimeType) =>
                  generateImage(selectedExcuseTab, headshotBase64, headshotMimeType)
                }
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
