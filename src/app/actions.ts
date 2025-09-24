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
        step_name: `step_${stepIndex}`,
        funnel_position: stepIndex,
        total_steps: 7,
      });

      // If this is the final step, capture flow completion
      if (stepIndex === 7) {
        await captureServerEvent(distinctId, 'flow_completed', {
          total_duration_ms: Date.now(), // This would be calculated from start time
          steps: 7,
          completion_rate: 100,
        });
      }

      await shutdownPostHog();
    } catch (error) {
      console.error('Error in advanceStep after hook:', error);
    }
  });

  // Navigate to next step or finish
  // Note: redirect() throws internally, but this is expected behavior in Next.js
  if (stepIndex < 7) {
    redirect(`/steps/${stepIndex + 1}`);
  } else {
    redirect('/finish');
  }
}

export async function trackFunnelAbandonment(stepIndex: number, distinctId: string, reason?: string) {
  'use server';
  
  after(async () => {
    try {
      await captureServerEvent(distinctId, 'funnel_abandoned', {
        step_index: stepIndex,
        step_name: `step_${stepIndex}`,
        funnel_position: stepIndex,
        total_steps: 7,
        completion_rate: (stepIndex / 7) * 100,
        abandonment_reason: reason || 'unknown',
        timestamp: new Date().toISOString(),
      });

      await shutdownPostHog();
    } catch (error) {
      console.error('Error tracking funnel abandonment:', error);
    }
  });
}
