// Main application state types
export interface AppState {
  // Form inputs
  scenario: string;
  audience: string;
  importance: string;

  // Loading states
  isGeneratingExcuses: boolean;
  isGeneratingImage: boolean;

  // Generated content
  excuses: ExcusesResponse | null;

  // Image generation
  uploadedHeadshot: File | null;
  generatedImage: string | null; // Base64 data URL

  // UI state
  currentLoadingMessage: string;
  showExcuses: boolean;
  copySuccess: Record<string, boolean>; // Track copy status per excuse

  // Error state
  error: string | null;
}

// Excuse structure from API
export interface ExcuseItem {
  title: string;
  text: string;
}

export interface ExcusesResponse {
  excuse1: ExcuseItem;
  excuse2: ExcuseItem;
  excuse3: ExcuseItem;
}

// Form dropdown options
export type AudienceOption =
  | 'My manager'
  | 'My partner'
  | 'My parents'
  | 'My friend'
  | 'My teacher'
  | 'My date'
  | 'A client'
  | 'A coworker'
  | 'A police officer'
  | 'Anyone and Everyone';

export type ImportanceOption =
  | 'Not a massive deal'
  | 'Somewhat important'
  | 'Really important'
  | 'Absolutely critical';

// API request types
export interface GenerateExcusesRequest {
  scenario: string;
  audience: AudienceOption;
  importance: ImportanceOption;
}

export interface GenerateImageRequest {
  excuseText: string;
  headshotBase64?: string;
  headshotMimeType?: string;
}

// API response types
export interface GenerateImageResponse {
  imageUrl: string;
}

export interface ApiError {
  error: string;
}

// Component props
export interface ExcuseCardProps {
  title: string;
  text: string;
  accentColor: 'blue' | 'purple' | 'green';
  onCopy: () => void;
  isCopied: boolean;
}

export interface LoadingAnimationProps {
  messages: string[];
  interval?: number; // milliseconds between message changes
}

export interface PhotoEvidenceProps {
  excuseText: string;
  onImageGenerated: (imageUrl: string) => void;
}
