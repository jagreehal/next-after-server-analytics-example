import { PostHog } from 'posthog-node';

export function getPostHogClient() {
  return new PostHog(
    process.env.POSTHOG_KEY as string, // Use a server-side environment variable
    { host: process.env.POSTHOG_HOST as string },
  );
}
