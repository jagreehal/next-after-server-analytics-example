'use client';

import { useState, useRef } from 'react';
import { captureEvent } from '@/lib/posthog/client';
import { getClientFeatureFlag, FEATURE_FLAGS } from '@/lib/flags';

interface StepButtonProps {
  stepIndex: number;
  onNext: () => void;
  className?: string;
}

export function StepButton({ stepIndex, onNext, className = '' }: StepButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const isBrighterRed = getClientFeatureFlag(FEATURE_FLAGS.EXP_BRIGHTER_RED_STEP2) === true;

  const handleClick = async () => {
    const duration = Date.now() - startTimeRef.current;
    setIsLoading(true);

    try {
      // Capture client-side event
      captureEvent('step_next_clicked', {
        step_index: stepIndex,
        step_duration_ms: duration,
        route: globalThis.location?.pathname,
        variant_brighter_red: isBrighterRed,
      });

      // Call the onNext handler (which will trigger server action)
      await onNext();
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button color based on step and experiment (ROYGBIV rainbow)
  const getButtonColor = () => {
    switch (stepIndex) {
      case 1: { // Red
        return isBrighterRed ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600';
      }
      case 2: { // Orange
        return 'bg-orange-500 hover:bg-orange-600';
      }
      case 3: { // Yellow
        return 'bg-yellow-500 hover:bg-yellow-600';
      }
      case 4: { // Green
        return 'bg-green-500 hover:bg-green-600';
      }
      case 5: { // Blue
        return 'bg-blue-500 hover:bg-blue-600';
      }
      case 6: { // Indigo
        return 'bg-indigo-500 hover:bg-indigo-600';
      }
      case 7: { // Violet
        return 'bg-violet-500 hover:bg-violet-600';
      }
      default: {
        return 'bg-gray-500 hover:bg-gray-600';
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        w-full max-w-md mx-auto px-8 py-4 text-white text-xl font-semibold
        rounded-2xl transition-all duration-200 transform
        ${getButtonColor()}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        ${className}
      `}
    >
      {isLoading ? 'Processing...' : 'Next'}
    </button>
  );
}
