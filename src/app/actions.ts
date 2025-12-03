'use server';

import { trackServerEvent, trackFunnelStep, trackOutcome, shutdownAutotel } from '@/lib/autotel/server';
import { after } from 'next/server';
import { redirect } from 'next/navigation';

export async function trackEvent(eventName: string, userId: string) {
  after(async () => {
    try {
      await trackServerEvent(userId, eventName);
      await shutdownAutotel();
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  });
}

export async function advanceStep(stepIndex: number, distinctId: string) {
  'use server';

  after(async () => {
    try {
      // Track step progression as an event
      await trackServerEvent(distinctId, 'step_next_server_ack', {
        step_index: stepIndex,
        step_name: `step_${stepIndex}`,
        funnel_position: stepIndex,
        total_steps: 7,
      });

      // If this is the final step, track flow completion
      if (stepIndex === 7) {
        // Track as both a funnel completion and an outcome
        await trackFunnelStep(distinctId, 'rainbow_flow', 'completed', {
          steps: 7,
          completion_rate: 100,
        });
        await trackOutcome(distinctId, 'flow.completed', 'success', {
          total_duration_ms: Date.now(), // This would be calculated from start time
          steps: 7,
          completion_rate: 100,
        });
      }

      await shutdownAutotel();
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
      // Track abandonment as both a funnel status and an outcome
      await trackFunnelStep(distinctId, 'rainbow_flow', 'abandoned', {
        step_index: stepIndex,
        step_name: `step_${stepIndex}`,
        funnel_position: stepIndex,
        total_steps: 7,
        completion_rate: (stepIndex / 7) * 100,
        abandonment_reason: reason || 'unknown',
      });
      await trackOutcome(distinctId, 'funnel.abandoned', 'failure', {
        step_index: stepIndex,
        step_name: `step_${stepIndex}`,
        funnel_position: stepIndex,
        total_steps: 7,
        completion_rate: (stepIndex / 7) * 100,
        abandonment_reason: reason || 'unknown',
      });

      await shutdownAutotel();
    } catch (error) {
      console.error('Error tracking funnel abandonment:', error);
    }
  });
}
