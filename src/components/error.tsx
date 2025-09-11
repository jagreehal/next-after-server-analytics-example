"use client";  // Error boundaries must be Client Components

import posthog from "posthog-js";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <>
      <h1>Error</h1>
      <p>{error.message}</p>
      <Link href="/">Go back to home</Link>
    </>
  );
}