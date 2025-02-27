'use server';

import { getPostHogClient } from '@/lib/posthog';
import { after } from 'next/server';

export async function trackEvent(eventName: string, userId: string) {
  after(async () => {
    try {
      const posthog = getPostHogClient();
      await posthog.capture({
        distinctId: userId,
        event: eventName,
      });

      // Flush the queue
      await posthog.shutdown();
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  });
}
