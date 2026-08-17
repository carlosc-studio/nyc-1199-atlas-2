// Captures the most recent unhandled server-side error so that server.ts can
// surface a real stack trace when h3 swallows an SSR throw into a generic
// {"unhandled":true,"message":"HTTPError"} 500 response.
//
// Importing this module for side effects installs the hooks. It is safe to
// import more than once.

let lastCapturedError: unknown;
let installed = false;

function record(error: unknown) {
  if (error != null) lastCapturedError = error;
}

/** Returns the last captured error and clears it. */
export function consumeLastCapturedError(): unknown {
  const error = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}

export function captureError(error: unknown) {
  record(error);
}

function install() {
  if (installed) return;
  installed = true;

  // Anything logged through console.error that looks like an Error is a
  // candidate for the "real" cause of a swallowed 500.
  const originalConsoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const err = args.find((a) => a instanceof Error);
    if (err) record(err);
    originalConsoleError(...args);
  };

  const proc = typeof process !== "undefined" ? process : undefined;
  if (proc && typeof proc.on === "function") {
    proc.on("uncaughtException", record);
    proc.on("unhandledRejection", record);
  } else if (typeof globalThis.addEventListener === "function") {
    globalThis.addEventListener("error", (event) => {
      record((event as ErrorEvent).error ?? event);
    });
    globalThis.addEventListener("unhandledrejection", (event) => {
      record((event as PromiseRejectionEvent).reason ?? event);
    });
  }
}

install();
