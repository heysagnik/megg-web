const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.megg.megg'
const APP_STORE = 'https://apps.apple.com/in/app/megg/id6761561419'

// Static HTML page with client-side UA detection.
// Reading request.headers would force this route dynamic and bypass the edge
// cache — instead we ship a tiny cached page that redirects in the browser,
// so /download (heavily hit via Instagram bio / UTM) is served from the edge.
const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MEGG — Get the app</title>
<style>body{margin:0;background:#0a0a0a;color:#fff;font:14px/1.5 system-ui,arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}a{color:#fff}</style>
</head>
<body>
<noscript>
  <p>Redirecting to the MEGG app…</p>
  <p><a href="${PLAY_STORE}">Open Google Play</a> · <a href="${APP_STORE}">Open App Store</a></p>
</noscript>
<script>
(function () {
  var ua = navigator.userAgent || '';
  var url = /iphone|ipad|ipod/i.test(ua) ? ${JSON.stringify(APP_STORE)} : ${JSON.stringify(PLAY_STORE)};
  try { location.replace(url); } catch (e) { location.href = url; }
})();
</script>
</body>
</html>`

// Mark the route static so the build prerenders a single cached response.
// Without this, Next.js defaults route handlers to Dynamic even when they
// don't read the request, which would defeat the whole point of this redirect.
export const dynamic = 'force-static'
export const revalidate = false

export function GET() {
  return new Response(HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Edge caches the page indefinitely; browsers short-cache so a UA
      // profile change (rare) doesn't keep them stuck on the wrong store.
      'Cache-Control': 'public, max-age=300, s-maxage=31536000, stale-while-revalidate=31536000',
    },
  })
}
