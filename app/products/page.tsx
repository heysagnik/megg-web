import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import { getCategoryDisplay } from "@/lib/utils";
import { Container, PageHeader, CardSkeleton } from "@/components/ui";
import FilterTabs from "@/components/product/FilterTabs";
import ProductsClientList from "@/components/product/ProductsClientList";
import type { Metadata } from "next";

/* ─── Metadata ───────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Shop",
  description: "Browse curated fashion on MEGG.",
};

/* ─── Page ───────────────────────────────────────────── */
interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  /* Next.js 15 — searchParams is a Promise */
  const params = await searchParams;
  const category = params.category ?? "";

  /* Fetch first page on the server; gracefully fall back to empty */
  const data = await getProducts(1, 20, category || undefined).catch(() => ({
    products: [],
    page: 1,
    limit: 20,
  }));

  const title = category ? getCategoryDisplay(category) : "All Products";

  return (
    <>
      {/* ── Page header ──────────────────────────────── */}
      <Container>
        <PageHeader
          crumbs={[
            { label: "Home", to: "/" },
            { label: "Shop" },
          ]}
          title={title}
          below={<FilterTabs activeCategory={category} />}
        />
      </Container>

      {/* ── Product grid (client — handles infinite scroll) */}
      {/*
       * key={category} forces a clean remount whenever the category
       * changes so the client component's local state (page, products,
       * seenIds) starts fresh with the new server-fetched initialProducts.
       */}
      <Suspense
        key={category}
        fallback={
          <Container
            style={{
              paddingTop: "var(--space-xl)",
              paddingBottom: "var(--space-2xl)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem 1rem",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </Container>
        }
      >
        <ProductsClientList
          key={category}
          category={category}
          initialProducts={data.products}
        />
      </Suspense>
    </>
  );
}
