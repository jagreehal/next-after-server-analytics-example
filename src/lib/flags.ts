// Get environment prefix for feature flags

const ENV_MAP = {
  production: 'PRODUCTION',
  development: 'DEV',
  test: 'TEST',
  local: 'LOCAL',
} as const;

export const ENVIRONMENT_PREFIX = ENV_MAP[process.env.NODE_ENV] || 'LOCAL';

export const FEATURE_FLAGS = {
  EXP_BRIGHTER_RED_STEP2: `${ENVIRONMENT_PREFIX}_EXP_BRIGHTER_RED_STEP2`,
  FX_CONFETTI_FINISH: `${ENVIRONMENT_PREFIX}_FX_CONFETTI_FINISH`,
  START_ALT_PAGE: `${ENVIRONMENT_PREFIX}_START_ALT_PAGE`,
} as const;

// Export the environment prefix for debugging/logging purposes

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
  
  // Fallback: generate a persistent ID
  let distinctId = globalThis.localStorage?.getItem('posthog_distinct_id');
  if (!distinctId) {
    distinctId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    globalThis.localStorage?.setItem('posthog_distinct_id', distinctId);
  }
  return distinctId;
}
