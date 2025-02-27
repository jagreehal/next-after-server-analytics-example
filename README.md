# Next.js 15’s after: Background PostHog Tracking for a Faster UX

Imagine this: you run a busy online shop where every moment matters.

Your customers expect the fastest page loads, yet you still require dependable analytics to understand user behaviour and drive informed business decisions.

Relying solely on client-side tracking with tools like PostHog can be fraught with challenges. Many users have ad blockers or privacy extensions that prevent tracking scripts from running, and even when these scripts do execute, they can slow down page rendering and affect conversion rates.

## The Problem with Client-side Analytics

- **Browser Blockers**: Ad blockers or privacy extensions often intercept client-side analytics requests, leading to data loss.

- **Performance Delays**: Tracking scripts that run on the client can slow down page loading as they load and execute.

- **Reliability Issues**: Network hiccups or browser inconsistencies might stop analytics data from being sent reliably.

## The Solution: Server-side analytics with next/after

Next.js 15 introduces the `after` function from `next/server`.

This feature lets you run code after the response has been sent to the client. In practice, this means you can offload non-critical tasks, such as tracking user events,to the background, ensuring your users enjoy a fast, seamless experience.

### Benefits include

- **Bypass Browser Restrictions**: Ad blockers don't affect server-side requests, ensuring you capture every important event.

- **Faster Load Times**: Your users get an immediate response, while the tracking occurs asynchronously.

- **Improved Reliability**: Handling analytics on the server minimises issues caused by network fluctuations or browser quirks.

- **Improved UX with Immediate Redirects**: When a form is submitted, the user is redirected to the success page instantly, without waiting for analytics tracking to complete.

- **Resource Optimization**: Computing resources are better utilized as analytics processing doesn't block your main user flows.

- **Optimal for Serverless**: Perfect for serverless environments where compute time is limited, as it allows the main response to complete quickly.

## Implementing This with PostHog

### 1. Set Up Your Next.js 15 Project

First, create your Next.js project:

```bash
npx create-next-app@latest my-analytics-app
```

The `after` function is available by default in Next.js 15 without requiring any experimental flags.

### 2. Install PostHog and Secure Your Credentials

Install the PostHog Node.js library:

```bash
npm install posthog-node
```

Create a utility file to initialise your PostHog client using server-only environment variables. This is important to ensure your API key remains secure:

```typescript
// src/lib/posthog.ts
import { PostHog } from 'posthog-node';

export function getPostHogClient() {
  return new PostHog(
    process.env.POSTHOG_KEY as string, // Use a server-side environment variable
    { host: process.env.POSTHOG_HOST as string },
  );
}
```

Set your credentials in a .env.local file:

```plaintext
POSTHOG_KEY=your_project_api_key
POSTHOG_HOST=https://app.posthog.com
```

### 3. Track Events with next/after

Use a server action to defer analytics tracking until after the response is sent. This ensures that the analytics process doesn't hamper user experience:

```typescript
// src/app/actions.ts
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

      // Flush the queue using the standard shutdown method
      await posthog.shutdown();
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  });
}
```

### 4. Integrate Tracking in Your Components

For instance, if you wish to track a form submission without delaying the user's redirect, you might do the following:

```typescript
// src/app/page.tsx
import { trackEvent } from './actions';
import { redirect } from 'next/navigation';

export default function Home() {
  async function handleSubmit(formData: FormData) {
    'use server';
    // Process form data as required
    const email = formData.get('email') as string;

    // This won't block the response - analytics happens in the background
    await trackEvent('form_submitted', email || 'anonymous_user');

    // User is redirected immediately
    redirect('/success');
  }

  return (
    <form action={handleSubmit}>
      <input type="email" name="email" placeholder="Enter your email" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 5. Create a Success Page

Create a simple success page that users will be redirected to after form submission:

```typescript
// src/app/success/page.tsx
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div>
      <h1>Form Submitted Successfully!</h1>
      <p>Your form has been submitted and analytics are being tracked in the background.</p>
      <Link href="/">Back to Home</Link>
    </div>
  );
}
```

### 6. Run the Development Server

```bash
npm run dev
```

### 7. Submit the Form

Submit the form to see server-side analytics in action. You can check your PostHog dashboard to verify the events are being tracked.

## Why This Approach Works

- **Instant User Experience**: The critical page rendering and navigations aren't delayed by analytics processing.

- **Accurate Data**: Server-side tracking bypasses the limitations of ad blockers and reduces the chance of network-related errors.

- **Simple Integration**: The `after` function makes managing background tasks straightforward without complex setups.

Using Next.js 15's cutting-edge features combined with PostHog for server-side analytics, you can optimise your website's performance and the accuracy of your data, ensuring a seamless experience for your users and more reliable insights for your business.
