'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePostHogCapture } from '@/lib/posthog/hooks';
import { getClientFeatureFlag, FEATURE_FLAGS } from '@/lib/flags';

export default function Home(): React.ReactElement {
  const [isInitialized, setIsInitialized] = useState(false);
  const isAltPage = getClientFeatureFlag(FEATURE_FLAGS.START_ALT_PAGE) === true;
  const { captureEvent, capturePageView } = usePostHogCapture();

  useEffect(() => {
    // Capture page view for home page
    capturePageView('/', {
      variant: isAltPage ? 'alt' : 'default',
      feature_flag: FEATURE_FLAGS.START_ALT_PAGE,
    });
    
    // Capture start variant viewed event
    captureEvent('start_variant_viewed', {
      variant: isAltPage ? 'alt' : 'default',
      feature_flag: FEATURE_FLAGS.START_ALT_PAGE,
    });
    setIsInitialized(true);
  }, [isAltPage, captureEvent, capturePageView]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="max-w-3xl mx-auto text-center">
        {isAltPage ? (
          // Alternative start page
          <>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              🌈 Rainbow Journey Awaits
            </h1>
            <div className="mt-8">
              <Link
                href="/steps/1"
                className="inline-block px-8 py-4 bg-gradient-to-r from-red-500 via-orange-500 to-emerald-500 text-white text-xl font-semibold rounded-2xl hover:scale-105 transition-transform"
              >
                Begin Rainbow Journey
              </Link>
            </div>
          </>
        ) : (
          // Default start page
          <>
            <div className="mt-8">
              <Link
                href="/steps/1"
                className="inline-block px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-2xl hover:bg-blue-700 transition-colors"
              >
                Start 7-Step Rainbow Flow
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
