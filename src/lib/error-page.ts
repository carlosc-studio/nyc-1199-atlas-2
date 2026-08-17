// Minimal dependency-free HTML shell rendered when SSR fails hard. Kept as a
// plain string so it can be returned from contexts where React is unavailable
// or already the thing that blew up. Styled to match the atlas palette
// (paper cream / ink black / MTA signal yellow).

export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Something went wrong</title>
    <style>
      :root { color-scheme: light dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
        background: #fbfaf6;
        color: #1a1a20;
        font-family: "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;
      }
      .card {
        max-width: 34rem;
        width: 100%;
        border: 1px solid #e2ded2;
        border-radius: 0.375rem;
        background: #fff;
        padding: 2rem;
      }
      .bullet {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 999px;
        background: #f2c94c;
        color: #1a1a20;
        font-weight: 700;
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        margin-bottom: 1.25rem;
      }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; letter-spacing: -0.01em; }
      p { margin: 0 0 1.5rem; color: #5c5c66; line-height: 1.6; font-size: 0.95rem; }
      a {
        display: inline-block;
        padding: 0.55rem 1rem;
        border-radius: 0.375rem;
        background: #1a1a20;
        color: #fbfaf6;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
      }
      @media (prefers-color-scheme: dark) {
        body { background: #16161c; color: #f5f4ef; }
        .card { background: #1d1d24; border-color: #34343d; }
        p { color: #a1a1ac; }
        a { background: #f5f4ef; color: #16161c; }
      }
    </style>
  </head>
  <body>
    <main class="card">
      <span class="bullet">!</span>
      <h1>Service interruption</h1>
      <p>
        The server hit an unexpected error while rendering this page. The issue has been
        logged. Reloading usually clears it — if it doesn't, try again in a few minutes.
      </p>
      <a href="/">Back to the atlas</a>
    </main>
  </body>
</html>
`;
}
