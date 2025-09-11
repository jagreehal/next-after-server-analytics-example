'use client';

import { usePostHog } from 'posthog-js/react';
import { getDistinctId } from '../flags';

export function usePostHogCapture() {
  const posthog = usePostHog();

  const captureEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (posthog) {
      posthog.capture(eventName, {
        ...properties,
        app_version: process.env.NEXT_PUBLIC_APP_VERSION,
        build_sha: process.env.NEXT_PUBLIC_BUILD_SHA,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        page_path: typeof globalThis === 'undefined' ? undefined : globalThis.location.pathname,
        session_id: posthog.get_session_id(),
        user_agent: typeof globalThis === 'undefined' ? undefined : globalThis.navigator.userAgent,
        user_id: getDistinctId(),
        timestamp: new Date().toISOString(),
      });
    }
  };

  const capturePageView = (pagePath?: string, properties?: Record<string, unknown>) => {
    if (posthog) {
      const path = pagePath || (typeof globalThis === 'undefined' ? undefined : globalThis.location.pathname);
      posthog.capture('$pageview', {
        $current_url: typeof globalThis === 'undefined' ? undefined : globalThis.location.href,
        $pathname: path,
        ...properties,
        app_version: process.env.NEXT_PUBLIC_APP_VERSION,
        build_sha: process.env.NEXT_PUBLIC_BUILD_SHA,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        session_id: posthog.get_session_id(),
        user_agent: typeof globalThis === 'undefined' ? undefined : globalThis.navigator.userAgent,
        user_id: getDistinctId(),
        timestamp: new Date().toISOString(),
      });
    }
  };

  return { captureEvent, capturePageView, posthog };
}
