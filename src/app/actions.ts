'use server';

import { captureServerEvent, shutdownPostHog } from '@/lib/posthog/server';
import { after } from 'next/server';
import { redirect } from 'next/navigation';

export async function trackEvent(eventName: string, userId: string) {
  after(async () => {
    try {
      await captureServerEvent(userId, eventName);
      await shutdownPostHog();
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  });
}

export async function advanceStep(stepIndex: number, distinctId: string) {
  'use server';
  
  after(async () => {
    try {
      // Capture server-side acknowledgment
      await captureServerEvent(distinctId, 'step_next_server_ack', {
        step_index: stepIndex,
      });

      // If this is the final step, capture flow completion
      if (stepIndex === 7) {
        await captureServerEvent(distinctId, 'flow_completed', {
          total_duration_ms: Date.now(), // This would be calculated from start time
          steps: 7,
        });
      }

      await shutdownPostHog();
    } catch (error) {
      console.error('Error in advanceStep:', error);
    }
  });

  // Navigate to next step or finish
  if (stepIndex < 7) {
    redirect(`/steps/${stepIndex + 1}`);
  } else {
    redirect('/finish');
  }
}
