export const dynamic = 'force-static'
export const revalidate = 86400

export function GET() {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /download

# AI Search & LLM Crawlers (GEO Optimization)
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://www.meggfashion.in/sitemap.xml
# LLM Indexing
# https://www.meggfashion.in/llms.txt
# https://www.meggfashion.in/llms-full.txt
`,
    { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=86400' } },
  )
}
