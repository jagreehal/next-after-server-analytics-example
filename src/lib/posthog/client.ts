export function getPostHogClient() {
  if (typeof globalThis === 'undefined') {
    return null;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).posthog;
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
      session_id: client.get_session_id(),
      user_agent: globalThis.navigator?.userAgent,
      timestamp: new Date().toISOString(),
    });
  }
}

export function capturePageView(pagePath?: string, properties?: Record<string, unknown>) {
  const client = getPostHogClient();
  if (client) {
    const path = pagePath || globalThis.location?.pathname;
    client.capture('$pageview', {
      $current_url: globalThis.location?.href,
      $pathname: path,
      ...properties,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION,
      build_sha: process.env.NEXT_PUBLIC_BUILD_SHA,
      env: process.env.NEXT_PUBLIC_APP_ENV,
      session_id: client.get_session_id(),
      user_agent: globalThis.navigator?.userAgent,
      timestamp: new Date().toISOString(),
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
