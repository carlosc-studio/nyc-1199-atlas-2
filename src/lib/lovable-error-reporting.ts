// Client-side error reporting hook used by the root error boundary.
//
// Inside the Lovable preview the app runs in an iframe, and errors are forwarded
// to the parent frame over postMessage. Outside that context (local dev, your own
// hosting) there is no parent to talk to, so this degrades to a console log.
// Swap the body of `reportLovableError` for a Sentry / PostHog / custom endpoint
// call if you want real production error tracking.

type ErrorContext = Record<string, unknown>;

function serialize(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { name: "UnknownError", message: String(error), stack: undefined };
}

export function reportLovableError(error: unknown, context: ErrorContext = {}) {
  const payload = {
    type: "lovable:error",
    error: serialize(error),
    context,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    timestamp: new Date().toISOString(),
  };

  if (typeof window === "undefined") {
    console.error("[error-report]", payload);
    return;
  }

  try {
    // Only meaningful when embedded; harmless otherwise.
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, "*");
    }
  } catch {
    // Cross-origin parent — nothing to do.
  }

  console.error("[error-report]", payload.error, context);
}
