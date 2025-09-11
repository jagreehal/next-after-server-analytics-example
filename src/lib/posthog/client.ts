import { PostHog } from 'posthog-js';

let posthog: PostHog | undefined;

export function getPostHogClient(): PostHog | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  if (!posthog) {
    posthog = new PostHog();
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
    });
  }

  return posthog;
}

export function captureEvent(eventName: string, properties?: Record<string, unknown>) {
  const client = getPostHogClient();
  if (client) {
    client.capture(eventName, {
      ...properties,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION,
      build_sha: process.env.NEXT_PUBLIC_BUILD_SHA,
      env: process.env.NEXT_PUBLIC_APP_ENV,
      page_path: globalThis.location?.pathname,
    });
  }
}

export function identifyUser(distinctId: string, properties?: Record<string, unknown>) {
  const client = getPostHogClient();
  if (client) {
    client.identify(distinctId, properties);
  }
}

export function getFeatureFlag(flagKey: string): boolean | string | undefined {
  const client = getPostHogClient();
  if (client) {
    return client.getFeatureFlag(flagKey);
  }
  return undefined;
}

export function onFeatureFlags(callback: () => void) {
  const client = getPostHogClient();
  if (client) {
    client.onFeatureFlags(callback);
  }
}
