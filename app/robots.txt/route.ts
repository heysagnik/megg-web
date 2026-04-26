export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://meggfashion.in/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain' } },
  )
}
