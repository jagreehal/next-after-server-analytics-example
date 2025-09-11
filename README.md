# PostHog Kitchen Sink - Next.js Analytics Demo

A comprehensive Next.js application demonstrating PostHog analytics, feature flags, and server actions with a beautiful rainbow-themed 4-step flow.

## Features

### 🎯 Analytics Tracking
- **Step View Events**: Captures when users view each step
- **Click Timing Data**: Measures time spent on each step
- **Server-Side Capture**: Uses Next.js `next/after` for server-side analytics
- **Funnel Analysis**: Complete funnel from start to finish
- **Event Properties**: Rich metadata including feature flag states

### 🚩 Feature Flags
- **`exp_brighter_red_step2`**: 50/50 A/B test for brighter red button on Step 2
- **`fx_confetti_finish`**: Toggle for confetti celebration on completion
- **`start_alt_page`**: Alternative start page with different copy and styling

### 🌈 User Experience
- **Rainbow Color Scheme**: Each step has a distinct ROYGBIV color (Red, Orange, Yellow, Green, Blue, Indigo, Violet)
- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Hover effects and transitions
- **Confetti Celebration**: Canvas-confetti integration for completion

## Quick Start

### 1. Environment Setup

Copy the environment template and configure your PostHog project:

```bash
cp env.example .env.local
```

Edit `.env.local` with your PostHog credentials:

```env
POSTHOG_KEY=phc_your_project_key_here
POSTHOG_HOST=https://app.posthog.com
APP_ENV=development
APP_VERSION=1.0.0
BUILD_SHA=local-dev
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up PostHog Feature Flags

In your PostHog project, create these feature flags with environment-specific prefixes:

#### Environment-Specific Naming
The app automatically prefixes feature flags based on the environment:
- **Development**: `DEV_exp_brighter_red_step2`
- **Production**: `PRODUCTION_exp_brighter_red_step2`
- **Test**: `TEST_exp_brighter_red_step2`
- **Local/Other**: `LOCAL_exp_brighter_red_step2`

#### Feature Flags to Create

**`{ENV_PREFIX}exp_brighter_red_step2`**
- **Type**: Boolean
- **Rollout**: 50% (for A/B testing)
- **Description**: Makes Step 2 button brighter red

**`{ENV_PREFIX}fx_confetti_finish`**
- **Type**: Boolean
- **Rollout**: 100% (or as desired)
- **Description**: Shows confetti on flow completion

**`{ENV_PREFIX}start_alt_page`**
- **Type**: Boolean
- **Rollout**: 0% (or as desired)
- **Description**: Shows alternative start page

> **Note**: Replace `{ENV_PREFIX}` with your environment prefix (DEV_, PRODUCTION_, TEST_, or LOCAL_)

### 4. Run the Application

```bash
bun dev
```

Visit `http://localhost:3001` to see the app in action!

## Event Tracking

The app captures the following events:

| Event | Trigger | Properties |
|-------|---------|------------|
| `start_variant_viewed` | Start page rendered | `variant`, `feature_flag` |
| `step_viewed` | Step page render | `step_index`, `variant_brighter_red`, `feature_flag` |
| `step_next_clicked` | "Next" button click | `step_index`, `step_duration_ms`, `route`, `variant_brighter_red` |
| `step_next_server_ack` | Server action executed | `step_index`, `server_ts`, `env` |
| `flow_completed` | After Step 4 completion | `total_duration_ms`, `steps` |
| `confetti_shown` | Confetti displayed | `source`, `feature_flag` |

## Architecture

### Client-Side
- **PostHog Browser SDK**: Event capture and feature flag evaluation
- **React Components**: StepButton, Confetti, PostHogProvider
- **Timing Measurement**: High-resolution timestamps for step duration

### Server-Side
- **PostHog Node SDK**: Server-side event capture
- **Next.js Server Actions**: `advanceStep` function with `next/after`
- **Feature Flag Evaluation**: Server-side flag checking

### File Structure
```
src/
├── app/
│   ├── layout.tsx              # PostHog provider + SSR setup
│   ├── page.tsx                # Start page with feature flag
│   ├── actions.ts              # Server actions
│   ├── steps/[index]/page.tsx  # Step pages (1-4)
│   └── finish/page.tsx         # Completion page
├── components/
│   ├── posthog-provider.tsx    # PostHog client setup
│   ├── step-button.tsx         # Next button with timing
│   └── confetti.tsx            # Confetti celebration
└── lib/
    ├── posthog/
    │   ├── client.ts           # Browser SDK utilities
    │   └── server.ts           # Node SDK utilities
    └── flags.ts                # Feature flag helpers
```

## Testing the Flow

1. **Start Page**: Visit `/` to see the default or alternative start page
2. **Step Flow**: Click "Start 4-Step Flow" to begin the rainbow journey
3. **Step Progression**: Navigate through Steps 1-4 with the "Next" button
4. **Completion**: Reach the finish page and see confetti (if enabled)
5. **Analytics**: Check your PostHog dashboard for captured events

## PostHog Dashboard Setup

### Funnel Analysis
Create a funnel with these steps:
1. `start_variant_viewed`
2. `step_viewed` (step_index = 1)
3. `step_viewed` (step_index = 2)
4. `step_viewed` (step_index = 3)
5. `step_viewed` (step_index = 4)
6. `flow_completed`

### Experiment Analysis
- **Primary Metric**: `flow_completed` conversion rate
- **Secondary Metrics**: `step_duration_ms` on Step 2, overall funnel conversion
- **Breakdown**: By `variant_brighter_red` property

### Trends
- Median `step_duration_ms` per step
- Event volume over time
- Feature flag usage rates

## Development Notes

- **Distinct ID**: Uses PostHog's default anonymous ID with localStorage fallback
- **Server Actions**: All server-side events use `next/after` for non-blocking capture
- **Feature Flags**: Evaluated on both client and server for consistency
- **Error Handling**: Graceful fallbacks for missing PostHog configuration
- **Performance**: Optimized for fast loading and smooth user experience

## Troubleshooting

### Events Not Appearing
1. Check PostHog project key and host in `.env.local`
2. Verify feature flags are created in PostHog
3. Check browser console for errors
4. Ensure PostHog project is active

### Feature Flags Not Working
1. Verify flag names match exactly: `exp_brighter_red_step2`, `fx_confetti_finish`, `start_alt_page`
2. Check flag rollout percentages
3. Clear browser cache and localStorage
4. Verify flag evaluation in PostHog debugger

### Server Actions Failing
1. Check server console for errors
2. Verify PostHog server-side configuration
3. Ensure `next/after` is properly imported
4. Check network tab for failed requests

## Contributing

This is a demonstration project. Feel free to fork and modify for your own PostHog testing needs!

## License

MIT License - see LICENSE file for details.