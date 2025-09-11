'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StepButton } from '@/components/step-button';
import { captureEvent, capturePageView } from '@/lib/posthog/client';
import { getClientFeatureFlag, FEATURE_FLAGS, getDistinctId } from '@/lib/flags';
import { advanceStep, trackFunnelAbandonment } from '@/app/actions';

export default function StepPage() {
  const params = useParams();
  const stepIndex = Number.parseInt(params.index as string, 10);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (stepIndex >= 1 && stepIndex <= 7) {
      const isBrighterRed = getClientFeatureFlag(FEATURE_FLAGS.EXP_BRIGHTER_RED_STEP2) === true;
      const distinctId = getDistinctId();
      
      // Capture page view for this specific step
      capturePageView(`/steps/${stepIndex}`, {
        step_index: stepIndex,
        step_name: `step_${stepIndex}`,
        funnel_position: stepIndex,
        total_steps: 7,
        variant_brighter_red: isBrighterRed,
        feature_flag: FEATURE_FLAGS.EXP_BRIGHTER_RED_STEP2,
        user_id: distinctId,
      });
      
      // Also capture step viewed event for additional tracking
      captureEvent('step_viewed', {
        step_index: stepIndex,
        step_name: `step_${stepIndex}`,
        funnel_position: stepIndex,
        total_steps: 7,
        variant_brighter_red: isBrighterRed,
        feature_flag: FEATURE_FLAGS.EXP_BRIGHTER_RED_STEP2,
        user_id: distinctId,
      });
      
      setIsInitialized(true);
    }
  }, [stepIndex]);

  // Track when user leaves the page (funnel abandonment)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const distinctId = getDistinctId();
      // Track abandonment when user leaves the page
      trackFunnelAbandonment(stepIndex, distinctId, 'page_leave');
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const distinctId = getDistinctId();
        trackFunnelAbandonment(stepIndex, distinctId, 'tab_switch');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stepIndex]);

  const handleNext = async () => {
    const distinctId = getDistinctId();
    await advanceStep(stepIndex, distinctId);
  };

  if (!isInitialized || stepIndex < 1 || stepIndex > 7) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  const getStepColor = () => {
    switch (stepIndex) {
      case 1: { // Red
        return 'bg-red-500';
      }
      case 2: { // Orange
        return 'bg-orange-500';
      }
      case 3: { // Yellow
        return 'bg-yellow-500';
      }
      case 4: { // Green
        return 'bg-green-500';
      }
      case 5: { // Blue
        return 'bg-blue-500';
      }
      case 6: { // Indigo
        return 'bg-indigo-500';
      }
      case 7: { // Violet
        return 'bg-violet-500';
      }
      default: {
        return 'bg-gray-500';
      }
    }
  };

  const getStepTitle = () => {
    switch (stepIndex) {
      case 1: {
        return 'Step 1: Red - Getting Started';
      }
      case 2: {
        return 'Step 2: Orange - Making Progress';
      }
      case 3: {
        return 'Step 3: Yellow - Bright Ideas';
      }
      case 4: {
        return 'Step 4: Green - Growing Strong';
      }
      case 5: {
        return 'Step 5: Blue - Deep Thoughts';
      }
      case 6: {
        return 'Step 6: Indigo - Mysterious Depths';
      }
      case 7: {
        return 'Step 7: Violet - Final Journey';
      }
      default: {
        return `Step ${stepIndex}`;
      }
    }
  };

  const getStepDescription = () => {
    switch (stepIndex) {
      case 1: {
        return 'Welcome to our rainbow journey! Click Next to begin your colorful adventure.';
      }
      case 2: {
        return 'Great job! You\'re making excellent progress through the rainbow.';
      }
      case 3: {
        return 'Bright ideas are flowing! Keep moving through the spectrum.';
      }
      case 4: {
        return 'Growing stronger with each step! The rainbow continues to unfold.';
      }
      case 5: {
        return 'Deep thoughts and blue skies ahead! You\'re halfway through.';
      }
      case 6: {
        return 'Mysterious depths of indigo await! Almost at the end.';
      }
      case 7: {
        return 'The final violet step! Ready to complete your rainbow journey?';
      }
      default: {
        return 'Continue your journey through the rainbow.';
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="max-w-2xl mx-auto text-center">
        {/* Step indicator */}
        <div className="mb-8">
          <div className={`w-24 h-24 mx-auto rounded-full ${getStepColor()} flex items-center justify-center mb-4`}>
            <span className="text-white text-2xl font-bold">{stepIndex}</span>
          </div>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= stepIndex ? getStepColor() : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
          {getStepTitle()}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {getStepDescription()}
        </p>

        {/* Next button */}
        <StepButton stepIndex={stepIndex} onNext={handleNext} />
      </div>
    </div>
  );
}
