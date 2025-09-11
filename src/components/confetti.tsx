'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { captureEvent } from '@/lib/posthog/client';
import { getClientFeatureFlag, FEATURE_FLAGS } from '@/lib/flags';

interface ConfettiProps {
  trigger: boolean;
}

export function Confetti({ trigger }: ConfettiProps) {
  useEffect(() => {
    if (trigger) {
      const shouldShowConfetti = getClientFeatureFlag(FEATURE_FLAGS.FX_CONFETTI_FINISH) === true;
      
      if (shouldShowConfetti) {
        // Create a confetti burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
        });

        // Capture the confetti event
        captureEvent('confetti_shown', {
          source: 'flow_complete',
          feature_flag: FEATURE_FLAGS.FX_CONFETTI_FINISH,
        });
      }
    }
  }, [trigger]);

  return null;
}
