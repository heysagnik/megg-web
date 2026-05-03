export function GET() {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /search
Disallow: /download
Disallow: /_next/static/media/

Sitemap: https://www.meggfashion.in/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain' } },
  )
}
