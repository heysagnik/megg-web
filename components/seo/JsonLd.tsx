/**
 * Renders a JSON-LD `<script>` tag server-side.
 *
 * Accepts either the raw object (typical usage) — serialised under the
 * hood via JSON.stringify. Avoids the `dangerouslySetInnerHTML` boilerplate
 * being duplicated at every page.
 *
 * Pass `null` to render nothing.
 */
export interface JsonLdProps {
  data: unknown
}

export default function JsonLd({ data }: JsonLdProps) {
  if (data == null) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
