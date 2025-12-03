import { Event } from 'autotel/event';
import type { FunnelStatus } from 'autotel/event-subscriber';
import { PostHogSubscriber } from 'autotel-subscribers/posthog';
import { ENVIRONMENT_PREFIX } from '../flags';

let eventsInstance: Event | undefined;
let posthogSubscriber: PostHogSubscriber | undefined;

/**
 * Get or create the PostHog subscriber instance
 */
function getPostHogSubscriber(): PostHogSubscriber {
  if (!posthogSubscriber) {
    posthogSubscriber = new PostHogSubscriber({
      apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
      // Serverless configuration - send events immediately
      flushAt: 1,
      flushInterval: 0,
      requestTimeout: 3000,
      disableGeoip: true,
      onError: (error) => {
        console.error('PostHog subscriber error:', error);
      },
    });
  }
  return posthogSubscriber;
}

/**
 * Get or create the Events instance with PostHog subscriber
 */
export function getAutotelEvents(): Event {
  if (!eventsInstance) {
    eventsInstance = new Event('next-after-server-analytics', {
      subscribers: [getPostHogSubscriber()],
    });
  }
  return eventsInstance;
}

/**
 * Track a server-side event using autotel
 */
export async function trackServerEvent(
  distinctId: string,
  eventName: string,
  properties?: Record<string, unknown>
) {
  const events = getAutotelEvents();
  // Filter out undefined values as autotel doesn't accept them
  const cleanProperties: Record<string, string | number | boolean> = {
    userId: distinctId,
    ...(properties || {}),
    env: ENVIRONMENT_PREFIX,
    server_ts: new Date().toISOString(),
  };
  
  if (process.env.APP_VERSION) {
    cleanProperties.app_version = process.env.APP_VERSION;
  }
  if (process.env.BUILD_SHA) {
    cleanProperties.build_sha = process.env.BUILD_SHA;
  }
  
  // Remove undefined values
  Object.keys(cleanProperties).forEach(key => {
    if (cleanProperties[key] === undefined) {
      delete cleanProperties[key];
    }
  });
  
  events.trackEvent(eventName, cleanProperties);
}

/**
 * Track a funnel step using autotel
 * Note: stepName should be one of: 'started' | 'completed' | 'abandoned' | 'failed'
 */
export async function trackFunnelStep(
  distinctId: string,
  funnelName: string,
  stepName: FunnelStatus,
  properties?: Record<string, unknown>
) {
  const events = getAutotelEvents();
  // Filter out undefined values as autotel doesn't accept them
  const cleanProperties: Record<string, string | number | boolean> = {
    userId: distinctId,
    ...(properties || {}),
    env: ENVIRONMENT_PREFIX,
    server_ts: new Date().toISOString(),
  };
  
  if (process.env.APP_VERSION) {
    cleanProperties.app_version = process.env.APP_VERSION;
  }
  if (process.env.BUILD_SHA) {
    cleanProperties.build_sha = process.env.BUILD_SHA;
  }
  
  // Remove undefined values
  Object.keys(cleanProperties).forEach(key => {
    if (cleanProperties[key] === undefined) {
      delete cleanProperties[key];
    }
  });
  
  events.trackFunnelStep(funnelName, stepName, cleanProperties);
}

/**
 * Track an outcome using autotel
 */
export async function trackOutcome(
  distinctId: string,
  outcomeName: string,
  result: 'success' | 'failure',
  properties?: Record<string, unknown>
) {
  const events = getAutotelEvents();
  // Filter out undefined values as autotel doesn't accept them
  const cleanProperties: Record<string, string | number | boolean> = {
    userId: distinctId,
    ...(properties || {}),
    env: ENVIRONMENT_PREFIX,
    server_ts: new Date().toISOString(),
  };
  
  if (process.env.APP_VERSION) {
    cleanProperties.app_version = process.env.APP_VERSION;
  }
  if (process.env.BUILD_SHA) {
    cleanProperties.build_sha = process.env.BUILD_SHA;
  }
  
  // Remove undefined values
  Object.keys(cleanProperties).forEach(key => {
    if (cleanProperties[key] === undefined) {
      delete cleanProperties[key];
    }
  });
  
  events.trackOutcome(outcomeName, result, cleanProperties);
}

/**
 * Get feature flag value using autotel PostHog subscriber
 */
export async function getFeatureFlag(
  distinctId: string,
  flagKey: string
): Promise<boolean | string | undefined> {
  const subscriber = getPostHogSubscriber();
  return await subscriber.getFeatureFlag(flagKey, distinctId);
}

/**
 * Check if feature is enabled using autotel PostHog subscriber
 */
export async function isFeatureEnabled(
  distinctId: string,
  flagKey: string
): Promise<boolean> {
  const subscriber = getPostHogSubscriber();
  return await subscriber.isFeatureEnabled(flagKey, distinctId);
}

/**
 * Shutdown autotel and flush all events
 */
export async function shutdownAutotel() {
  // Event class doesn't have shutdown, but subscribers do
  if (posthogSubscriber) {
    await posthogSubscriber.shutdown();
    posthogSubscriber = undefined;
  }
  // Reset the events instance
  eventsInstance = undefined;
}
