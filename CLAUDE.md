# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application demonstrating PostHog analytics integration with server-side tracking using `next/after`. It features a 7-step rainbow-themed flow with A/B testing, feature flags, and comprehensive event tracking.

## Development Commands

```bash
# Development server (runs on port 3001)
npm run dev

# Build the application
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint

# Run tests
npm test

# Type checking
npm run type-check
```

## Environment Setup

Required environment variables in `.env.local`:
- `POSTHOG_KEY`: PostHog project key (starts with `phc_`)
- `POSTHOG_HOST`: PostHog host URL (usually `https://app.posthog.com`)
- `APP_ENV`: Environment name (development/production/test)
- `APP_VERSION`: Application version
- `BUILD_SHA`: Build identifier

## Architecture

### Core Analytics Pattern
- **Client-side tracking**: PostHog browser SDK for user interactions
- **Server-side tracking**: PostHog Node SDK with `next/after` for non-blocking capture
- **Server actions**: Located in `src/app/actions.ts` using `advanceStep()` for flow progression

### Feature Flag System
- Environment-prefixed flags: `{ENV}_flag_name` (e.g., `DEV_EXP_BRIGHTER_RED_STEP2`)
- Flag utilities in `src/lib/flags.ts` with `FEATURE_FLAGS` constants
- Both client and server evaluation capabilities

### Key Directories
- `src/app/`: Next.js App Router pages and server actions
- `src/components/`: React components including PostHog provider and UI elements
- `src/lib/posthog/`: PostHog client/server utilities and hooks
- `src/lib/flags.ts`: Feature flag helpers and environment configuration

### PostHog Integration
- Server SDK: `src/lib/posthog/server.ts` with proper shutdown handling
- Client SDK: `src/lib/posthog/client.ts` and provider in `src/components/posthog-provider.tsx`
- Next.js config includes PostHog proxy rewrites for `/ingest/*`

## Testing

Uses Vitest with React Testing Library. Test files should follow the pattern `*.test.{ts,tsx}`. The test environment is configured for Node.js in `vitest.config.mts`.

## Event Tracking Patterns

When adding new analytics:
1. Client events: Use PostHog hooks from `src/lib/posthog/hooks.ts`
2. Server events: Use `captureServerEvent()` from `src/lib/posthog/server.ts`
3. Always use `after()` for server-side tracking to avoid blocking user experience
4. Include environment prefix and standard properties (app_version, build_sha, env)

## Common Pitfalls

- Always call `shutdownPostHog()` after server-side events
- Use environment-prefixed feature flag names
- Server actions must be marked with `'use server'`
- PostHog client must be properly initialized before use