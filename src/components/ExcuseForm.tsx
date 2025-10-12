import { useState, type FormEvent, type ChangeEvent } from 'react';
import { AUDIENCE_OPTIONS, IMPORTANCE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ExcuseFormProps {
  onSubmit: (data: { scenario: string; audience: string; importance: string }) => void;
  isLoading: boolean;
  disabled?: boolean;
}

interface FormErrors {
  scenario?: string;
  audience?: string;
  importance?: string;
}

export default function ExcuseForm({ onSubmit, isLoading, disabled = false }: ExcuseFormProps) {
  const [scenario, setScenario] = useState('');
  const [audience, setAudience] = useState('');
  const [importance, setImportance] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!scenario.trim()) {
      errors.scenario = 'Please describe what happened';
    } else if (scenario.trim().length < 10) {
      errors.scenario = 'Please provide at least 10 characters';
    }

    if (!audience) {
      errors.audience = 'Please select who needs to believe this';
    }

    if (!importance) {
      errors.importance = 'Please select how important this is';
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
      importance,
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

  const handleImportanceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setImportance(e.target.value);
    if (formErrors.importance) {
      setFormErrors((prev) => ({ ...prev, importance: undefined }));
    }
  };

  const isFormValid = scenario.trim().length >= 10 && audience && importance;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background-card p-6 md:p-8 rounded-card shadow-lg">
      {/* Scenario Textarea */}
      <div className="space-y-2">
        <label htmlFor="scenario" className="text-text-primary font-medium mb-2 block">
          What's not your fault?
        </label>
        <textarea
          id="scenario"
          value={scenario}
          onChange={handleScenarioChange}
          placeholder="I missed the meeting because..."
          rows={4}
          disabled={isLoading || disabled}
          className={cn(
            'w-full px-4 py-3 bg-background-input text-text-primary rounded-input border border-background-input transition-colors',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent-green',
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
          Who needs to believe this?
        </label>
        <select
          id="audience"
          value={audience}
          onChange={handleAudienceChange}
          disabled={isLoading || disabled}
          className={cn(
            'w-full px-4 py-3 bg-background-input text-text-primary rounded-input border border-background-input transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent-green',
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

      {/* Importance Select */}
      <div className="space-y-2">
        <label htmlFor="importance" className="text-text-primary font-medium mb-2 block">
          How important is this?
        </label>
        <select
          id="importance"
          value={importance}
          onChange={handleImportanceChange}
          disabled={isLoading || disabled}
          className={cn(
            'w-full px-4 py-3 bg-background-input text-text-primary rounded-input border border-background-input transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent-green',
            formErrors.importance && 'border-red-400',
            (isLoading || disabled) && 'opacity-50 cursor-not-allowed',
            !importance && 'text-text-muted'
          )}
          required
          aria-invalid={!!formErrors.importance}
          aria-describedby={formErrors.importance ? 'importance-error' : undefined}
        >
          <option value="" disabled>
            Select importance level
          </option>
          {IMPORTANCE_OPTIONS.map((option) => (
            <option key={option} value={option} className="text-text-primary">
              {option}
            </option>
          ))}
        </select>
        {formErrors.importance && (
          <p id="importance-error" className="text-red-400 text-sm mt-1">
            {formErrors.importance}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || isLoading || disabled}
        className={cn(
          'w-full py-4 px-8 rounded-input font-bold text-lg transition-all duration-200',
          'bg-accent-green text-background',
          'shadow-lg shadow-accent-green/20',
          'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
          (!isFormValid || isLoading || disabled) && 'opacity-50 cursor-not-allowed',
          isFormValid && !isLoading && !disabled && 'hover:opacity-90 hover:shadow-xl hover:shadow-accent-green/30 hover:scale-[1.02]'
        )}
        aria-busy={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Excuses'}
      </button>
    </form>
  );
}
