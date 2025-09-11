export const FEATURE_FLAGS = {
  EXP_BRIGHTER_RED_STEP2: 'exp_brighter_red_step2',
  FX_CONFETTI_FINISH: 'fx_confetti_finish',
  START_ALT_PAGE: 'start_alt_page',
} as const;

export type FeatureFlagKey = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS];

// Server feature flag function moved to server actions to avoid bundling issues

export function getClientFeatureFlag(flagKey: FeatureFlagKey): boolean | string | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  
  // This will be populated by the PostHog provider
  const flags = (globalThis as Record<string, unknown>).__POSTHOG_FLAGS__ as Record<string, unknown> | undefined;
  return flags?.[flagKey] as boolean | string | undefined;
}

export function getDistinctId(): string {
  if (typeof globalThis === 'undefined') return 'server-user';
  
  // Get from PostHog client or generate a temporary one
  const client = (globalThis as Record<string, unknown>).posthog;
  if (client) {
    return (client as { get_distinct_id: () => string }).get_distinct_id();
  }
  
  // Fallback: generate a temporary ID
  let distinctId = globalThis.localStorage?.getItem('posthog_distinct_id');
  if (!distinctId) {
    distinctId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    globalThis.localStorage?.setItem('posthog_distinct_id', distinctId);
  }
  return distinctId;
}
