export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://edge.meggfashion.in/api'

const typeMap: Record<string, 'brand' | 'category' | 'subcategory' | 'multi'> = {
  brands: 'brand',
  categories: 'category',
  subcategories: 'subcategory',
  combinations: 'multi',
}

function transform(raw: unknown) {
  const suggestions: {
    type: 'brand' | 'category' | 'subcategory' | 'multi'
    value: string
    count: number
    filters: Record<string, string>
  }[] = []

  if (raw && typeof raw === 'object' && Array.isArray((raw as { sections: unknown[] }).sections)) {
    for (const section of (raw as { sections: { type: string; items: { label: string; count?: number; filters?: Record<string, string> }[] }[] }).sections) {
      const mappedType = typeMap[section.type]
      if (!mappedType) continue
      for (const item of section.items) {
        suggestions.push({
          type: mappedType,
          value: item.label,
          count: item.count ?? 0,
          filters: item.filters ?? {},
        })
      }
    }
  }
  return suggestions
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || searchParams.get('query') || ''
  const gender = searchParams.get('gender') === 'women' ? 'women' : 'men'

  if (query.trim().length < 2) {
    return Response.json([], { headers: { 'Cache-Control': 'public, max-age=60' } })
  }

  const params = new URLSearchParams({ query, gender })
  const upstream = `${BASE_URL}/autocomplete?${params}`

  try {
    const res = await fetch(upstream, {
      signal: AbortSignal.timeout(3000),
      headers: { 'Accept': 'application/json', 'X-API-Version': '2' },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return Response.json([], { status: 502, headers: { 'Cache-Control': 'public, max-age=10' } })
    }

    const raw = await res.json()
    const suggestions = transform(raw)

    return Response.json(suggestions, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    })
  } catch {
    return Response.json([], { status: 502, headers: { 'Cache-Control': 'public, max-age=10' } })
  }
}