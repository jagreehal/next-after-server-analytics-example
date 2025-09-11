import { PostHog } from 'posthog-node';

let posthog: PostHog | undefined;

export function getPostHogClient() {
  if (!posthog) {
    posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
      flushAt: 1, 
      flushInterval: 0,
    });
  }
  return posthog;
}

export async function captureServerEvent(
  distinctId: string,
  eventName: string,
  properties?: Record<string, unknown>
) {
  const client = getPostHogClient();
  await client.capture({
    distinctId,
    event: eventName,
    properties: {
      ...properties,
      app_version: process.env.APP_VERSION,
      build_sha: process.env.BUILD_SHA,
      env: process.env.APP_ENV,
      server_ts: new Date().toISOString(),
    },
  });
}

export async function getFeatureFlag(
  distinctId: string,
  flagKey: string
): Promise<boolean | string | undefined> {
  const client = getPostHogClient();
  return await client.getFeatureFlag(flagKey, distinctId);
}

export async function shutdownPostHog() {
  if (posthog) {
    await posthog.shutdown();
    posthog = undefined;
  }
}
