import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AUDIENCE_OPTIONS, LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL } from '@/lib/constants';
import type { TaglineVariation } from '@/lib/taglineVariations';
import { cn } from '@/lib/utils';

interface ExcuseFormProps {
  variation: TaglineVariation;
  onSubmit: (data: { scenario: string; audience: string }) => void;
  isLoading: boolean;
  disabled?: boolean;
}

interface FormErrors {
  scenario?: string;
  audience?: string;
}

export default function ExcuseForm({ variation, onSubmit, isLoading, disabled = false }: ExcuseFormProps) {
  const [scenario, setScenario] = useState('');
  const [audience, setAudience] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    // Reset to first message when loading starts
    setMessageIndex(0);

    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, LOADING_MESSAGE_INTERVAL);

    // Cleanup interval on unmount or when loading stops
    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!scenario.trim()) {
      errors.scenario = 'Please describe what happened';
    } else if (scenario.trim().length < 10) {
      errors.scenario = 'Please provide at least 10 characters';
    }

    if (!audience) {
      errors.audience = 'Please select your audience';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      scenario: scenario.trim(),
      audience,
    });
  };

  const handleScenarioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setScenario(e.target.value);
    if (formErrors.scenario) {
      setFormErrors((prev) => ({ ...prev, scenario: undefined }));
    }
  };

  const handleAudienceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAudience(e.target.value);
    if (formErrors.audience) {
      setFormErrors((prev) => ({ ...prev, audience: undefined }));
    }
  };

  const isFormValid = scenario.trim().length >= 10 && audience;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background-card p-6 md:p-8 rounded-card shadow-lg">
      {/* Scenario Textarea */}
      <div className="space-y-2">
        <label htmlFor="scenario" className="text-text-primary font-medium mb-2 block">
          {variation.formLabels.situation}
        </label>
        <textarea
          id="scenario"
          value={scenario}
          onChange={handleScenarioChange}
          placeholder={variation.formLabels.placeholder}
          rows={3}
          disabled={isLoading || disabled}
          className={cn(
            'w-full px-4 py-3 bg-background-input text-text-primary rounded-input border border-background-input',
            'placeholder:text-text-muted',
            'focus:outline-none',
            'input-glow',
            formErrors.scenario && 'border-red-400',
            (isLoading || disabled) && 'opacity-50 cursor-not-allowed'
          )}
          required
          aria-invalid={!!formErrors.scenario}
          aria-describedby={formErrors.scenario ? 'scenario-error' : undefined}
        />
        {formErrors.scenario && (
          <p id="scenario-error" className="text-red-400 text-sm mt-1">
            {formErrors.scenario}
          </p>
        )}
      </div>

      {/* Audience Select */}
      <div className="space-y-2">
        <label htmlFor="audience" className="text-text-primary font-medium mb-2 block">
          {variation.formLabels.audience}
        </label>
        <select
          id="audience"
          value={audience}
          onChange={handleAudienceChange}
          disabled={isLoading || disabled}
          className={cn(
            'w-full px-4 py-3 bg-background-input text-text-primary rounded-input border border-background-input',
            'focus:outline-none',
            'input-glow',
            formErrors.audience && 'border-red-400',
            (isLoading || disabled) && 'opacity-50 cursor-not-allowed',
            !audience && 'text-text-muted'
          )}
          required
          aria-invalid={!!formErrors.audience}
          aria-describedby={formErrors.audience ? 'audience-error' : undefined}
        >
          <option value="" disabled>
            Select your audience
          </option>
          {AUDIENCE_OPTIONS.map((option) => (
            <option key={option} value={option} className="text-text-primary">
              {option}
            </option>
          ))}
        </select>
        {formErrors.audience && (
          <p id="audience-error" className="text-red-400 text-sm mt-1">
            {formErrors.audience}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!isFormValid || isLoading || disabled}
        whileHover={
          isFormValid && !isLoading && !disabled
            ? {
                scale: 1.02,
                boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)",
              }
            : {}
        }
        whileTap={
          isFormValid && !isLoading && !disabled
            ? { scale: 0.98 }
            : {}
        }
        className={cn(
          'w-full py-4 px-8 rounded-input font-bold text-lg transition-all duration-200',
          'bg-accent-green text-background',
          'shadow-lg shadow-accent-green/20',
          'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
          (!isFormValid || isLoading || disabled) && 'opacity-50 cursor-not-allowed',
          'h-[64px] flex items-center justify-center'
        )}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            {/* Spinner on left */}
            <div className="relative flex-shrink-0">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-background border-t-transparent" />
              <div className="absolute inset-0 animate-spin rounded-full h-6 w-6 border-2 border-background border-t-transparent blur-sm opacity-50" />
            </div>

            {/* Rotating messages on right */}
            <AnimatePresence mode="wait">
              <motion.span
                key={messageIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        ) : (
          'Generate Excuses'
        )}
      </motion.button>
    </form>
  );
}
