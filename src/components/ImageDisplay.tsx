import { motion, AnimatePresence } from 'framer-motion';
import { Download, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  accentColor: 'blue' | 'purple' | 'green';
  excuseType?: 'excuse1' | 'excuse2' | 'excuse3';
}

const accentColorClasses = {
  blue: {
    border: 'border-accent-blue',
    glow: 'shadow-lg shadow-accent-blue/20',
    bg: 'bg-accent-blue/5',
    text: 'text-accent-blue',
  },
  purple: {
    border: 'border-accent-purple',
    glow: 'shadow-lg shadow-accent-purple/20',
    bg: 'bg-accent-purple/5',
    text: 'text-accent-purple',
  },
  green: {
    border: 'border-accent-green',
    glow: 'shadow-lg shadow-accent-green/20',
    bg: 'bg-accent-green/5',
    text: 'text-accent-green',
  },
};

export default function ImageDisplay({
  imageUrl,
  isLoading,
  accentColor,
  excuseType,
}: ImageDisplayProps) {
  const colorClasses = accentColorClasses[accentColor];

  const handleDownload = () => {
    if (!imageUrl) return;

    // Create a temporary link element to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `excuse-evidence-${excuseType || 'photo'}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={cn(
        'relative rounded-card border-2 overflow-hidden',
        'bg-background-card transition-all duration-300',
        colorClasses.border,
        imageUrl && colorClasses.glow
      )}
      style={{ aspectRatio: '16 / 9' }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          // Loading State
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8"
          >
            <div className="relative">
              <div
                className={cn(
                  'animate-spin rounded-full h-16 w-16 border-4 border-t-transparent',
                  `border-accent-${accentColor}`
                )}
              />
              <div
                className={cn(
                  'absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-t-transparent blur-md opacity-50',
                  `border-accent-${accentColor}`
                )}
              />
            </div>
            <p className="text-text-secondary text-lg text-center font-medium">
              Generating your photo evidence...
            </p>
          </motion.div>
        ) : imageUrl ? (
          // Image Display State
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full h-full group"
          >
            <img
              src={imageUrl}
              alt="Generated excuse evidence"
              className="w-full h-full object-cover"
            />

            {/* Download Button Overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-black/0 group-hover:bg-black/40',
                'transition-all duration-300',
                'flex items-center justify-center'
              )}
            >
              <motion.button
                onClick={handleDownload}
                initial={{ opacity: 0, y: 10 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  'px-6 py-3 rounded-lg font-semibold',
                  'bg-accent-green text-background',
                  'shadow-lg shadow-accent-green/20',
                  'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
                  'flex items-center gap-2'
                )}
                aria-label="Download image"
              >
                <Download className="w-5 h-5" />
                Download
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // Empty State
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-center gap-4 p-8',
              'border-2 border-dashed rounded-card',
              colorClasses.border,
              colorClasses.bg
            )}
          >
            <div className={cn('p-4 rounded-full bg-background-input', colorClasses.bg)}>
              <ImageIcon className={cn('w-12 h-12', colorClasses.text)} />
            </div>
            <div className="text-center max-w-md">
              <p className="text-text-primary font-medium mb-1">No photo evidence yet</p>
              <p className="text-text-muted text-sm">
                Generate photo evidence for your excuse
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
