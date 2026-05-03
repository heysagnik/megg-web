export function GET() {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /download

Sitemap: https://www.meggfashion.in/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=86400' } },
  )
}
