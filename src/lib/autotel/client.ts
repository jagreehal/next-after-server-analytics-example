'use client';

/**
 * Client-side autotel wrapper
 * 
 * Note: PostHogSubscriber from autotel-subscribers is designed for server-side (posthog-node)
 * and doesn't work in the browser. For client-side, we fall back to using PostHog directly
 * via the existing PostHog client initialized in the provider.
 * 
 * Server-side tracking uses autotel with PostHogSubscriber (see src/lib/autotel/server.ts)
 */

import { getPostHogClient } from '../posthog/client';
import { getDistinctId } from '../flags';

/**
 * Track a client-side event
 * Falls back to PostHog directly since autotel PostHogSubscriber is server-only
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  const client = getPostHogClient();
  if (!client) return;
  
  const distinctId = getDistinctId();
  client.capture(eventName, {
    userId: distinctId,
    ...properties,
    app_version: process.env.NEXT_PUBLIC_APP_VERSION,
    build_sha: process.env.NEXT_PUBLIC_BUILD_SHA,
    env: process.env.NEXT_PUBLIC_APP_ENV,
    page_path: typeof globalThis !== 'undefined' ? globalThis.location?.pathname : undefined,
    session_id: client.get_session_id?.() || undefined,
    user_agent: typeof globalThis !== 'undefined' ? globalThis.navigator?.userAgent : undefined,
    timestamp: new Date().toISOString(),
  });
}
