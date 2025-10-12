import type { AudienceOption, ImportanceOption } from '@/types';

// Form dropdown options
export const AUDIENCE_OPTIONS: AudienceOption[] = [
  'My manager',
  'My partner',
  'My parents',
  'My friend',
  'My teacher',
  'My date',
  'A client',
  'A coworker',
  'A police officer',
  'Anyone and Everyone',
];

export const IMPORTANCE_OPTIONS: ImportanceOption[] = [
  'Not a massive deal',
  'Somewhat important',
  'Really important',
  'Absolutely critical',
];

// Loading messages (55 messages from spec)
export const LOADING_MESSAGES = [
  'Consulting the excuse archives...',
  'Crafting your alibi...',
  'Fabricating plausible deniability...',
  'Summoning creative justifications...',
  'Generating bulletproof reasoning...',
  'Weaving a tale of innocence...',
  'Constructing the perfect narrative...',
  'Assembling your defense...',
  'Spinning a web of believability...',
  'Channeling your inner storyteller...',
  'Consulting the council of excuses...',
  'Bending reality to your favor...',
  'Manufacturing reasonable doubt...',
  'Brewing up some plausible scenarios...',
  'Conjuring creative explanations...',
  'Building your case...',
  'Orchestrating a symphony of excuses...',
  'Designing your escape route...',
  'Engineering believable fiction...',
  'Summoning the excuse spirits...',
  'Calculating optimal deflection angles...',
  'Drafting your statement...',
  'Polishing your story...',
  'Consulting Murphy\'s Law...',
  'Invoking creative license...',
  'Generating plausible alternatives...',
  'Constructing reasonable excuses...',
  'Fabricating convenient truths...',
  'Manifesting believable scenarios...',
  'Assembling your narrative...',
  'Weaving circumstantial evidence...',
  'Crafting your testimony...',
  'Building reasonable explanations...',
  'Summoning the excuse muse...',
  'Generating creative solutions...',
  'Consulting the book of alibis...',
  'Drafting your defense strategy...',
  'Manufacturing plausible events...',
  'Constructing your version of events...',
  'Brewing up some tall tales...',
  'Channeling Oscar-worthy performances...',
  'Generating face-saving explanations...',
  'Crafting elaborate justifications...',
  'Summoning convenient coincidences...',
  'Building layers of deniability...',
  'Weaving complex explanations...',
  'Consulting chaos theory...',
  'Generating creative deflections...',
  'Manifesting alternate realities...',
  'Constructing your masterpiece...',
  'Fabricating reasonable circumstances...',
  'Summoning believable scenarios...',
  'Engineering your way out...',
  'Crafting the ultimate excuse...',
  'Building your safety net...',
];

// File upload constraints
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Animation timings
export const LOADING_MESSAGE_INTERVAL = 2000; // 2 seconds per message
export const CARD_STAGGER_DELAY = 0.2; // 0.2s between card animations
export const COPY_SUCCESS_DURATION = 2000; // 2 seconds "Copied!" display
