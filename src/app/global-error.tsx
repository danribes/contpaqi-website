'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Global Error Handler for Next.js App Router
 * This component catches unhandled errors at the root level.
 *
 * Note: This component must be a Client Component and include its own <html> and <body> tags.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-6 text-8xl">😵</div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Oops! Something went wrong
            </h1>
            <p className="mb-6 text-gray-600">
              We apologize for the inconvenience. Our team has been notified and is
              working to fix the issue.
            </p>
            {error.digest && (
              <p className="mb-6 text-sm text-gray-400">
                Error ID: {error.digest}
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
              >
                Try again
              </button>
              <a
                href="/"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Go to homepage
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
