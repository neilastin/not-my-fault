import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

export default function Hero({ className }: HeroProps) {
  return (
    <section className={cn('py-16 md:py-24 text-center', className)}>
      <div className="max-w-container mx-auto px-mobile md:px-desktop">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
          Craft the Perfect Excuse
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
          Generate believable excuses tailored to your situation. Simply input
          the details, and let us handle the rest.
        </p>
      </div>
    </section>
  );
}
