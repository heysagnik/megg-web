# MEGG API V2 & Gender Filtering Migration Guide

This guide outlines the changes required for all frontend clients (Web, iOS, Android) to adopt the newly structured V2 API and the new gender separation feature.

## 1. Opting in to API V2

The V1 API response structure is being deprecated. To receive the new, standard V2 envelope, clients **must** pass the following header with every request:

```http
X-API-Version: 2
```

## 2. The V2 Response Envelope

In V1, responses were often inconsistent (sometimes arrays, sometimes objects with `success`, etc.). In V2, **every endpoint** strictly adheres to this standard envelope shape:

### Success Response (2xx)
```json
{
  "success": true,
  "data": { ... },     // The requested resource or array of resources (can be null)
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-07-10T00:00:00.000Z",
    // Collections will include pagination:
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 194,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Error Response (4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource could not be found.",
    "details": null // Optional additional context
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-07-10T00:00:00.000Z"
  }
}
```

## 3. Requesting Men's vs. Women's Products

The backend now fully separates products by gender. To request products for a specific gender, you **must pass the `gender` query parameter**. 

**Important:** If the `gender` parameter is omitted, the API will default to returning `men`'s products to preserve backwards compatibility with older clients.

### Examples

**Men's Products (Default):**
```http
GET /api/products/list?sort=newest
GET /api/products/list?gender=men&sort=newest
GET /api/trending
```

**Women's Products:**
```http
GET /api/products/list?gender=women&sort=newest
GET /api/trending?gender=women
GET /api/search?query=shirt&gender=women
```

### Affected Endpoints
The `gender` query parameter is now supported and strictly enforced across all product-listing and discovery endpoints, including:
- `/api/products/list`
- `/api/products/new-arrivals`
- `/api/search`
- `/api/trending`
- `/api/outfits/*`
- `/api/reels/*`
- `/api/subcategories/*`

## 4. Key Takeaways for Frontend Teams

1. **Add the Header**: Configure your HTTP client (Axios, Fetch, Apollo, etc.) to globally inject `X-API-Version: 2` into all outgoing requests to `api.meggfashion.in` and `edge.meggfashion.in`.
2. **Update State Selectors**: Ensure your app state and UI components map to `response.data` (and `response.meta.pagination`) instead of assuming the root response is the data.
3. **Pass the Gender Query**: Ensure your global app state (e.g., currently selected user gender preference) is appended as `?gender=women` or `?gender=men` to all API calls fetching products, categories, or discovery feeds.
