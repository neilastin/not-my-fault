import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL } from '@/lib/constants';

interface LoadingAnimationProps {
  isLoading: boolean;
}

export default function LoadingAnimation({ isLoading }: LoadingAnimationProps) {
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

  if (!isLoading) {
    return null;
  }

  return (
    <div className="py-12 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-accent-purple text-lg font-medium"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
