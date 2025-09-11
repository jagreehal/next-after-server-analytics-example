'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Confetti } from '@/components/confetti';
import { capturePageView } from '@/lib/posthog/client';
import { getClientFeatureFlag, FEATURE_FLAGS, getDistinctId } from '@/lib/flags';

export default function FinishPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Capture page view for finish page
    capturePageView('/finish', {
      step_name: 'finish',
      funnel_position: 8,
      total_steps: 7,
      user_id: getDistinctId(),
    });
    
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const shouldShowConfetti = getClientFeatureFlag(FEATURE_FLAGS.FX_CONFETTI_FINISH) === true;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Confetti trigger={showConfetti && shouldShowConfetti} />
      
      <div className="max-w-2xl mx-auto text-center">
        {/* Success indicator */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div
                key={step}
                className="w-3 h-3 rounded-full bg-green-500"
              />
            ))}
          </div>
        </div>

        {/* Success content */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
          🎉 Flow Completed!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Congratulations! You&apos;ve successfully completed all 7 steps of our rainbow journey (ROYGBIV).
          {shouldShowConfetti && ' Enjoy the confetti!'}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Over
          </Link>
          <Link
            href="/steps/1"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Steps Again
          </Link>
        </div>       
      </div>
    </div>
  );
}
