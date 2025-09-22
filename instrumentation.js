// instrumentation.js
export function register() {
}

export const onRequestError = async (err, request) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPostHogServer } = require('./lib/posthog/server');
    const posthog = await getPostHogServer();
    let distinctId = null;
    if (request.headers.cookie) {
      const cookieString = request.headers.cookie;
      const postHogCookieMatch = cookieString.match(
        /ph_phc_.*?_posthog=([^;]+)/,
      );

      if (postHogCookieMatch && postHogCookieMatch[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1]);
          const postHogData = JSON.parse(decodedCookie);
          distinctId = postHogData.distinct_id;
        } catch (error) {
          console.error('Error parsing PostHog cookie:', error);
        }
      }
    }

    await posthog.captureException(err, distinctId || undefined);
  }
};
